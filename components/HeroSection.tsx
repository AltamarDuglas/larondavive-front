'use client';

/**
 * Importaciones de React y Next.js.
 * - useState, useEffect: Manejo del carrusel fotográfico de Montería.
 * - Image, StaticImageData: Renderizado optimizado del logo oficial de La Ronda Vive.
 * - Link: Enrutamiento directo.
 * - rondaViveLogo: Imagen oficial larondavive-logo.png.
 * - rioSinu, rondaVive1, rondaVive2: Galería de imágenes de Montería.
 */
import { useEffect, useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import rondaViveLogo from '../app/imgs/larondavive-logo.png';
import rioSinu from '../app/imgs/rio-sinu.jpg';
import rondaVive1 from '../app/imgs/la-ronda-vive-1-scaled.jpg';
import rondaVive2 from '../app/imgs/la-ronda-vive-scaled.jpg';

/**
 * Estructura de cada fotografía del carrusel.
 */
export interface HeroSlideItem {
  image: StaticImageData;
  caption: string;
}

/**
 * Fotografías oficiales de Montería.
 */
const heroSlides: HeroSlideItem[] = [
  {
    image: rioSinu,
    caption: 'Río Sinú • Parque Lineal de Montería'
  },
  {
    image: rondaVive1,
    caption: 'Calle 27 con Avenida Primera'
  },
  {
    image: rondaVive2,
    caption: 'La Ronda Vive • Encuentro Ciudadano'
  }
];

/**
 * Componente HeroSection (Con Logo Oficial de La Ronda Vive)
 * Responsabilidad Única (SRP): Mostrar el logo oficial de La Ronda Vive en el banner principal
 * tal como lo especificó el usuario, con 2 botones sobrios y la galería fotográfica de Montería.
 */
export default function HeroSection() {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % heroSlides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="clean-hero" aria-label="Registro de Asistencia Ronda Vive">
      <div className="clean-hero__container">
        {/* Encabezado con el logo oficial de La Ronda Vive */}
        <div className="clean-hero__header">
          <h1 className="clean-hero__title">Registro de Asistencia</h1>

          {/* Logo oficial de La Ronda Vive */}
          <div className="hero-logo-frame">
            <Image
              src={rondaViveLogo}
              alt="La Ronda Vive"
              height={130}
              priority
              className="hero-ronda-logo-img"
            />
          </div>

          <p className="clean-hero__subtitle">
            Confirma tu presencia en la jornada de la <strong>Calle 27 con Avenida Primera</strong>.
          </p>
        </div>

        {/* Únicamente los 2 botones de acción necesarios */}
        <div className="clean-hero__actions">
          <Link
            href="/register"
            className="clean-btn clean-btn--primary"
          >
            Registrar mi Asistencia
          </Link>

          <Link href="/pass" className="clean-btn clean-btn--secondary">
            Ver Mi Ronda Pass
          </Link>
        </div>

        {/* Galería fotográfica integrada limpia */}
        <div className="clean-hero__gallery">
          <div className="clean-gallery__frame">
            {heroSlides.map((slide, index) => {
              const isActive = index === activeIdx;

              return (
                <div
                  key={slide.caption + index}
                  className={`gallery-slide ${isActive ? 'is-active' : ''}`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.caption}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 840px"
                    className="gallery-slide__img"
                  />
                  <div className="gallery-slide__overlay" />
                  <span className="gallery-slide__caption">{slide.caption}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
