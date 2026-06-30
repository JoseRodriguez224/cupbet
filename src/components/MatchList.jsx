import { MatchCard } from "./MatchCard";

export function MatchList({ matches, loading, error, onRetry }) {
  if (loading && !matches.length) {
    return (
      <div className="match-list match-list--loading">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton-card" />
        ))}
      </div>
    );
  }

  if (error && !matches.length) {
    return (
      <div className="empty-state">
        <p>Could not load matches: {error}</p>
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  if (!matches.length) {
    return (
      <div className="empty-state">
        <p>No matches match your filters.</p>
      </div>
    );
  }

  return (
    <div className="match-list" id="matches">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
