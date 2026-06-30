import { useMemo, useState } from "react";
import { FINANCE } from "../constants/config";
import { useWallet } from "../context/WalletContext";
import { formatCurrency } from "../utils/formatters";
import { formatCompact, getDepositBonus } from "../utils/finance";

export function FundWalletModal({ open, onClose, mode = "connect" }) {
  const { connectAndFund, deposit, busy, connected } = useWallet();
  const [amount, setAmount] = useState(FINANCE.depositPresets[2]);
  const [message, setMessage] = useState(null);

  const bonusPreview = useMemo(() => getDepositBonus(amount), [amount]);

  if (!open) return null;

  const handleSubmit = async () => {
    setMessage(null);
    const result =
      mode === "deposit" && connected ? await deposit(amount) : await connectAndFund(amount);

    if (!result.ok) {
      setMessage({ type: "error", text: result.error });
      return;
    }

    setMessage({
      type: "success",
      text: `Account funded with ${formatCurrency(result.totalCredit)}. Start betting!`,
    });
    setTimeout(() => {
      setMessage(null);
      onClose?.();
    }, 2500);
  };

  const title = mode === "deposit" ? "Add Funds" : "Connect Wallet & Fund Account";
  const subtitle =
    mode === "deposit"
      ? "Send USDT from your wallet to add betting balance."
      : "Connect MetaMask and send USDT to activate your betting account.";

  return (
    <div className="modal-overlay" onClick={() => !busy && onClose?.()}>
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p className="muted">{subtitle}</p>

        <div className="deposit-presets">
          {FINANCE.depositPresets.map((v) => (
            <button
              key={v}
              type="button"
              className={`stake-chip${amount === v ? " stake-chip--active" : ""}`}
              onClick={() => setAmount(v)}
              disabled={busy}
            >
              {formatCompact(v)}
            </button>
          ))}
        </div>

        <label htmlFor="fund-amount">Amount to send (USDT)</label>
        <input
          id="fund-amount"
          type="number"
          min={FINANCE.minDeposit}
          max={FINANCE.maxDeposit}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          disabled={busy}
        />

        <div className="deposit-preview">
          <div>
            <span>You send</span>
            <strong>{formatCurrency(amount)}</strong>
          </div>
          <div>
            <span>Bonus{bonusPreview.label ? ` (${bonusPreview.label})` : ""}</span>
            <strong className="text-accent">+{formatCurrency(bonusPreview.bonus)}</strong>
          </div>
          <div>
            <span>Betting balance</span>
            <strong className="text-gold">{formatCurrency(amount + bonusPreview.bonus)}</strong>
          </div>
        </div>

        <p className="wallet-note">
          Approve the transaction in MetaMask. Funds are sent securely to activate your account.
        </p>

        {message && (
          <p className={`wallet-flash wallet-flash--${message.type}`}>{message.text}</p>
        )}

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="btn btn-accent" onClick={handleSubmit} disabled={busy}>
            {busy ? "Confirm in MetaMask…" : mode === "deposit" ? "Send USDT" : "Connect & Send USDT"}
          </button>
        </div>
      </div>
    </div>
  );
}
