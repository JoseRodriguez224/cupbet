import { useState } from "react";
import { FINANCE } from "../constants/config";
import { useBetSlip } from "../context/BetSlipContext";
import { useWallet } from "../context/WalletContext";
import { formatCurrency, formatOdds } from "../utils/formatters";
import { formatCompact } from "../utils/finance";

export function BetSlip({ mobile = false }) {
  const {
    selections,
    stake,
    setStake,
    removeSelection,
    clearSlip,
    totalOdds,
    potentialPayout,
    isOpen,
    setIsOpen,
    count,
  } = useBetSlip();
  const { connected, balance, placeBet, connect } = useWallet();
  const [message, setMessage] = useState(null);

  const profit = potentialPayout - stake;

  const handlePlace = () => {
    const result = placeBet({ selections, stake, potentialPayout });
    if (!result.ok) {
      setMessage({ type: "error", text: result.error });
      return;
    }
    setMessage({ type: "success", text: `Bet placed · ${formatCurrency(stake)} staked` });
    clearSlip();
    setTimeout(() => setMessage(null), 3000);
  };

  const content = (
    <div className={`betslip${mobile ? " betslip--mobile" : ""}`}>
      <div className="betslip-header">
        <h2>Bet Slip</h2>
        {count > 0 && (
          <button type="button" className="btn-text" onClick={clearSlip}>
            Clear all
          </button>
        )}
        {mobile && (
          <button type="button" className="btn-text" onClick={() => setIsOpen(false)}>
            Close
          </button>
        )}
      </div>

      <p className="betslip-limits">
        Stake {FINANCE.minStake} – {formatCompact(FINANCE.maxStake)} USDT · Max win{" "}
        {formatCompact(FINANCE.maxPayout)} USDT
      </p>

      {!selections.length ? (
        <div className="betslip-empty">
          <p>Tap odds on any match to build your bet.</p>
          <p className="muted">High rollers welcome — up to {formatCompact(FINANCE.maxStake)} USDT per bet.</p>
        </div>
      ) : (
        <>
          <ul className="betslip-selections">
            {selections.map((s) => (
              <li key={s.matchId} className="betslip-item">
                <div className="betslip-item__top">
                  <span className="betslip-pick">{s.pick}</span>
                  <span className="betslip-odds">{formatOdds(s.odds)}</span>
                  <button
                    type="button"
                    className="betslip-remove"
                    onClick={() => removeSelection(s.matchId)}
                    aria-label="Remove selection"
                  >
                    ×
                  </button>
                </div>
                <p className="betslip-match">
                  {s.homeTeam} vs {s.awayTeam}
                </p>
                {s.status === "live" && <span className="betslip-live-tag">Live</span>}
              </li>
            ))}
          </ul>

          <div className="betslip-stake">
            <label htmlFor={`stake-${mobile ? "m" : "d"}`}>
              Stake (USDT) · Balance: {connected ? formatCurrency(balance) : "—"}
            </label>
            <div className="stake-input-row">
              <input
                id={`stake-${mobile ? "m" : "d"}`}
                type="number"
                min={FINANCE.minStake}
                max={FINANCE.maxStake}
                step="1"
                value={stake}
                onChange={(e) => setStake(Number(e.target.value))}
              />
              {FINANCE.stakePresets.map((v) => (
                <button key={v} type="button" className="stake-chip" onClick={() => setStake(v)}>
                  {formatCompact(v)}
                </button>
              ))}
            </div>
          </div>

          <div className="betslip-summary">
            <div>
              <span>Total odds</span>
              <strong>{formatOdds(totalOdds)}</strong>
            </div>
            <div>
              <span>Potential return</span>
              <strong className="text-gold">{formatCurrency(potentialPayout)}</strong>
            </div>
            <div className="betslip-summary-wide">
              <span>Potential profit</span>
              <strong className="text-accent">+{formatCurrency(profit)}</strong>
            </div>
          </div>

          {message && (
            <p className={`betslip-message betslip-message--${message.type}`}>{message.text}</p>
          )}

          {!connected ? (
            <button type="button" className="btn btn-primary btn-block" onClick={connect}>
              Connect Wallet & Fund Account
            </button>
          ) : (
            <button type="button" className="btn btn-accent btn-block" onClick={handlePlace}>
              Place Bet · {formatCurrency(stake)}
            </button>
          )}
        </>
      )}
    </div>
  );

  if (mobile) {
    return (
      <>
        <button
          type="button"
          className="mobile-betslip-fab"
          onClick={() => setIsOpen(true)}
          aria-label={`Open bet slip, ${count} selections`}
        >
          Bet Slip
          {count > 0 && <span className="badge">{count}</span>}
        </button>
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
