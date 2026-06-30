import { useState } from "react";
import { portfolio } from "../data/portfolio";
import ProjectModal from "./ProjectModal";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projects" className="section section--alt">
      <div className="container">
        <div className="section__header">
          <span className="section__label">Work</span>
          <h2 className="section__title">Selected projects</h2>
          <p className="projects__intro">
            Enterprise-scale deliverables across my career — AI and GenAI platforms from 2021
            onward at IKONIC and Binary Studio. Click any project for details and live previews.
          </p>
        </div>

        <div className="projects__grid">
          {portfolio.projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className="project-card"
              onClick={() => setSelectedProject(project)}
            >
              <div className="project-card__header">
                <span className="project-card__company">{project.company}</span>
                <span className="project-card__period">{project.period}</span>
              </div>

              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__role">{project.role}</p>
              <p className="project-card__desc">{project.description}</p>

              <ul className="project-card__stack">
                {project.stack.slice(0, 4).map((tech) => (
                  <li key={tech} className="project-card__tag">
                    {tech}
                  </li>
                ))}
                {project.stack.length > 4 && (
                  <li className="project-card__tag project-card__tag--more">
                    +{project.stack.length - 4}
                  </li>
                )}
              </ul>

              <span className="project-card__cta">View project →</span>
            </button>
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}
