export function GroupStandings({ groups }) {
  if (!groups.length) {
    return (
      <section className="standings-panel" id="standings">
        <h2>Group Standings</h2>
        <p className="muted">Standings load from live tournament data.</p>
      </section>
    );
  }

  return (
    <section className="standings-panel" id="standings">
      <h2>Group Standings</h2>
      <div className="standings-grid">
        {groups.slice(0, 12).map((group) => (
          <div key={group.name ?? group.group ?? group._id} className="standings-group">
            <h3>Group {group.name ?? group.group}</h3>
            <table>
              <thead>
                <tr>
                  <th>Team</th>
                  <th>P</th>
                  <th>W</th>
                  <th>GD</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {(group.teams ?? group.table ?? []).slice(0, 4).map((row, i) => (
                  <tr key={i}>
                    <td>{row.name ?? row.name_en ?? row.team ?? `Team ${i + 1}`}</td>
                    <td>{row.played ?? row.mp ?? row.p ?? "—"}</td>
                    <td>{row.won ?? row.w ?? "—"}</td>
                    <td>{row.goal_diff ?? row.gd ?? "—"}</td>
                    <td>{row.points ?? row.pts ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </section>
  );
}
