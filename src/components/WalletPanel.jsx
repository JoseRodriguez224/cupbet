import { FINANCE } from "../constants/config";
import { useWallet } from "../context/WalletContext";
import { formatCurrency, formatCents, truncateAddress } from "../utils/formatters";
import { formatCompact } from "../utils/finance";

export function WalletPanel() {
  const {
    connected,
    address,
    balance,
    totalDeposited,
    totalWagered,
    bets,
    hasProvider,
    connect,
    disconnect,
    setShowDeposit,
  } = useWallet();

  return (
    <section className="wallet-panel" id="wallet">
      <div className="wallet-panel__header">
        <h2>Your Wallet</h2>
        <p>
          Connect MetaMask and send USDT to bet with real money · Up to{" "}
          {formatCompact(FINANCE.maxStake)} USDT per bet
        </p>
      </div>

      {!hasProvider && (
        <p className="wallet-flash wallet-flash--error">
          Install MetaMask to connect your wallet and fund your account.
        </p>
      )}

      <div className="wallet-card">
        <div className="wallet-balance">
          <span>Betting balance</span>
          <strong>{connected ? formatCurrency(balance) : "—"}</strong>
        </div>

        {connected && (
          <>
            <p className="wallet-address">Connected: {truncateAddress(address)}</p>
            <div className="wallet-stats-row">
              <div>
                <span>Total funded</span>
                <strong>{formatCurrency(totalDeposited)}</strong>
              </div>
              <div>
                <span>Total wagered</span>
                <strong>{formatCurrency(totalWagered)}</strong>
              </div>
            </div>
          </>
        )}

        {!connected ? (
          <button type="button" className="btn btn-primary btn-block" onClick={connect}>
            Connect Wallet & Fund Account
          </button>
        ) : (
          <div className="wallet-actions">
            <button type="button" className="btn btn-accent" onClick={() => setShowDeposit(true)}>
              Add Funds
            </button>
            <button type="button" className="btn btn-ghost" onClick={disconnect}>
              Disconnect
            </button>
          </div>
        )}
      </div>

      <div className="wallet-card wallet-card--bonus">
        <h3>Funding Bonuses</h3>
        <ul className="bonus-tiers">
          {FINANCE.depositBonuses.map((tier) => (
            <li key={tier.label}>
              <span className="bonus-percent">+{tier.percent}%</span>
              <span>extra balance from {formatCompact(tier.min)} USDT</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="wallet-card">
        <h3>How it works</h3>
        <ol className="wallet-steps">
          <li>Click <strong>Connect Wallet</strong> and approve MetaMask.</li>
          <li>Send USDT to fund your betting balance.</li>
          <li>Pick odds on any match and place your bet.</li>
          <li>Winnings are paid to your betting balance.</li>
        </ol>
      </div>

      {connected && bets.length > 0 && (
        <div className="wallet-card">
          <h3>Recent Bets</h3>
          <ul className="bet-history">
            {bets.slice(0, 8).map((bet) => (
              <li key={bet.id} className="bet-history-item">
                <div>
                  <strong>
                    {bet.side === "yes" ? "Yes" : "No"} · {bet.outcomeLabel}
                  </strong>
                  <span className="muted">{formatCents(bet.price)}</span>
                </div>
                <div className="bet-history-right">
                  <span>{formatCurrency(bet.stake)}</span>
                  <span className="text-yes">→ {formatCurrency(bet.potentialPayout)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
