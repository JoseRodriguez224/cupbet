import { API } from "../constants/config";
import { getMatchStatus, parseApiDate, STATUS } from "../utils/matchStatus";

function normalizePrimaryGame(game) {
  const homeTeam = game.home_team_name_en || game.home_team_label || "TBD";
  const awayTeam = game.away_team_name_en || game.away_team_label || "TBD";
  const kickoff = parseApiDate(game.local_date);
  const finished = String(game.finished ?? "").toUpperCase() === "TRUE";
  const elapsed = String(game.time_elapsed ?? "").toLowerCase();

  let status = STATUS.UPCOMING;
  if (finished || elapsed === "finished") status = STATUS.FINISHED;
  else if (elapsed && elapsed !== "notstarted") status = STATUS.LIVE;

  return {
    id: game.id ?? game._id,
    homeTeam,
    awayTeam,
    homeTeamLabel: game.home_team_label,
    awayTeamLabel: game.away_team_label,
    homeScore: Number(game.home_score) || 0,
    awayScore: Number(game.away_score) || 0,
    group: game.group,
    matchday: game.matchday,
    type: game.type ?? "group",
    kickoff,
    localDate: game.local_date,
    finished,
    timeElapsed: game.time_elapsed,
    status,
    source: "worldcup26",
  };
}

function normalizeFallbackMatch(match, index) {
  const kickoff = match.date ? new Date(`${match.date}T12:00:00`) : null;
  const hasScore = match.score?.ft;
  const status = hasScore ? STATUS.FINISHED : STATUS.UPCOMING;

  return {
    id: `fb-${index}`,
    homeTeam: match.team1,
    awayTeam: match.team2,
    homeScore: hasScore ? match.score.ft[0] : 0,
    awayScore: hasScore ? match.score.ft[1] : 0,
    group: match.group?.replace("Group ", "") ?? "",
    matchday: match.round,
    type: "group",
    kickoff,
    localDate: match.date,
    finished: Boolean(hasScore),
    timeElapsed: hasScore ? "finished" : "notstarted",
    status,
    ground: match.ground,
    source: "openfootball",
  };
}

export async function fetchMatches() {
  try {
    const response = await fetch(API.primary, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Primary API ${response.status}`);
    const data = await response.json();
    const games = (data.games ?? data).map(normalizePrimaryGame);
    games.sort((a, b) => {
      const ta = a.kickoff?.getTime() ?? Infinity;
      const tb = b.kickoff?.getTime() ?? Infinity;
      return ta - tb;
    });
    return { matches: games, source: "worldcup26.ir" };
  } catch (primaryError) {
    const response = await fetch(API.fallback, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw primaryError;
    const data = await response.json();
    const matches = (data.matches ?? []).map(normalizeFallbackMatch);
    return { matches, source: "openfootball (fallback)" };
  }
}

export async function fetchGroups() {
  try {
    const [groupsRes, teamsRes] = await Promise.all([
      fetch(API.groups, { signal: AbortSignal.timeout(15000) }),
      fetch("https://worldcup26.ir/get/teams", { signal: AbortSignal.timeout(15000) }),
    ]);
    if (!groupsRes.ok) return [];
    const data = await groupsRes.json();
    const groups = data.groups ?? data ?? [];

    let teamMap = {};
    if (teamsRes.ok) {
      const teamsData = await teamsRes.json();
      (teamsData.teams ?? teamsData ?? []).forEach((t) => {
        teamMap[t.id ?? t.idTeam] = t.name_en ?? t.name ?? t.team;
      });
    }

    return groups.map((group) => ({
      ...group,
      teams: (group.teams ?? []).map((row) => ({
        ...row,
        name: teamMap[row.team_id] ?? `Team ${row.team_id}`,
        played: row.mp,
        won: row.w,
        points: row.pts,
        goal_diff: row.gd,
      })),
    }));
  } catch {
    return [];
  }
}

export function filterMatches(matches, filter) {
  return matches.filter((match) => {
    const status = getMatchStatus(match);
    if (filter.status !== "all" && status !== filter.status) return false;
    if (filter.group !== "all" && match.group !== filter.group) return false;
    if (filter.search) {
      const q = filter.search.toLowerCase();
      const haystack = `${match.homeTeam} ${match.awayTeam} ${match.group}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function getLiveMatches(matches) {
  return matches.filter((m) => getMatchStatus(m) === STATUS.LIVE);
}
