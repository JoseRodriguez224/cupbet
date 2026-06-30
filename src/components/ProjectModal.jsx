import { useEffect } from "react";
import ProjectCarousel from "./ProjectCarousel";

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!project) {
    return null;
  }

  return (
    <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
      <div className="project-modal__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="project-modal__panel">
        <button type="button" className="project-modal__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="project-modal__content">
          <div className="project-modal__info">
            <div className="project-modal__meta">
              <span className="project-modal__company">{project.company}</span>
              <span className="project-modal__period">{project.period}</span>
            </div>
            <h2 id="project-modal-title" className="project-modal__title">
              {project.title}
            </h2>
            <p className="project-modal__role">{project.role}</p>
            <p className="project-modal__desc">{project.description}</p>

            <div className="project-modal__metrics">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="project-modal__metric">
                  <span className="project-modal__metric-value">{metric.value}</span>
                  <span className="project-modal__metric-label">{metric.label}</span>
                </div>
              ))}
            </div>

            <div className="project-modal__section">
              <h3>Key outcomes</h3>
              <ul>
                {project.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </div>

            <div className="project-modal__section">
              <h3>My responsibilities</h3>
              <ul>
                {project.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <ul className="project-modal__stack">
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>

          <div className="project-modal__preview">
            <span className="project-modal__preview-label">Live preview</span>
            <ProjectCarousel slides={project.previewSlides} />
          </div>
        </div>
      </div>
    </div>
  );
}
