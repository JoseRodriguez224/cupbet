import { formatVolumeDisplay, formatCents } from "../utils/formatters";
import { STATUS } from "../utils/matchStatus";
import { TeamBadge } from "./TeamBadge";

export function TrendingMarkets({ markets }) {
  if (!markets.length) return null;

  return (
    <section className="pm-trending" aria-label="Trending markets">
      <div className="pm-trending__head">
        <h2>Trending</h2>
        <span className="muted">Highest volume World Cup markets</span>
      </div>
      <div className="pm-trending__track">
        {markets.map((market) => {
          const top = market.outcomes.reduce((a, b) => (a.price > b.price ? a : b));
          return (
            <a key={market.match.id} href="#markets" className="pm-trend-card">
              <div className="pm-trend-card__flags">
                <TeamBadge name={market.home} size={24} />
                <TeamBadge name={market.away} size={24} />
              </div>
              <p className="pm-trend-card__title">
                {market.home} vs {market.away}
              </p>
              <div className="pm-trend-card__prob">
                <strong>{formatCents(top.price)}</strong>
                <span>{top.label}</span>
              </div>
              <div className="pm-trend-card__foot">
                <span>{formatVolumeDisplay(market.volume)}</span>
                {market.status === STATUS.LIVE && (
                  <span className="pm-live-sm">
                    <span className="pulse" aria-hidden />
                    LIVE
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
