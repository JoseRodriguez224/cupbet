import { useMemo } from "react";
import { useTrade } from "../context/TradeContext";
import { buildMatchMarket } from "../services/marketEngine";
import { formatKickoff, formatCents, formatVolumeDisplay } from "../utils/formatters";
import { STATUS } from "../utils/matchStatus";
import { TeamBadge } from "./TeamBadge";

export function MarketCard({ match }) {
  const { selectOutcome, position } = useTrade();
  const market = useMemo(() => buildMatchMarket(match), [match]);
  const { home, away, status, stage, question, volume, trend, canTrade, outcomes } = market;

  const isSelected = (outcomeKey, side) =>
    position?.marketId === match.id &&
    position?.outcomeKey === outcomeKey &&
    position?.side === side;

  const buy = (outcome, side) => {
    if (!canTrade) return;
    selectOutcome({
      marketId: match.id,
      question,
      outcomeKey: outcome.key,
      outcomeLabel: outcome.label,
      price: outcome.price,
      noPrice: outcome.noPrice,
      side,
      homeTeam: home,
      awayTeam: away,
      status,
    });
  };

  const leading = outcomes.reduce((a, b) => (a.price > b.price ? a : b));

  return (
    <article className={`pm-card pm-card--${status}`}>
      <div className="pm-card__top">
        <div className="pm-card__teams">
          <TeamBadge name={home} size={32} />
          <TeamBadge name={away} size={32} />
        </div>
        <div className="pm-card__meta">
          <span className="pm-tag">{stage}</span>
          {status === STATUS.LIVE && (
            <span className="pm-live">
              <span className="pulse" aria-hidden />
              LIVE {match.timeElapsed !== "finished" ? match.timeElapsed : ""}
            </span>
          )}
          {status === STATUS.FINISHED && <span className="pm-tag pm-tag--muted">Resolved</span>}
          {status === STATUS.UPCOMING && (
            <span className="pm-tag pm-tag--muted">{formatKickoff(match.kickoff)}</span>
          )}
        </div>
      </div>

      <h3 className="pm-card__question">{question}</h3>

      {status !== STATUS.UPCOMING && (
        <div className="pm-scoreline">
          <span>{home}</span>
          <strong>
            {match.homeScore} – {match.awayScore}
          </strong>
          <span>{away}</span>
        </div>
      )}

      <div className="pm-card__stats">
        <span>{formatVolumeDisplay(volume)}</span>
        <span className={trend >= 0 ? "pm-trend pm-trend--up" : "pm-trend pm-trend--down"}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
        </span>
        <span className="pm-leading">
          Leading: <strong>{leading.label}</strong> {formatCents(leading.price)}
        </span>
      </div>

      <div className="pm-outcomes">
        {outcomes.map((outcome) => (
          <div key={outcome.key} className="pm-outcome">
            <div className="pm-outcome__head">
              <span className="pm-outcome__label">{outcome.label}</span>
              <span className="pm-outcome__prob">{formatCents(outcome.price)}</span>
            </div>
            <div className="pm-outcome__bar" aria-hidden>
              <span style={{ width: `${outcome.price}%` }} />
            </div>
            <div className="pm-outcome__actions">
              <button
                type="button"
                className={`pm-btn pm-btn--yes${isSelected(outcome.key, "yes") ? " pm-btn--active" : ""}`}
                disabled={!canTrade}
                onClick={() => buy(outcome, "yes")}
              >
                Yes {formatCents(outcome.price)}
              </button>
              <button
                type="button"
                className={`pm-btn pm-btn--no${isSelected(outcome.key, "no") ? " pm-btn--active" : ""}`}
                disabled={!canTrade}
                onClick={() => buy(outcome, "no")}
              >
                No {formatCents(outcome.noPrice)}
              </button>
            </div>
          </div>
        ))}
      </div>

      {!canTrade && status === STATUS.FINISHED && (
        <p className="pm-card__closed">Market resolved — trading closed</p>
      )}
    </article>
  );
}
