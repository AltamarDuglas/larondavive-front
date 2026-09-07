'use client';

/**
 * Componente DataPrivacyCard (Lenguaje Ciudadano Reasegurador)
 * Responsabilidad Única (SRP): Transmitir confianza al ciudadano sobre la protección de sus datos
 * personales de acuerdo con la legislación colombiana (Habeas Data).
 */
export default function DataPrivacyCard() {
  return (
    <section className="section data-privacy-section" aria-label="Protección de datos personales">
      <div className="section-heading">
        <p className="eyebrow">Seguridad y Confianza</p>
        <h2>Protección y Cuidado de tus Datos</h2>
        <p className="lede">
          Tu información está protegida bajo la Ley de Tratamiento de Datos Personales (Habeas Data).
        </p>
      </div>

      <div className="data-privacy-grid">
        {/* Tarjeta 1: Datos Solicitados */}
        <article className="privacy-card">
          <div className="privacy-card__head">
            <span className="privacy-card__icon">📋</span>
            <h3>Datos Básicos</h3>
          </div>
          <p className="privacy-card__text">
            Ingresas tu nombre, celular y correo electrónico únicamente para confirmar tu asistencia oficial en
            la jornada de la Calle 27 con Avenida Primera.
          </p>
        </article>

        {/* Tarjeta 2: Facilidad de Confirmación */}
        <article className="privacy-card">
          <div className="privacy-card__head">
            <span className="privacy-card__icon">📲</span>
            <h3>Registro Rápido</h3>
          </div>
          <p className="privacy-card__text">
            Tu teléfono recordará tus datos. Cuando vuelvas a la Ronda en próximas fechas, solo tendrás que
            presionar <strong>"Confirmar Asistencia"</strong>.
          </p>
        </article>

        {/* Tarjeta 3: Compromiso de la Alcaldía */}
        <article className="privacy-card">
          <div className="privacy-card__head">
            <span className="privacy-card__icon">🏛️</span>
            <h3>Compromiso de Ciudad</h3>
          </div>
          <p className="privacy-card__text">
            La <strong>Alcaldía de Montería</strong> cuida tu información y la utiliza exclusivamente para
            fortalecer los eventos culturales y la convivencia en nuestra ciudad.
          </p>
        </article>
      </div>
    </section>
  );
}
