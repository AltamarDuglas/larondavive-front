'use client';

/**
 * Importaciones de React y Next.js.
 * - useState, useEffect: Manejo del ciclo de vida, etapas de animación y carrusel cinemático.
 * - Image, StaticImageData: Renderizado optimizado de imágenes con Next.js.
 * - alcaldiaLogo: Logo oficial de la Alcaldía de Montería.
 * - rioSinu, rondaVive1, rondaVive2: Las 3 fotografías de las jornadas de la Ronda Vive.
 */
import { useEffect, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import alcaldiaLogo from '../app/imgs/alcaldia-logo.jpg';
import rioSinu from '../app/imgs/rio-sinu.jpg';
import rondaVive1 from '../app/imgs/la-ronda-vive-1-scaled.jpg';
import rondaVive2 from '../app/imgs/la-ronda-vive-scaled.jpg';

/**
 * Interfaz de propiedades para IntroAnimation.
 * Aplicación de Inversión de Dependencias (DIP).
 */
export interface IntroAnimationProps {
  /** Callback ejecutado al finalizar la animación */
  onComplete?: () => void;
  /** Llave para reiniciar la presentación */
  replayKey?: number;
}

/**
 * Tipo para la definición de cada diapositiva cinemática estilo Rockstar Games.
 */
export interface RockstarSlide {
  image: StaticImageData;
  title: string;
  tagline: string;
  location: string;
}

/**
 * Las 3 fotografías oficiales de la Ronda del Sinú y la Calle 27 con estilo cinemático Rockstar.
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
 * Secuencia de etapas de la animación introductoria.
 * 1. 'alcaldia': Logo oficial e inicio con barra estilo Bandera de Montería.
 * 2. 'rockstar-carousel': Carrusel cinemático rápido de alto impacto visual (Estilo Rockstar Games).
 * 3. 'ronda-vive': Presentación final del pase digital ciudadano.
 * 4. 'finished': Muestra el contenido principal de la aplicación.
 */
export type IntroStage = 'alcaldia' | 'rockstar-carousel' | 'ronda-vive' | 'finished';

/**
 * Componente IntroAnimation (Versión Cinemática Rockstar Games)
 * Responsabilidad Única (SRP): Presentación de la intro institucional y la secuencia rápida de fotos
 * con estética cinemática, viñeta de alto contraste y títulos en tipografía negrita.
 */
export default function IntroAnimation({ onComplete, replayKey = 0 }: IntroAnimationProps) {
  // Estado local para la etapa actual de la presentación
  const [stage, setStage] = useState<IntroStage>('alcaldia');

  // Porcentaje de la barra de progreso (0% a 100%)
  const [progress, setProgress] = useState<number>(0);

  // Controla la visibilidad animada de la estrella SVG amarilla al finalizar la barra
  const [showStar, setShowStar] = useState<boolean>(false);

  // Índice de la foto activa dentro del carrusel cinemático Rockstar Games (0, 1, 2)
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  /**
   * Efecto principal para coordinar la secuencia de etapas y temporizadores.
   */
  useEffect(() => {
    setStage('alcaldia');
    setProgress(0);
    setShowStar(false);
    setActiveSlideIndex(0);

    // 1. Barra de tiempo progresiva para la etapa 1
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setShowStar(true);
          return 100;
        }
        return prev + 3;
      });
    }, 30);

    // 2. Transición a la etapa 'rockstar-carousel' a los 2.2 segundos
    const timer1 = setTimeout(() => {
      setStage('rockstar-carousel');
    }, 2200);

    // 3. Avance de las 3 fotografías del carrusel Rockstar Games (1.3s cada foto para lectura cómoda)
    const slideTimer1 = setTimeout(() => {
      setActiveSlideIndex(1);
    }, 3500);

    const slideTimer2 = setTimeout(() => {
      setActiveSlideIndex(2);
    }, 4800);

    // 4. Transición a la marca final 'ronda-vive' a los 6.1 segundos
    const timer2 = setTimeout(() => {
      setStage('ronda-vive');
    }, 6100);

    // 5. Finalización e integración con el sitio web a los 7.8 segundos
    const timer3 = setTimeout(() => {
      setStage('finished');
      if (onComplete) {
        onComplete();
      }
    }, 7800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer1);
      clearTimeout(slideTimer1);
      clearTimeout(slideTimer2);
      clearTimeout(timer2);
      clearTimeout(timer3);
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
    <aside className="intro-overlay" aria-label="Presentación cinemática de Ronda Vive">
      {/* Fondo ambiental */}
      <div className="intro-overlay__backdrop" />

      {/* Botón táctil para omitir la presentación */}
      <button
        type="button"
        onClick={handleSkip}
        className="intro-overlay__skip-btn"
        aria-label="Omitir presentación"
      >
        Omitir ➔
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
              Alcaldía de <span className="text-highlight-green">Montería</span>
            </h1>

            <p className="intro-subtitle">
              ¡Bienvenidos a la Ronda Vive! El punto de encuentro en la{' '}
              <strong>Calle 27 con Avenida Primera</strong>.
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

        {/* ETAPA 2: Carrusel Rápido Cinemático Estilo Rockstar Games */}
        {stage === 'rockstar-carousel' && (
          <div className="rockstar-stage">
            {rockstarSlides.map((slide, index) => {
              const isActive = index === activeSlideIndex;

              return (
                <div
                  key={slide.title}
                  className={`rockstar-slide ${isActive ? 'is-active' : ''}`}
                >
                  {/* Fotografía a pantalla completa con efecto zoom pan y viñeta cinemática */}
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority
                    sizes="100vw"
                    className="rockstar-slide__image"
                  />
                  <div className="rockstar-slide__vignette" />

                  {/* Título y leyendas al estilo tipográfico de Rockstar Games */}
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

        {/* ETAPA 3: Revelación Final de La Ronda Vive Pass */}
        {stage === 'ronda-vive' && (
          <div className="intro-stage intro-stage--ronda">
            <div className="intro-badge intro-badge--blue">
              <span className="intro-badge__icon">🌟</span>
              <span className="intro-badge__text">Tu Pase Ciudadano</span>
            </div>

            <h1 className="intro-title intro-title--hero">
              La Ronda <span className="text-highlight-blue">Vive</span>{' '}
              <span className="text-tag-pass">PASS</span>
            </h1>

            <p className="intro-subtitle">
              Registra tu asistencia en cada jornada, conoce tu historial de visitas y vive la ciudad.
            </p>

            <div className="intro-location-pill">
              <span>📍 Calle 27 con Avenida Primera • Montería</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
