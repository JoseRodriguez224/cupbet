const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export function MatchFilters({ filter, onChange, counts }) {
  return (
    <div className="match-filters">
      <div className="filter-tabs" role="tablist" aria-label="Match status">
        {[
          { id: "all", label: "All", count: counts.all },
          { id: "live", label: "Live", count: counts.live },
          { id: "upcoming", label: "Upcoming", count: counts.upcoming },
          { id: "finished", label: "Results", count: counts.finished },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={filter.status === tab.id}
            className={`filter-tab${filter.status === tab.id ? " filter-tab--active" : ""}${
              tab.id === "live" ? " filter-tab--live" : ""
            }`}
            onClick={() => onChange({ ...filter, status: tab.id })}
          >
            {tab.label}
            <span className="filter-count">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="filter-controls">
        <input
          type="search"
          className="search-input"
          placeholder="Search teams…"
          value={filter.search}
          onChange={(e) => onChange({ ...filter, search: e.target.value })}
          aria-label="Search teams"
        />
        <select
          className="group-select"
          value={filter.group}
          onChange={(e) => onChange({ ...filter, group: e.target.value })}
          aria-label="Filter by group"
        >
          <option value="all">All Groups</option>
          {GROUPS.map((g) => (
            <option key={g} value={g}>
              Group {g}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
