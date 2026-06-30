import { getTeamName } from "../utils/matchStatus";
import { TeamBadge } from "./TeamBadge";

export function LiveTicker({ matches }) {
  if (!matches.length) return null;

  const items = [...matches, ...matches];

  return (
    <div className="live-ticker" aria-label="Live scores">
      <div className="live-ticker-label">
        <span className="pulse" aria-hidden />
        LIVE
      </div>
      <div className="live-ticker-track">
        <div className="live-ticker-content">
          {items.map((match, i) => (
            <span key={`${match.id}-${i}`} className="live-ticker-item">
              <TeamBadge name={getTeamName(match, "home")} size={18} />
              <strong>{getTeamName(match, "home")}</strong>
              <span className="live-score">
                {match.homeScore} – {match.awayScore}
              </span>
              <strong>{getTeamName(match, "away")}</strong>
              <TeamBadge name={getTeamName(match, "away")} size={18} />
              <span className="live-minute">{match.timeElapsed}&apos;</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
