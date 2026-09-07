'use client';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';
import rioSinu from './imgs/rio-sinu.jpg';
import rondaVive1 from './imgs/la-ronda-vive-1-scaled.jpg';
import rondaVive2 from './imgs/la-ronda-vive-scaled.jpg';

const slides: Array<{
  image: StaticImageData;
  label: string;
  accent: string;
}> = [
  { image: rioSinu, label: 'Ronda del Sinu', accent: 'accent-blue' },
  { image: rondaVive1, label: 'Ronda Vive', accent: 'accent-red' },
  { image: rondaVive2, label: 'Ronda Vive', accent: 'accent-blue' }
];

export default function HomeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="hero-carousel" aria-label="Carrusel principal de Ronda Vive">
      <div className="hero-carousel__veil" />
      <div className="hero-carousel__stack">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              className={`hero-carousel__slide ${slide.accent} ${isActive ? 'is-active' : ''}`}
              key={slide.label + index}
              aria-hidden={!isActive}
            >
              <Image
                src={slide.image}
                alt={slide.label}
                fill
                priority={index === 0}
                sizes="100vw"
                className="hero-carousel__image"
              />
              <div className="hero-carousel__wash" />
            </article>
          );
        })}
      </div>

      <div className="hero-carousel__copy">
        <p className="hero-carousel__eyebrow">(Logo de La Ronda Vive)</p>
        <h1>Cultura y tradición que se vive</h1>
        <p className="hero-carousel__subtle">Cultura, encuentro y ciudad.</p>
      </div>

      <div className="hero-carousel__marks" aria-hidden="true">
        <span className="mark mark--red" />
        <span className="mark mark--blue" />
        <span className="mark mark--white" />
      </div>
    </section>
  );
}
