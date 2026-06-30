import { portfolio } from "../data/portfolio";

export default function Skills() {
  return (
    <section id="skills" className="section section--alt">
      <div className="container">
        <div className="section__header">
          <span className="section__label">Stack</span>
          <h2 className="section__title">Skills & technologies</h2>
          <p className="skills__intro">
            11 years across senior software and full-stack roles — centered on{" "}
            <strong>C#</strong>, <strong>.NET</strong>, <strong>Java</strong>, and{" "}
            <strong>Python</strong>.
          </p>
        </div>

        <div className="skills__categories">
          {portfolio.skillCategories.map((category) => (
            <article key={category.title} className="skill-category">
              <div className="skill-category__header">
                <h3 className="skill-category__title">{category.title}</h3>
                <p className="skill-category__desc">{category.description}</p>
              </div>
              <ul className="skill-category__tags">
                {category.skills.map((skill) => (
                  <li key={skill} className="skill-tag">
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
