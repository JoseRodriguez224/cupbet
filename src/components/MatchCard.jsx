import { useMemo } from "react";
import { useBetSlip } from "../context/BetSlipContext";
import { generateMatchOdds } from "../services/oddsEngine";
import { formatKickoff } from "../utils/formatters";
import { getMatchStatus, getStageLabel, getTeamName, STATUS } from "../utils/matchStatus";
import { OddsButton } from "./OddsButton";
import { TeamBadge } from "./TeamBadge";

export function MatchCard({ match }) {
  const { addSelection, selections } = useBetSlip();
  const status = getMatchStatus(match);
  const odds = useMemo(() => generateMatchOdds({ ...match, status }), [match, status]);
  const home = getTeamName(match, "home");
  const away = getTeamName(match, "away");
  const canBet = status !== STATUS.FINISHED && !home.startsWith("Winner") && !away.startsWith("Winner");

  const existing = selections.find((s) => s.matchId === match.id);

  const pick = (market, label, value) => {
    if (!canBet) return;
    addSelection({
      matchId: match.id,
      homeTeam: home,
      awayTeam: away,
      market,
      pick: label,
      odds: value,
      status,
    });
  };

  return (
    <article className={`match-card match-card--${status}`}>
      <header className="match-card__header">
        <div className="match-card__meta">
          <span className="match-stage">{getStageLabel(match.type, match.group)}</span>
          {status === STATUS.LIVE && (
            <span className="match-live-badge">
              <span className="pulse" aria-hidden />
              LIVE {match.timeElapsed !== "finished" ? match.timeElapsed : ""}
            </span>
          )}
          {status === STATUS.FINISHED && <span className="match-finished-badge">FT</span>}
          {status === STATUS.UPCOMING && (
            <span className="match-time">{formatKickoff(match.kickoff)}</span>
          )}
        </div>
      </header>

      <div className="match-card__teams">
        <div className="match-team">
          <TeamBadge name={home} />
          <span className="match-team-name">{home}</span>
          {status !== STATUS.UPCOMING && (
            <span className="match-score">{match.homeScore}</span>
          )}
        </div>
        <span className="match-vs">vs</span>
        <div className="match-team match-team--away">
          {status !== STATUS.UPCOMING && (
            <span className="match-score">{match.awayScore}</span>
          )}
          <span className="match-team-name">{away}</span>
          <TeamBadge name={away} />
        </div>
      </div>

      <div className="match-card__odds">
        <OddsButton
          label="1"
          odds={odds.home}
          selected={existing?.market === "1X2" && existing?.pick === home}
          disabled={!canBet}
          onClick={() => pick("1X2", home, odds.home)}
        />
        <OddsButton
          label="X"
          odds={odds.draw}
          selected={existing?.market === "1X2" && existing?.pick === "Draw"}
          disabled={!canBet}
          onClick={() => pick("1X2", "Draw", odds.draw)}
        />
        <OddsButton
          label="2"
          odds={odds.away}
          selected={existing?.market === "1X2" && existing?.pick === away}
          disabled={!canBet}
          onClick={() => pick("1X2", away, odds.away)}
        />
      </div>

      {!canBet && status === STATUS.FINISHED && (
        <p className="match-card__note">Market closed — match finished</p>
      )}
      {!canBet && status !== STATUS.FINISHED && (
        <p className="match-card__note">Odds available once teams are confirmed</p>
      )}
    </article>
  );
}
