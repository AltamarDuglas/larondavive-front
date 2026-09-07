'use client';

/**
 * Importaciones de React y Next.js.
 * - useState, useEffect: Manejo de etapas de la secuencia de inicio y carrusel fotográfico.
 * - Image, StaticImageData: Renderizado optimizado de imágenes institucionales.
 * - alcaldiaLogo: Logo oficial de la Alcaldía de Montería.
 * - rioSinu, rondaVive1, rondaVive2: Galería de imágenes de Montería.
 */
import { useEffect, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import alcaldiaLogo from '../app/imgs/alcaldia-logo.jpg';
import rioSinu from '../app/imgs/rio-sinu.jpg';
import rondaVive1 from '../app/imgs/la-ronda-vive-1-scaled.jpg';
import rondaVive2 from '../app/imgs/la-ronda-vive-scaled.jpg';

/**
 * Interfaz de propiedades para IntroAnimation.
 * Aplicación del principio de Inversión de Dependencias (DIP).
 */
export interface IntroAnimationProps {
  /** Callback ejecutado al finalizar la presentación */
  onComplete?: () => void;
  /** Llave para reiniciar la animación */
  replayKey?: number;
}

/**
 * Estructura de cada diapositiva cinemática.
 */
export interface RockstarSlide {
  image: StaticImageData;
  title: string;
  tagline: string;
  location: string;
}

/**
 * Las 3 fotografías oficiales de la Ronda del Sinú y la Calle 27.
 */
const rockstarSlides: RockstarSlide[] = [
  {
    image: rioSinu,
    title: 'RÍO SINÚ',
    tagline: 'El corazón verde de nuestra ciudad',
    location: 'Montería • Córdoba'
  },
  {
    image: rondaVive1,
    title: 'CALLE 27',
    tagline: 'Punto de encuentro, cultura y civismo',
    location: 'Con Avenida Primera'
  },
  {
    image: rondaVive2,
    title: 'LA RONDA VIVE',
    tagline: 'Nuestra gente, nuestra tradición',
    location: 'Jornada Ciudadana'
  }
];

/**
 * Secuencia de etapas de la animación introductoria:
 * 1. 'alcaldia': Logo oficial e inicio con barra estilo Bandera de Montería.
 * 2. 'rockstar-carousel': Carrusel cinemático de 3 fotografías.
 * 3. 'finished': Finaliza la animación e ingresa al sitio principal.
 */
export type IntroStage = 'alcaldia' | 'rockstar-carousel' | 'finished';

/**
 * Componente IntroAnimation
 * Responsabilidad Única (SRP): Presentar la bienvenida oficial de la Alcaldía de Montería
 * y la secuencia de fotos de la ciudad sin excesos ni pantallas innecesarias.
 */
export default function IntroAnimation({ onComplete, replayKey = 0 }: IntroAnimationProps) {
  // Estado local para la etapa actual
  const [stage, setStage] = useState<IntroStage>('alcaldia');

  // Porcentaje de la barra de progreso (0% a 100%)
  const [progress, setProgress] = useState<number>(0);

  // Controla la visibilidad animada de la estrella SVG amarilla al finalizar la barra
  const [showStar, setShowStar] = useState<boolean>(false);

  // Índice de la foto activa dentro del carrusel (0, 1, 2)
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  /**
   * Efecto principal para coordinar los tiempos de la secuencia.
   */
  useEffect(() => {
    setStage('alcaldia');
    setProgress(0);
    setShowStar(false);
    setActiveSlideIndex(0);

    // 1. Carga de la barra con la bandera de Montería (2.4s)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setShowStar(true);
          return 100;
        }
        return prev + 3.5;
      });
    }, 30);

    // 2. Transición al carrusel de fotografías a los 2.4 segundos
    const timer1 = setTimeout(() => {
      setStage('rockstar-carousel');
    }, 2400);

    // 3. Avance de las 3 fotografías (1.4s por foto)
    const slideTimer1 = setTimeout(() => {
      setActiveSlideIndex(1);
    }, 3800);

    const slideTimer2 = setTimeout(() => {
      setActiveSlideIndex(2);
    }, 5200);

    // 4. Finalización e ingreso directo al sitio principal al terminar la 3ra foto (6.6s)
    const timer2 = setTimeout(() => {
      setStage('finished');
      if (onComplete) {
        onComplete();
      }
    }, 6600);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer1);
      clearTimeout(slideTimer1);
      clearTimeout(slideTimer2);
      clearTimeout(timer2);
    };
  }, [replayKey, onComplete]);

  /**
   * Permite al usuario omitir la presentación.
   */
  const handleSkip = () => {
    setStage('finished');
    if (onComplete) {
      onComplete();
    }
  };

  if (stage === 'finished') {
    return null;
  }

  return (
    <aside className="intro-overlay" aria-label="Presentación de inicio de la Alcaldía de Montería">
      {/* Fondo ambiental */}
      <div className="intro-overlay__backdrop" />

      {/* Botón sobrio para omitir la presentación */}
      <button
        type="button"
        onClick={handleSkip}
        className="intro-overlay__skip-btn"
        aria-label="Omitir presentación"
      >
        Omitir
      </button>

      <div className="intro-overlay__content">
        {/* ETAPA 1: Emblema Institucional de la Alcaldía de Montería */}
        {stage === 'alcaldia' && (
          <div className="intro-stage intro-stage--alcaldia">
            <div className="logo-emblem-frame">
              <div className="logo-emblem-glow" />
              <div className="logo-emblem-wrapper">
                <Image
                  src={alcaldiaLogo}
                  alt="Alcaldía de Montería"
                  width={140}
                  height={140}
                  priority
                  className="logo-emblem-img"
                />
              </div>
            </div>

            <h1 className="intro-title">
              Alcaldía de <span className="text-highlight-white">Montería</span>
            </h1>

            <p className="intro-subtitle">
              Punto de encuentro en la <strong>Calle 27 con Avenida Primera</strong>
            </p>

            {/* Barra de progreso estilo Bandera de Montería (Rojo, Blanco, Azul) */}
            <div className="monteria-flag-bar-track">
              <div className="monteria-flag-bar-clip">
                <div className="monteria-flag-bar-fill" style={{ width: `${progress}%` }} />
              </div>

              {/* Estrella SVG Amarilla superpuesta al completar la carga */}
              {showStar && (
                <div className="monteria-flag-star-animated">
                  <svg
                    className="monteria-flag-star-svg-yellow"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L14.85 8.36L21.74 9.11L16.6 13.79L18.02 20.58L12 17.1L5.98 20.58L7.4 13.79L2.26 9.11L9.15 8.36L12 2Z"
                      fill="#facc15"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ETAPA 2: Carrusel Cinemático de Fotografías de Montería */}
        {stage === 'rockstar-carousel' && (
          <div className="rockstar-stage">
            {rockstarSlides.map((slide, index) => {
              const isActive = index === activeSlideIndex;

              return (
                <div
                  key={slide.title}
                  className={`rockstar-slide ${isActive ? 'is-active' : ''}`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority
                    sizes="100vw"
                    className="rockstar-slide__image"
                  />
                  <div className="rockstar-slide__vignette" />

                  <div className="rockstar-slide__card">
                    <span className="rockstar-badge">{slide.location}</span>
                    <h2 className="rockstar-title">{slide.title}</h2>
                    <p className="rockstar-tagline">{slide.tagline}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
