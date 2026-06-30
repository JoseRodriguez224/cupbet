import { useCallback, useEffect, useState } from "react";
import ProjectPreview from "./ProjectPreview";

export default function ProjectCarousel({ slides }) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const goTo = useCallback(
    (next) => {
      setIndex((next + total) % total);
    },
    [total]
  );

  useEffect(() => {
    setIndex(0);
  }, [slides]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "ArrowLeft") {
        goTo(index - 1);
      }
      if (event.key === "ArrowRight") {
        goTo(index + 1);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goTo, index]);

  if (!slides.length) {
    return null;
  }

  const current = slides[index];

  return (
    <div className="carousel">
      <div className="carousel__header">
        <span className="carousel__caption">{current.caption}</span>
        <span className="carousel__counter">
          {index + 1} / {total}
        </span>
      </div>

      <div className="carousel__viewport">
        <button
          type="button"
          className="carousel__btn carousel__btn--prev"
          onClick={() => goTo(index - 1)}
          aria-label="Previous preview"
        >
          ‹
        </button>

        <div className="carousel__track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((slide) => (
            <div key={slide.id} className="carousel__slide">
              <ProjectPreview slideId={slide.id} />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="carousel__btn carousel__btn--next"
          onClick={() => goTo(index + 1)}
          aria-label="Next preview"
        >
          ›
        </button>
      </div>

      <div className="carousel__dots">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            className={`carousel__dot ${i === index ? "carousel__dot--active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to preview ${i + 1}: ${slide.caption}`}
          />
        ))}
      </div>
    </div>
  );
}
