const TEAM_STRENGTH = {
  Brazil: 92, Argentina: 91, France: 90, England: 88, Spain: 89,
  Germany: 87, Portugal: 86, Netherlands: 85, Belgium: 84, Italy: 83,
  Uruguay: 82, Croatia: 81, Mexico: 78, "United States": 77, Canada: 74,
  Japan: 76, "South Korea": 75, Morocco: 80, Senegal: 77, Switzerland: 76,
  Australia: 72, Turkey: 73, Colombia: 79, Ecuador: 74, Denmark: 75,
  Sweden: 74, Poland: 73, Austria: 72, Scotland: 71, Wales: 70,
  "Ivory Coast": 76, Egypt: 74, Nigeria: 75, Ghana: 73, Tunisia: 71,
  "Saudi Arabia": 70, Qatar: 68, Iran: 72, "Costa Rica": 69,
};

function hashString(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function strength(name) {
  if (!name || name.startsWith("Winner") || name.startsWith("Runner")) return 65;
  return TEAM_STRENGTH[name] ?? 68 + (hashString(name) % 12);
}

function clampOdd(value) {
  return Math.max(1.05, Math.min(15, value));
}

function roundOdd(value) {
  return Math.round(value * 100) / 100;
}

export function generateMatchOdds(match) {
  const home = strength(match.homeTeam);
  const away = strength(match.awayTeam);
  const total = home + away;
  const homeProb = home / total;
  const awayProb = away / total;
  const drawProb = 0.24 + (hashString(match.id) % 8) / 100;

  const scale = 1 / (homeProb + awayProb + drawProb);
  let homeOdd = clampOdd(1 / (homeProb * scale) * 0.94);
  let drawOdd = clampOdd(1 / (drawProb * scale) * 0.96);
  let awayOdd = clampOdd(1 / (awayProb * scale) * 0.94);

  if (match.status === "live") {
    const hs = Number(match.homeScore) || 0;
    const as = Number(match.awayScore) || 0;
    const diff = hs - as;
    if (diff > 0) {
      homeOdd *= 0.82;
      awayOdd *= 1.28;
      drawOdd *= 1.15;
    } else if (diff < 0) {
      homeOdd *= 1.28;
      awayOdd *= 0.82;
      drawOdd *= 1.15;
    }
  }

  return {
    home: roundOdd(homeOdd),
    draw: roundOdd(drawOdd),
    away: roundOdd(awayOdd),
  };
}

export function calculatePayout(stake, odds) {
  return roundOdd(Number(stake) * Number(odds));
}
