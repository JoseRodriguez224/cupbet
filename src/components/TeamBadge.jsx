const TEAM_FLAGS = {
  Mexico: "mx", "South Africa": "za", "South Korea": "kr", "Czech Republic": "cz",
  Canada: "ca", "Bosnia & Herzegovina": "ba", Qatar: "qa", Switzerland: "ch",
  Brazil: "br", Morocco: "ma", Argentina: "ar", "Cape Verde": "cv",
  France: "fr", Senegal: "sn", England: "gb-eng", Croatia: "hr",
  Germany: "de", "Ivory Coast": "ci", Netherlands: "nl", Sweden: "se",
  Portugal: "pt", Japan: "jp", Spain: "es", "United States": "us",
  Australia: "au", Turkey: "tr", Belgium: "be", Egypt: "eg",
  Italy: "it", Uruguay: "uy", Colombia: "co", Ecuador: "ec",
  Poland: "pl", Denmark: "dk", Austria: "at", Scotland: "gb-sct",
  Wales: "gb-wls", Iran: "ir", "Saudi Arabia": "sa", Tunisia: "tn",
  Nigeria: "ng", Ghana: "gh", Cameroon: "cm", "Costa Rica": "cr",
  Panama: "pa", Jamaica: "jm", Paraguay: "py", Chile: "cl",
  Peru: "pe", Serbia: "rs", Ukraine: "ua", Russia: "ru",
};

export function getFlagUrl(teamName) {
  if (!teamName || teamName.startsWith("Winner") || teamName.startsWith("Runner")) {
    return null;
  }
  const code = TEAM_FLAGS[teamName];
  if (!code) return null;
  return `https://flagcdn.com/w40/${code}.png`;
}

export function TeamBadge({ name, size = 28 }) {
  const flag = getFlagUrl(name);
  const initials = (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  if (flag) {
    return (
      <img
        className="team-flag"
        src={flag}
        alt=""
        width={size}
        height={Math.round(size * 0.75)}
        loading="lazy"
      />
    );
  }

  return (
    <span className="team-flag-fallback" style={{ width: size, height: size }}>
      {initials}
    </span>
  );
}
