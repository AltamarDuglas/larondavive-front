'use client';

/**
 * Importaciones de React y Next.js.
 * - Link: Enrutamiento del cliente de Next.js sin recargar la página.
 * - Image: Renderizado optimizado del banner institucional de la Alcaldía de Montería.
 * - alcaldiaBanner: Imagen del banner oficial almacenada en app/imgs/alcaldia-banner.png.
 */
import Link from 'next/link';
import Image from 'next/image';
import alcaldiaBanner from '../app/imgs/alcaldia-banner.png';

/**
 * Interfaz de propiedades para HeaderNav.
 * Principio de Inversión de Dependencias (DIP).
 */
export interface HeaderNavProps {
  /** Callback opcional para volver a reproducir la presentación introductoria */
  onReplayIntro?: () => void;
}

/**
 * Componente HeaderNav (Con Banner de la Alcaldía)
 * Responsabilidad Única (SRP): Renderizar el encabezado con la imagen oficial del banner
 * de la Alcaldía de Montería en lugar del texto simple.
 */
export default function HeaderNav({ onReplayIntro }: HeaderNavProps) {
  return (
    <header className="site-header" aria-label="Navegación oficial de La Ronda Vive">
      <div className="site-header__inner">
        {/* Marca oficial con la imagen del banner de la Alcaldía de Montería */}
        <Link href="/" className="site-header__brand" aria-label="Ir al inicio de Ronda Vive">
          <Image
            src={alcaldiaBanner}
            alt="Alcaldía de Montería"
            height={36}
            priority
            className="brand-banner-img"
          />
          <span className="brand-divider">|</span>
        </Link>

        {/* Menú de navegación sobrio y compacto */}
        <nav className="site-header__nav" aria-label="Enlaces principales">




        </nav>
      </div>
    </header>
  );
}
