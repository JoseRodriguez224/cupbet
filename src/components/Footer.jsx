import { SITE } from "../constants/config";

export function Footer() {
  return (
    <footer className="pm-footer">
      <div className="pm-footer__inner">
        <div>
          <strong>{SITE.name}</strong>
          <p>{SITE.tagline}</p>
        </div>
        <p className="muted">
          18+ only. Prediction markets involve risk. Not affiliated with FIFA or Polymarket.
          Match data via worldcup26.ir.
        </p>
      </div>
    </footer>
  );
}
