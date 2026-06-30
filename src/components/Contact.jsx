import { portfolio } from "../data/portfolio";

export default function Contact() {
  return (
    <section id="contact" className="section section--alt">
      <div className="container">
        <div className="contact">
          <div className="contact__intro">
            <span className="section__label">Contact</span>
            <h2 className="section__title">Let&apos;s work together</h2>
            <p className="contact__text">
              Open to senior engineering roles, consulting, and interesting technical
              challenges. Reach out anytime.
            </p>
          </div>

          <div className="contact__links">
            <a href={`mailto:${portfolio.email}`} className="contact-card">
              <span className="contact-card__label">Email</span>
              <span className="contact-card__value">{portfolio.email}</span>
            </a>
            <a
              href={portfolio.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
            >
              <span className="contact-card__label">LinkedIn</span>
              <span className="contact-card__value">{portfolio.linkedin}</span>
            </a>
            <a
              href={portfolio.github}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
            >
              <span className="contact-card__label">GitHub</span>
              <span className="contact-card__value">{portfolio.github}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
