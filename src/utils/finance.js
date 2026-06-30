import { FINANCE } from "../constants/config";

export function getDepositBonus(amount) {
  const value = Number(amount);
  if (!value || value < FINANCE.minDeposit) return { bonus: 0, percent: 0, label: null };

  for (const tier of FINANCE.depositBonuses) {
    if (value >= tier.min) {
      return {
        bonus: (value * tier.percent) / 100,
        percent: tier.percent,
        label: tier.label,
      };
    }
  }
  return { bonus: 0, percent: 0, label: null };
}

export function clampStake(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return FINANCE.defaultStake;
  return Math.min(FINANCE.maxStake, Math.max(FINANCE.minStake, num));
}

export function clampDeposit(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return FINANCE.depositPresets[0];
  return Math.min(FINANCE.maxDeposit, Math.max(FINANCE.minDeposit, num));
}

export function formatCompact(amount) {
  const n = Number(amount);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return String(n);
}
