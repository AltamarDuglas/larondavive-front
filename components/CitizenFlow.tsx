'use client';

/**
 * Interfaz para la definición de cada paso del registro.
 * Principio de Responsabilidad Única (SRP).
 */
export interface FlowStep {
  step: number;
  title: string;
  icon: string;
  description: string;
}

/**
 * Los 4 pasos explicativos en lenguaje natural para el ciudadano.
 */
const flowSteps: FlowStep[] = [
  {
    step: 1,
    title: 'Escanea el Código QR',
    icon: '📲',
    description: 'Encuentra los códigos QR oficiales ubicados en pendones y pantallas en la Calle 27 con Avenida Primera.'
  },
  {
    step: 2,
    title: 'Ingresa tus Datos',
    icon: '📝',
    description: 'Diligencia tu nombre, celular y correo la primera vez. Tu teléfono los recordará automáticamente.'
  },
  {
    step: 3,
    title: 'Confirma tu Asistencia',
    icon: '✅',
    description: 'Toca el botón de confirmación y recibe la validación digital instantánea de tu participación.'
  },
  {
    step: 4,
    title: 'Consulta tu Historial',
    icon: '🎟️',
    description: 'Revisa las jornadas a las que has asistido y mantén activo tu registro en Mi Ronda Pass.'
  }
];

/**
 * Componente CitizenFlow (Lenguaje Ciudadano)
 * Responsabilidad Única (SRP): Presentar los 4 pasos prácticos para que cualquier ciudadano
 * entienda cómo confirmar su asistencia fácilmente.
 */
export default function CitizenFlow() {
  return (
    <section className="section citizen-flow-section" aria-label="Pasos de registro para ciudadanos">
      <div className="section-heading text-center">
        <p className="eyebrow">Paso a Paso</p>
        <h2>¿Cómo registrarte en Ronda Vive?</h2>
        <p className="lede">
          Cuatro pasos sencillos para confirmar tu presencia en la jornada desde tu celular.
        </p>
      </div>

      <div className="flow-steps-grid">
        {flowSteps.map((item) => (
          <article className="flow-step-card" key={item.step}>
            <div className="flow-step-card__head">
              <span className="flow-step-card__number">Paso 0{item.step}</span>
              <span className="flow-step-card__icon">{item.icon}</span>
            </div>
            <h3 className="flow-step-card__title">{item.title}</h3>
            <p className="flow-step-card__desc">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
