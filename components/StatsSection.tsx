'use client';

/**
 * Componente StatsSection (Versión Sobria e Institucional)
 * Responsabilidad Única (SRP): Presentar el banner oficial de invitación a la ciudadanía para las jornadas de Ronda Vive.
 * Se eliminan las tarjetas de cifras estáticas preliminares a solicitud institucional para mantener la información 100% verídica.
 */
export default function StatsSection() {
  return (
    <section className="section stats-dashboard-section" aria-label="Invitación a la próxima fecha de Ronda Vive">
      {/* Banner de invitación pública a la ciudadanía de Montería */}
      <div className="stats-highlight-banner">
        <div className="banner-content">
          <strong>¡Te esperamos en la próxima fecha de Ronda Vive!</strong>
          <p>
            Ven con tu familia a la Calle 27 con Avenida Primera, escanea el código QR y confirma tu asistencia
            en la plataforma oficial de la <strong>Alcaldía de Montería</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}

