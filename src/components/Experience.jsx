import { portfolio } from "../data/portfolio";

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section__header">
          <span className="section__label">Career</span>
          <h2 className="section__title">Experience</h2>
        </div>

        <div className="timeline">
          {portfolio.experience.map((job, index) => (
            <article key={`${job.company}-${job.period}`} className="timeline__item">
              <div className="timeline__marker">
                <span className="timeline__dot" />
                {index < portfolio.experience.length - 1 && (
                  <span className="timeline__line" />
                )}
              </div>

              <div className="timeline__content">
                <div className="timeline__meta">
                  <time className="timeline__period">{job.period}</time>
                  <span className="timeline__location">{job.location}</span>
                </div>
                <h3 className="timeline__role">{job.role}</h3>
                <p className="timeline__company">{job.company}</p>
                <ul className="timeline__highlights">
                  {job.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
