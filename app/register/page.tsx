/**
 * Tipos de parámetros de búsqueda (searchParams) para la página de registro.
 */
type RegisterPageProps = {
  searchParams?: Promise<{
    event?: string;
    code?: string;
  }>;
};

/**
 * Página de Registro de Asistencia (/register)
 * Formulario oficial para que el ciudadano confirme su presencia en la jornada de Ronda Vive
 * en la Calle 27 con Avenida Primera de Montería.
 */
export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = (await searchParams) ?? {};
  const eventId = params.event ?? 'RV-150926';
  const qrCode = params.code ?? 'RV-150926';

  return (
    <main className="page page-narrow">
      <section className="panel register-layout">
        <div className="register-copy">
          <p className="eyebrow">Alcaldía de Montería</p>
          <h1>Confirmación de Asistencia</h1>
          <p className="lede">
            ¡Bienvenidos a Ronda Vive en la Calle 27 con Avenida Primera! Registra tus datos básicos para
            confirmar tu participación en la jornada de hoy.
          </p>

          <div className="detail-stack">
            <article className="detail-card">
              <span>Jornada</span>
              <strong>{eventId}</strong>
            </article>
            <article className="detail-card">
              <span>Código QR</span>
              <strong>{qrCode}</strong>
            </article>
            <article className="detail-card">
              <span>Lugar</span>
              <strong>Calle 27 con Av. Primera</strong>
            </article>
          </div>

          <div className="notice">
            <strong>Reconocimiento de visita</strong>
            <p>
              Una vez completado el registro, tu dispositivo recordará tu presencia para futuras fechas de la
              Ronda Vive.
            </p>
          </div>
        </div>

        {/* Formulario de captura de datos del ciudadano */}
        <form className="form register-form">
          <div className="form-head">
            <p className="eyebrow">Tus Datos</p>
            <h2>Ingresa tu información para confirmar la visita.</h2>
          </div>

          <label>
            Nombre completo
            <input type="text" placeholder="Ej: María Pérez" required />
          </label>
          <label>
            Teléfono celular
            <input type="tel" placeholder="3000000000" required />
          </label>
          <label>
            Correo electrónico
            <input type="email" placeholder="correo@ejemplo.com" required />
          </label>

          <div className="consent-grid">
            <label className="check">
              <input type="checkbox" defaultChecked required />
              Acepto el tratamiento de datos personales (Habeas Data).
            </label>
            <label className="check">
              <input type="checkbox" defaultChecked />
              Deseo recibir información de las próximas jornadas de Ronda Vive.
            </label>
          </div>

          <div className="actions">
            <button className="button primary" type="submit">
              Confirmar mi Asistencia
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
