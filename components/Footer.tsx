'use client';

/**
 * Importaciones de React y Next.js.
 */
import Link from 'next/link';

/**
 * Componente Footer (Versión Sobria y Limpia)
 * Responsabilidad Única (SRP): Pie de página institucional de la plataforma Ronda Vive.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-label="Pie de página institucional">
      <div className="site-footer__inner">
        {/* Columna 1: Identidad Institucional y Ubicación */}
        <div className="site-footer__col">
          <div className="footer-brand">
            <strong>Alcaldía de Montería</strong>
          </div>
          <p className="footer-tagline">
            Plataforma Digital <strong>Ronda Vive</strong>
          </p>
          <p className="footer-location">
            Calle 27 con Avenida Primera, Montería, Córdoba.
          </p>
        </div>

        {/* Columna 2: Navegación Rápida */}
        <div className="site-footer__col">
          <h4>Navegación Institucional</h4>
          <ul className="footer-links">
            <li>
              <Link href="/">Inicio / Presentación</Link>
            </li>
            <li>
              <Link href="/register">Registrar Asistencia</Link>
            </li>
            <li>
              <Link href="/admin">Panel Administrativo</Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Información Legal de Tratamiento de Datos */}
        <div className="site-footer__col">
          <h4>Protección de Datos</h4>
          <p className="footer-text-sm">
            Cumplimiento con la Ley de Tratamiento de Datos Personales (Habeas Data). Los datos registrados
            son utilizados exclusivamente para el seguimiento de la participación ciudadana por la Alcaldía
            de Montería.
          </p>
        </div>
      </div>

      {/* Franja de Derechos Reservados */}
      <div className="site-footer__bottom">
        <p>
          © {currentYear} Alcaldía de Montería — Todos los derechos reservados. Fortaleciendo el encuentro
          y la participación en el espacio público.
        </p>
      </div>
    </footer>
  );
}
