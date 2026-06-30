import { FINANCE, SITE } from "../constants/config";
import { formatCompact } from "../utils/finance";

export function HeroBanner({ liveCount, totalMatches, lastUpdated, source }) {
  return (
    <section className="hero" id="top">
      <div className="hero-content">
        <p className="hero-eyebrow">Live from FIFA World Cup 2026</p>
        <h1>
          Bet on every match.
          <span> Pay with crypto.</span>
        </h1>
        <p className="hero-sub">
          Real-time scores · High-stakes betting up to {formatCompact(FINANCE.maxStake)} USDT ·{" "}
          {SITE.hosts}
        </p>
        <div className="hero-stats">
          <div className="stat-pill stat-pill--gold">Real USDT · MetaMask</div>
          <div className="stat-pill stat-pill--live">
            <span className="pulse" aria-hidden />
            {liveCount} Live Now
          </div>
          <div className="stat-pill">{totalMatches} Matches</div>
          {lastUpdated && (
            <div className="stat-pill stat-pill--muted">
              Updated {lastUpdated.toLocaleTimeString()}
              {source && ` · ${source}`}
            </div>
          )}
        </div>
      </div>
      <div className="hero-visual" aria-hidden>
        <div className="hero-globe">🏆</div>
      </div>
    </section>
  );
}
