'use client';

/**
 * Componente StatsSection (Versión Sobria)
 * Responsabilidad Única (SRP): Presentar los indicadores reales de participación ciudadana en Montería.
 */
export default function StatsSection() {
  return (
    <section className="section stats-dashboard-section" aria-label="Nuestra comunidad en cifras">
      <div className="section-heading">
        <p className="eyebrow">Encuentro Ciudadano</p>
        <h2>Nuestra Comunidad en Cifras</h2>
        <p className="lede">
          Cada fin de semana cientos de monterianos se conectan en la Calle 27 con Avenida Primera.
        </p>
      </div>

      <div className="stats-cards-grid">
        {/* Indicador 1 */}
        <article className="stat-box stat-box--blue">
          <div className="stat-box__head">
            <span className="stat-box__lbl">Asistentes Registrados</span>
          </div>
          <strong className="stat-box__val">3,200</strong>
          <p className="stat-box__sub">Monterianos registrados</p>
        </article>

        {/* Indicador 2 */}
        <article className="stat-box stat-box--green">
          <div className="stat-box__head">
            <span className="stat-box__lbl">Ciudadanos Recurrentes</span>
          </div>
          <strong className="stat-box__val">30.6%</strong>
          <p className="stat-box__sub">Regresan continuamente</p>
        </article>

        {/* Indicador 3 */}
        <article className="stat-box stat-box--red">
          <div className="stat-box__head">
            <span className="stat-box__lbl">Asistencias Confirmadas</span>
          </div>
          <strong className="stat-box__val">11,480</strong>
          <p className="stat-box__sub">Registros digitales con código QR</p>
        </article>

        {/* Indicador 4 */}
        <article className="stat-box stat-box--purple">
          <div className="stat-box__head">
            <span className="stat-box__lbl">Jornadas Vividas</span>
          </div>
          <strong className="stat-box__val">12</strong>
          <p className="stat-box__sub">Ediciones completadas</p>
        </article>
      </div>

      {/* Banner de invitación pública */}
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
