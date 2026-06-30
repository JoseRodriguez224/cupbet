import { formatCurrency, formatCents } from "../utils/formatters";
import { useWallet } from "../context/WalletContext";

export function PortfolioPanel() {
  const { connected, bets, balance, totalWagered } = useWallet();

  const openPositions = bets.filter((b) => b.status === "open");
  const totalExposure = openPositions.reduce((sum, b) => sum + b.stake, 0);
  const totalPotential = openPositions.reduce((sum, b) => sum + b.potentialPayout, 0);

  return (
    <section className="pm-portfolio">
      <h2>Portfolio</h2>

      {!connected ? (
        <p className="muted">Connect wallet to view positions.</p>
      ) : (
        <>
          <div className="pm-portfolio__stats">
            <div>
              <span>Balance</span>
              <strong>{formatCurrency(balance)}</strong>
            </div>
            <div>
              <span>Open positions</span>
              <strong>{openPositions.length}</strong>
            </div>
            <div>
              <span>Exposure</span>
              <strong>{formatCurrency(totalExposure)}</strong>
            </div>
            <div>
              <span>Max return</span>
              <strong className="text-yes">{formatCurrency(totalPotential)}</strong>
            </div>
          </div>

          {openPositions.length === 0 ? (
            <p className="muted pm-portfolio__empty">No open positions yet.</p>
          ) : (
            <ul className="pm-positions">
              {openPositions.slice(0, 6).map((bet) => (
                <li key={bet.id} className="pm-position">
                  <div className="pm-position__top">
                    <span className={`pm-side pm-side--${bet.side}`}>
                      {bet.side === "yes" ? "Yes" : "No"}
                    </span>
                    <span>{formatCents(bet.price)}</span>
                  </div>
                  <p className="pm-position__label">{bet.outcomeLabel}</p>
                  <p className="pm-position__q muted">{bet.question}</p>
                  <div className="pm-position__foot">
                    <span>{formatCurrency(bet.stake)}</span>
                    <span className="text-yes">→ {formatCurrency(bet.potentialPayout)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {totalWagered > 0 && (
            <p className="pm-portfolio__wagered muted">
              Lifetime volume: {formatCurrency(totalWagered)}
            </p>
          )}
        </>
      )}
    </section>
  );
}
