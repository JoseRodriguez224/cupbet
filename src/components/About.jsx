import { portfolio } from "../data/portfolio";

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section__header">
          <span className="section__label">About</span>
          <h2 className="section__title">Engineering with purpose</h2>
        </div>
        <p className="about__text">{portfolio.about.trim()}</p>
      </div>
    </section>
  );
}
