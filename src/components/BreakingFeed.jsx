import { getMatchStatus, getTeamName, STATUS } from "../utils/matchStatus";
import { formatCents } from "../utils/formatters";
import { buildMatchMarket } from "../services/marketEngine";

export function BreakingFeed({ matches }) {
  const items = matches
    .filter((m) => getMatchStatus(m) === STATUS.LIVE || getMatchStatus(m) === STATUS.FINISHED)
    .slice(0, 8)
    .map((match) => {
      const market = buildMatchMarket(match);
      const top = market.outcomes.reduce((a, b) => (a.price > b.price ? a : b));
      return { match, market, top };
    });

  if (!items.length) {
    return (
      <section className="pm-breaking">
        <h2>Activity</h2>
        <p className="muted">Live match updates will appear here.</p>
      </section>
    );
  }

  return (
    <section className="pm-breaking">
      <h2>Breaking</h2>
      <ul className="pm-breaking__list">
        {items.map(({ match, market, top }) => (
          <li key={match.id}>
            <span className="pm-breaking__time">
              {getMatchStatus(match) === STATUS.LIVE ? "LIVE" : "FT"}
            </span>
            <div>
              <strong>
                {getTeamName(match, "home")} {match.homeScore}–{match.awayScore}{" "}
                {getTeamName(match, "away")}
              </strong>
              <p className="muted">
                {top.label} {formatCents(top.price)} · {market.stage}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
