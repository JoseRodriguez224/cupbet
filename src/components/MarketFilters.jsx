const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export function MarketFilters({ filter, onChange, counts }) {
  return (
    <div className="pm-filters">
      <div className="pm-filter-tabs">
        {[
          { id: "all", label: "All Markets" },
          { id: "live", label: "Live", hot: true },
          { id: "upcoming", label: "Upcoming" },
          { id: "finished", label: "Resolved" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`pm-filter-tab${filter.status === tab.id ? " pm-filter-tab--active" : ""}`}
            onClick={() => onChange({ ...filter, status: tab.id })}
          >
            {tab.label}
            <span>{counts[tab.id] ?? counts.all}</span>
          </button>
        ))}
      </div>

      <div className="pm-filter-row">
        <input
          type="search"
          className="pm-search"
          placeholder="Search markets, teams…"
          value={filter.search}
          onChange={(e) => onChange({ ...filter, search: e.target.value })}
        />
        <select
          className="pm-select"
          value={filter.group}
          onChange={(e) => onChange({ ...filter, group: e.target.value })}
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
