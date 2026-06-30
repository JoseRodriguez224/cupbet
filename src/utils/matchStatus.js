export const STATUS = {
  LIVE: "live",
  UPCOMING: "upcoming",
  FINISHED: "finished",
};

export function parseApiDate(localDate) {
  if (!localDate) return null;
  const parsed = new Date(localDate);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  const match = localDate.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/);
  if (!match) return null;
  const [, mm, dd, yyyy, hh, min] = match;
  return new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:00`);
}

export function normalizeFinished(value) {
  return String(value ?? "").toUpperCase() === "TRUE";
}

export function getMatchStatus(match) {
  if (match.status === STATUS.LIVE) return STATUS.LIVE;
  if (match.status === STATUS.FINISHED) return STATUS.FINISHED;
  if (match.status === STATUS.UPCOMING) return STATUS.UPCOMING;

  const elapsed = String(match.timeElapsed ?? "").toLowerCase();
  if (normalizeFinished(match.finished) || elapsed === "finished") return STATUS.FINISHED;
  if (elapsed && elapsed !== "notstarted" && elapsed !== "finished") return STATUS.LIVE;

  const kickoff = match.kickoff instanceof Date ? match.kickoff : parseApiDate(match.localDate);
  if (kickoff && kickoff.getTime() <= Date.now()) {
    return normalizeFinished(match.finished) ? STATUS.FINISHED : STATUS.LIVE;
  }
  return STATUS.UPCOMING;
}

export function getStageLabel(type, group) {
  const stages = {
    group: `Group ${group}`,
    r32: "Round of 32",
    r16: "Round of 16",
    qf: "Quarter-Final",
    sf: "Semi-Final",
    tp: "Third Place",
    final: "Final",
  };
  return stages[type] ?? group ?? "Knockout";
}

export function getTeamName(match, side) {
  if (side === "home") {
    return match.homeTeam || match.homeTeamLabel || "TBD";
  }
  return match.awayTeam || match.awayTeamLabel || "TBD";
}
