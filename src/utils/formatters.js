export function formatOdds(decimal) {
  return decimal.toFixed(2);
}

export function formatCurrency(amount, symbol = "USDT") {
  return `${Number(amount).toFixed(2)} ${symbol}`;
}

export function formatKickoff(date) {
  if (!date || Number.isNaN(date.getTime())) return "TBD";
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export function formatCents(cents) {
  return `${Math.round(cents)}¢`;
}

export function formatVolumeDisplay(amount) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}m Vol.`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}k Vol.`;
  return `$${amount} Vol.`;
}

export function truncateAddress(address) {
  if (!address || address.length < 12) return address ?? "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
