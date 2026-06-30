import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { SERVER_WALLET } from "../constants/serverWallet";
import { FINANCE, SITE } from "../constants/config";
import { formatCurrency } from "../utils/formatters";
import { formatCompact } from "../utils/finance";

function loadAllAccounts() {
  const accounts = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key?.startsWith("cupbet_account_")) continue;
    try {
      const data = JSON.parse(localStorage.getItem(key));
      accounts.push({
        key,
        address: key.replace("cupbet_account_", ""),
        ...data,
      });
    } catch {
      /* ignore */
    }
  }
  return accounts;
}

export function AdminDashboard({ onBack }) {
  const { logout, session } = useAuth();

  const stats = useMemo(() => {
    const accounts = loadAllAccounts();
    const allBets = accounts.flatMap((a) =>
      (a.bets ?? []).map((b) => ({ ...b, wallet: a.address }))
    );

    return {
      accounts,
      allBets,
      totalDeposited: accounts.reduce((s, a) => s + (a.totalDeposited ?? 0), 0),
      totalWagered: accounts.reduce((s, a) => s + (a.totalWagered ?? 0), 0),
      totalBalance: accounts.reduce((s, a) => s + (a.balance ?? 0), 0),
      openBets: allBets.filter((b) => b.status === "open").length,
    };
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">Administrator</p>
          <h1>{SITE.name} Control Panel</h1>
        </div>
        <div className="admin-header__actions">
          <button type="button" className="btn btn-ghost" onClick={onBack}>
            ← Back to Site
          </button>
          <button type="button" className="btn btn-primary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-grid">
        <section className="admin-card admin-card--highlight">
          <h2>Server Wallet</h2>
          <p className="muted">Deposits from users are sent here (admin only).</p>
          <code className="admin-wallet">{SERVER_WALLET}</code>
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={() => navigator.clipboard.writeText(SERVER_WALLET)}
          >
            Copy Wallet Address
          </button>
        </section>

        <section className="admin-card">
          <h2>Platform Stats</h2>
          <div className="admin-stats">
            <div><span>Connected wallets</span><strong>{stats.accounts.length}</strong></div>
            <div><span>Total deposited</span><strong>{formatCurrency(stats.totalDeposited)}</strong></div>
            <div><span>Total wagered</span><strong>{formatCurrency(stats.totalWagered)}</strong></div>
            <div><span>User balances</span><strong>{formatCurrency(stats.totalBalance)}</strong></div>
            <div><span>Open positions</span><strong>{stats.openBets}</strong></div>
            <div><span>Max bet limit</span><strong>{formatCompact(FINANCE.maxStake)} USDT</strong></div>
          </div>
        </section>

        <section className="admin-card">
          <h2>Session</h2>
          <ul className="admin-meta">
            <li>
              <span>Status</span>
              <strong className="text-yes">Authenticated</strong>
            </li>
            {session?.loggedInAt && (
              <li>
                <span>Logged in</span>
                <strong>{new Date(session.loggedInAt).toLocaleString()}</strong>
              </li>
            )}
            {session?.expiresAt && (
              <li>
                <span>Session expires</span>
                <strong>{new Date(session.expiresAt).toLocaleString()}</strong>
              </li>
            )}
          </ul>
        </section>

        <section className="admin-card admin-card--wide">
          <h2>Recent Trades (local data)</h2>
          {stats.allBets.length === 0 ? (
            <p className="muted">No trades recorded yet in this browser.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Outcome</th>
                    <th>Side</th>
                    <th>Stake</th>
                    <th>Payout</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.allBets.slice(0, 20).map((bet) => (
                    <tr key={bet.id}>
                      <td>{bet.outcomeLabel ?? "—"}</td>
                      <td>{bet.side === "yes" ? "Yes" : "No"}</td>
                      <td>{formatCurrency(bet.stake)}</td>
                      <td>{formatCurrency(bet.potentialPayout)}</td>
                      <td>{bet.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
