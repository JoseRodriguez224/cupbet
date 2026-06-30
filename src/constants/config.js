export const API = {
  primary: "https://worldcup26.ir/get/games",
  groups: "https://worldcup26.ir/get/groups",
  fallback: "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json",
};

export const POLL_INTERVAL_MS = 30_000;

export const SITE = {
  name: "CupBet",
  tagline: "World Cup 2026 Prediction Markets",
  tournament: "FIFA World Cup 2026",
  hosts: "USA · Mexico · Canada",
};

export const FINANCE = {
  currency: "USDT",
  minStake: 10,
  maxStake: 50_000,
  defaultStake: 100,
  welcomeBonus: 500,
  stakePresets: [50, 100, 500, 1000, 5000, 10000],
  depositPresets: [100, 500, 1000, 5000, 10000, 50000],
  minDeposit: 10,
  maxDeposit: 500_000,
  depositBonuses: [
    { min: 10_000, percent: 15, label: "VIP 15%" },
    { min: 1_000, percent: 10, label: "Boost 10%" },
    { min: 100, percent: 5, label: "Welcome 5%" },
  ],
  maxPayout: 1_000_000,
};
