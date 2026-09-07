'use client';

/**
 * Importaciones de Next.js para navegación limpia y sin recarga.
 */
import Link from 'next/link';

/**
 * Interfaz de propiedades para HeaderNav.
 */
export interface HeaderNavProps {
  /** Callback para volver a reproducir la presentación */
  onReplayIntro?: () => void;
}

/**
 * Componente HeaderNav (Versión Sobria y Profesional)
 * Responsabilidad Única (SRP): Encabezado superior con la identidad institucional de la Alcaldía de Montería
 * sin emojis ni saturación visual.
 */
export default function HeaderNav({ onReplayIntro }: HeaderNavProps) {
  return (
    <header className="site-header" aria-label="Navegación oficial de La Ronda Vive">
      <div className="site-header__inner">
        {/* Marca institucional sobria */}
        <Link href="/" className="site-header__brand" aria-label="Ir al inicio de Ronda Vive">
          <span className="brand-badge-gov">Alcaldía de Montería</span>
          <span className="brand-title">
            La Ronda Vive <span className="brand-tag">PASS</span>
          </span>
        </Link>

        {/* Menú de navegación en lenguaje natural */}
        <nav className="site-header__nav" aria-label="Enlaces principales">
          <Link href="/" className="nav-item">
            Inicio
          </Link>

          <Link href="/register?event=RV-150926&code=RV-150926" className="nav-item">
            Registrar Asistencia
          </Link>

          <Link href="/pass" className="nav-item">
            Mi Ronda Pass
          </Link>

          <Link href="/admin" className="nav-item nav-item--subtle">
            Panel de Control
          </Link>

          {/* Botón sobrio para reproducir la intro */}
          {onReplayIntro && (
            <button
              type="button"
              onClick={onReplayIntro}
              className="nav-btn-intro"
              title="Ver presentación inicial"
            >
              Intro
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
