import React, { useState, useEffect } from 'react';

export default function Slideshow({ slides }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="slideshow-wrapper">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide-item ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          {/* Pure slide image layout without overlays, text titles, buttons, or links */}
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button className="slide-arrow slide-arrow-left" onClick={handlePrev}>
            ←
          </button>
          <button className="slide-arrow slide-arrow-right" onClick={handleNext}>
            →
          </button>
          <div className="slide-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`slide-dot ${index === current ? 'active' : ''}`}
                onClick={() => setCurrent(index)}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
