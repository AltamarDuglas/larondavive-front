'use client';

/**
 * Importaciones de React y Next.js.
 * - Image: Renderizado optimizado del banner institucional de la Alcaldía de Montería.
 * - alcaldiaBanner: Imagen oficial almacenada en app/imgs/alcaldia-banner.png.
 */
import Image from 'next/image';
import alcaldiaBanner from '../app/imgs/alcaldia-banner.png';

export interface HeaderNavProps {
  /**
   * Callback opcional para reiniciar la animación intro.
   */
  onReplayIntro?: () => void;
}

/**
 * Componente HeaderNav (Versión Limpia Institucional)
 * Responsabilidad Única (SRP): Presentar el banner oficial de la Alcaldía de Montería
 * en la cabecera sin enlaces ni elementos redundantes.
 */
export default function HeaderNav({ onReplayIntro }: HeaderNavProps) {
  return (
    <header className="site-header" aria-label="Cabecera oficial de la Alcaldía de Montería">
      <div className="site-header__inner">
        <div className="site-header__brand">
          <Image
            src={alcaldiaBanner}
            alt="Alcaldía de Montería"
            height={52}
            priority
            className="brand-banner-img"
          />
        </div>
      </div>
    </header>
  );
}
