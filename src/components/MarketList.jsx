import { MarketCard } from "./MarketCard";

export function MarketList({ matches, loading, error, onRetry }) {
  if (loading && !matches.length) {
    return (
      <div className="pm-feed pm-feed--loading">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="pm-skeleton" />
        ))}
      </div>
    );
  }

  if (error && !matches.length) {
    return (
      <div className="pm-empty">
        <p>Could not load markets: {error}</p>
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (!matches.length) {
    return <div className="pm-empty"><p>No markets match your filters.</p></div>;
  }

  return (
    <div className="pm-feed" id="markets">
      {matches.map((match) => (
        <MarketCard key={match.id} match={match} />
      ))}
    </div>
  );
}
