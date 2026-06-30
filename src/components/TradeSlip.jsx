import { useState } from "react";
import { FINANCE } from "../constants/config";
import { useTrade } from "../context/TradeContext";
import { useWallet } from "../context/WalletContext";
import { formatCurrency, formatCents } from "../utils/formatters";

export function TradeSlip({ mobile = false }) {
  const {
    position,
    stake,
    setStake,
    clearTrade,
    shares,
    price,
    potentialPayout,
    potentialProfit,
    isOpen,
    setIsOpen,
    hasTrade,
  } = useTrade();
  const { connected, placeBet, connect, busy } = useWallet();
  const [message, setMessage] = useState(null);

  const handleTrade = () => {
    if (!position) return;
    const result = placeBet({
      marketId: position.marketId,
      question: position.question,
      outcomeKey: position.outcomeKey,
      outcomeLabel: position.outcomeLabel,
      side: position.side,
      price,
      shares,
      stake,
      potentialPayout,
    });
    if (!result.ok) {
      setMessage({ type: "error", text: result.error });
      return;
    }
    setMessage({ type: "success", text: "Trade placed successfully!" });
    clearTrade();
    setTimeout(() => setMessage(null), 3000);
  };

  const content = (
    <div className={`pm-trade${mobile ? " pm-trade--mobile" : ""}`}>
      <div className="pm-trade__head">
        <h2>Trade</h2>
        {hasTrade && (
          <button type="button" className="btn-text" onClick={clearTrade}>
            Clear
          </button>
        )}
        {mobile && (
          <button type="button" className="btn-text" onClick={() => setIsOpen(false)}>
            Close
          </button>
        )}
      </div>

      {!position ? (
        <div className="pm-trade__empty">
          <p>
            Select <strong>Yes</strong> or <strong>No</strong> on any market to trade.
          </p>
          <p className="muted">Prices reflect live win probability.</p>
        </div>
      ) : (
        <>
          <div className="pm-trade__selection">
            <span className={`pm-side pm-side--${position.side}`}>
              {position.side === "yes" ? "Buy Yes" : "Buy No"}
            </span>
            <p className="pm-trade__question">{position.question}</p>
            <p className="pm-trade__outcome">{position.outcomeLabel}</p>
            <div className="pm-trade__price">
              Price <strong>{formatCents(price)}</strong>
            </div>
          </div>

          <label htmlFor={`trade-stake-${mobile ? "m" : "d"}`}>Amount (USDT)</label>
          <div className="stake-input-row">
            <input
              id={`trade-stake-${mobile ? "m" : "d"}`}
              type="number"
              min={FINANCE.minStake}
              max={FINANCE.maxStake}
              value={stake}
              onChange={(e) => setStake(Number(e.target.value))}
            />
            {FINANCE.stakePresets.slice(0, 4).map((v) => (
              <button key={v} type="button" className="stake-chip" onClick={() => setStake(v)}>
                {v >= 1000 ? `${v / 1000}k` : v}
              </button>
            ))}
          </div>

          <div className="pm-trade__summary">
            <div>
              <span>Shares</span>
              <strong>{shares.toFixed(2)}</strong>
            </div>
            <div>
              <span>Max payout</span>
              <strong className="text-gold">{formatCurrency(potentialPayout)}</strong>
            </div>
            <div className="pm-trade__profit">
              <span>Potential profit</span>
              <strong className="text-yes">+{formatCurrency(potentialProfit)}</strong>
            </div>
          </div>

          {message && (
            <p className={`betslip-message betslip-message--${message.type}`}>{message.text}</p>
          )}

          {!connected ? (
            <button type="button" className="btn btn-primary btn-block" onClick={connect}>
              Connect Wallet to Trade
            </button>
          ) : (
            <button
              type="button"
              className={`btn btn-block pm-trade__submit pm-trade__submit--${position.side}`}
              onClick={handleTrade}
              disabled={busy}
            >
              {position.side === "yes" ? "Buy Yes" : "Buy No"} · {formatCurrency(stake)}
            </button>
          )}
        </>
      )}
    </div>
  );

  if (mobile) {
    return (
      <>
        {hasTrade && (
          <button type="button" className="mobile-betslip-fab" onClick={() => setIsOpen(true)}>
            Trade · {formatCents(price)}
          </button>
        )}
        {isOpen && (
          <div className="mobile-betslip-overlay" onClick={() => setIsOpen(false)}>
            <div className="mobile-betslip-drawer" onClick={(e) => e.stopPropagation()}>
              {content}
            </div>
          </div>
        )}
      </>
    );
  }

  return content;
}
