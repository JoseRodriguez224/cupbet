import { SITE } from "../constants/config";
import { formatCurrency } from "../utils/formatters";

export function Header({ onOpenWallet, onOpenBetslip, betCount }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top">
          <span className="brand-icon" aria-hidden>⚽</span>
          <span className="brand-text">
            <strong>{SITE.name}</strong>
            <small>{SITE.tournament}</small>
          </span>
        </a>

        <nav className="header-nav" aria-label="Main">
          <a href="#matches">Matches</a>
          <a href="#standings">Standings</a>
          <a href="#wallet">Wallet</a>
        </nav>

        <div className="header-actions">
          <button type="button" className="btn btn-ghost header-betslip" onClick={onOpenBetslip}>
            Bet Slip
            {betCount > 0 && <span className="badge">{betCount}</span>}
          </button>
          <button type="button" className="btn btn-primary" onClick={onOpenWallet}>
            <WalletButtonLabel />
          </button>
        </div>
      </div>
    </header>
  );
}

function WalletButtonLabel() {
  return <span>Connect Wallet</span>;
}

export function HeaderWallet({ balance, connected, onOpenWallet }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top">
          <span className="brand-icon" aria-hidden>⚽</span>
          <span className="brand-text">
            <strong>{SITE.name}</strong>
            <small>{SITE.tournament}</small>
          </span>
        </a>

        <nav className="header-nav" aria-label="Main">
          <a href="#matches">Matches</a>
          <a href="#standings">Standings</a>
          <a href="#wallet">Wallet</a>
        </nav>

        <div className="header-actions">
          <button type="button" className="btn btn-ghost" onClick={onOpenWallet}>
            {connected ? formatCurrency(balance) : "Connect Wallet"}
          </button>
        </div>
      </div>
    </header>
  );
}
