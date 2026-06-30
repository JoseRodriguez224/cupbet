import { FINANCE } from "../constants/config";
import { formatCompact } from "../utils/finance";

export function PromoBanner({ onDeposit }) {
  return (
    <section className="promo-banner" aria-label="Promotions">
      <div className="promo-banner__inner">
        <div className="promo-item promo-item--gold">
          <span className="promo-tag">REAL CRYPTO</span>
          <strong>MetaMask USDT</strong>
          <span>Connect & fund to bet with real money</span>
        </div>
        <div className="promo-item">
          <span className="promo-tag">DEPOSIT BOOST</span>
          <strong>Up to +15% Bonus</strong>
          <span>On deposits from 10,000 USDT</span>
        </div>
        <div className="promo-item">
          <span className="promo-tag">HIGH ROLLER</span>
          <strong>Max {formatCompact(FINANCE.maxStake)} USDT</strong>
          <span>Per single bet · {formatCompact(FINANCE.maxPayout)} max win</span>
        </div>
        <button type="button" className="btn btn-accent promo-cta" onClick={onDeposit}>
          Deposit Now
        </button>
      </div>
    </section>
  );
}
