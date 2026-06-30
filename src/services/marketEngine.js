import { generateMatchOdds } from "./oddsEngine";
import { getMatchStatus, getStageLabel, getTeamName, STATUS } from "../utils/matchStatus";

function hashString(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function roundPrice(value) {
  return Math.max(1, Math.min(99, Math.round(value)));
}

export function simulateVolume(matchId, status) {
  const base = 80_000 + (hashString(String(matchId)) % 4_500_000);
  const multiplier = status === STATUS.LIVE ? 2.4 : status === STATUS.UPCOMING ? 1 : 0.6;
  return Math.round(base * multiplier);
}

export function formatVolume(amount) {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}m`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}k`;
  return `$${amount}`;
}

export function buildMatchMarket(match) {
  const status = getMatchStatus(match);
  const home = getTeamName(match, "home");
  const away = getTeamName(match, "away");
  const odds = generateMatchOdds({ ...match, homeTeam: home, awayTeam: away, status });

  const rawHome = 1 / odds.home;
  const rawDraw = 1 / odds.draw;
  const rawAway = 1 / odds.away;
  const total = rawHome + rawDraw + rawAway;

  const homePrice = roundPrice((rawHome / total) * 100);
  const drawPrice = roundPrice((rawDraw / total) * 100);
  const awayPrice = roundPrice((rawAway / total) * 100);

  const canTrade =
    status !== STATUS.FINISHED && !home.startsWith("Winner") && !away.startsWith("Winner");

  const volume = simulateVolume(match.id, status);
  const trend = (hashString(String(match.id)) % 20) - 8;

  return {
    match,
    status,
    home,
    away,
    stage: getStageLabel(match.type, match.group),
    question: `${home} vs ${away} — Match Winner`,
    volume,
    trend,
    canTrade,
    outcomes: [
      {
        key: "home",
        label: home,
        price: homePrice,
        noPrice: 100 - homePrice,
        odds: odds.home,
      },
      {
        key: "draw",
        label: "Draw",
        price: drawPrice,
        noPrice: 100 - drawPrice,
        odds: odds.draw,
      },
      {
        key: "away",
        label: away,
        price: awayPrice,
        noPrice: 100 - awayPrice,
        odds: odds.away,
      },
    ],
  };
}

export function calculateShares(stake, priceCents) {
  if (!stake || !priceCents) return 0;
  return stake / (priceCents / 100);
}

export function calculateTradePayout(stake, priceCents) {
  const shares = calculateShares(stake, priceCents);
  return Math.round(shares * 100) / 100;
}

export function calculateTradeProfit(stake, priceCents) {
  return Math.round((calculateTradePayout(stake, priceCents) - stake) * 100) / 100;
}

export function getTrendingMarkets(matches, limit = 8) {
  return matches
    .map(buildMatchMarket)
    .filter((m) => m.canTrade)
    .sort((a, b) => {
      if (a.status === STATUS.LIVE && b.status !== STATUS.LIVE) return -1;
      if (b.status === STATUS.LIVE && a.status !== STATUS.LIVE) return 1;
      return b.volume - a.volume;
    })
    .slice(0, limit);
}
