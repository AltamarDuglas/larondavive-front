'use client';

/**
 * Importaciones de React y Next.js.
 * - useState, useEffect: Manejo del carrusel fotográfico de Montería con auto-reproducción.
 * - Image, StaticImageData: Renderizado optimizado de la galería visual cultural.
 * - Link: Enrutamiento rápido del cliente de Next.js.
 * - rioSinu, rondaVive1, rondaVive2: Fotografía real de la Ronda del Sinú y la Calle 27.
 */
import { useEffect, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import rioSinu from '../app/imgs/rio-sinu.jpg';
import rondaVive1 from '../app/imgs/la-ronda-vive-1-scaled.jpg';
import rondaVive2 from '../app/imgs/la-ronda-vive-scaled.jpg';

/**
 * Estructura de cada diapositiva del marco fotográfico.
 */
export interface HeroSlideItem {
  image: StaticImageData;
  caption: string;
  location: string;
  tag: string;
}

/**
 * Fotografía oficial de la Ronda del Sinú y la Calle 27 con Avenida Primera.
 */
const heroSlides: HeroSlideItem[] = [
  {
    image: rioSinu,
    caption: 'El pulmón verde más extenso de Latinoamérica a orillas del Sinú',
    location: 'Río Sinú • Montería',
    tag: 'Patrimonio Natural'
  },
  {
    image: rondaVive1,
    caption: 'Punto de encuentro, cultura al aire libre y espacio familiar',
    location: 'Calle 27 con Avenida Primera',
    tag: 'Punto de Encuentro'
  },
  {
    image: rondaVive2,
    caption: 'Convivencia, tradición y expresión artística de nuestra gente',
    location: 'Montería, Córdoba',
    tag: 'Cultura Viva'
  }
];

/**
 * Componente HeroSection (Versión Limpia, Sin Emojis)
 * Responsabilidad Única (SRP): Presentar el banner principal sobrio con 2 botones de acción claros
 * y galería fotográfica de Montería.
 */
export default function HeroSection() {
  // Estado para el índice de la foto activa del carrusel (0, 1, 2)
  const [activeIdx, setActiveIdx] = useState<number>(0);

  /**
   * Transición automática de las imágenes cada 4.5 segundos.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % heroSlides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="cultural-hero" aria-label="Bienvenida a La Ronda Vive en Montería">
      {/* Fondo ambiental con gradiente sutil del río Sinú */}
      <div className="cultural-hero__bg-glow" />

      <div className="cultural-hero__grid">
        {/* Columna Izquierda: Información sobria y 2 botones de acción */}
        <div className="cultural-hero__copy">
          <div className="cultural-hero__badges">
            <span className="badge-location">Calle 27 con Avenida Primera</span>
          </div>

          <h1 className="cultural-hero__title">
            ¡Vive la Ronda en <span className="text-gradient-sinu">Montería</span>!
          </h1>

          <p className="cultural-hero__lede">
            Registra tu asistencia en cada jornada y haz parte activa del punto de encuentro más
            vibrante de nuestra ciudad.
          </p>

          {/* Únicamente 2 botones de acción claros */}
          <div className="cultural-hero__actions">
            <Link
              href="/register?event=RV-150926&code=RV-150926"
              className="cultural-btn cultural-btn--primary"
            >
              Registrar mi Asistencia
            </Link>

            <Link href="/pass" className="cultural-btn cultural-btn--secondary">
              Ver Mi Ronda Pass
            </Link>
          </div>
        </div>

        {/* Columna Derecha: Galería fotográfica limpia de la ciudad */}
        <div className="cultural-hero__frame-container">
          <div className="cultural-hero__frame-glow" />
          <div className="cultural-hero__frame">
            {heroSlides.map((slide, index) => {
              const isActive = index === activeIdx;

              return (
                <div
                  key={slide.location + index}
                  className={`hero-photo-slide ${isActive ? 'is-active' : ''}`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.caption}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="hero-photo-img"
                  />
                  <div className="hero-photo-overlay" />

                  {/* Etiqueta superior sin emoji */}
                  <div className="hero-photo-tag">
                    <span>{slide.tag}</span>
                  </div>

                  {/* Leyenda inferior limpia */}
                  <div className="hero-photo-caption">
                    <span className="caption-loc">{slide.location}</span>
                    <p className="caption-desc">{slide.caption}</p>
                  </div>
                </div>
              );
            })}

            {/* Controles interactivos del carrusel */}
            <div className="hero-photo-dots">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIdx(index)}
                  className={`dot-item ${index === activeIdx ? 'is-active' : ''}`}
                  aria-label={`Ver fotografía ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
