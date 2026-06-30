import { portfolio } from "../data/portfolio";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <p className="hero__eyebrow">Senior Software Engineer · {portfolio.yearsOfExperience} years</p>
        <h1 className="hero__title">
          Hi, I&apos;m <span className="hero__name">{portfolio.name}</span>
        </h1>
        <p className="hero__tagline">{portfolio.tagline}</p>

        <div className="hero__actions">
          <a href="#experience" className="btn btn--primary">
            View Experience
          </a>
          <a href="#skills" className="btn btn--ghost">
            View Skills
          </a>
        </div>
      </div>

      <div className="hero__glow" aria-hidden="true" />
    </section>
  );
}
