import { formatOdds } from "../utils/formatters";

export function OddsButton({ label, odds, selected, disabled, trend, onClick }) {
  return (
    <button
      type="button"
      className={`odds-btn${selected ? " odds-btn--selected" : ""}${disabled ? " odds-btn--disabled" : ""}`}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="odds-btn__label">{label}</span>
      <span className="odds-btn__value">
        {formatOdds(odds)}
        {trend === "up" && <span className="odds-trend odds-trend--up" aria-hidden>▲</span>}
        {trend === "down" && <span className="odds-trend odds-trend--down" aria-hidden>▼</span>}
      </span>
    </button>
  );
}
