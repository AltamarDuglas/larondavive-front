/**
 * Datos estadísticos del historial del ciudadano.
 */
const progress = [
  { label: 'Jornadas asistidas', value: '5' },
  { label: 'Registro inicial', value: '15 SEP 2026' },
  { label: 'Última asistencia', value: 'Hoy' },
  { label: 'Punto frecuente', value: 'Calle 27' }
];

/**
 * Historial de fechas registradas en la Calle 27 con Av. Primera.
 */
const attendancesHistory = [
  { date: '15 Sep 2026', event: 'Jornada Ronda Vive 27 con Av. Primera' },
  { date: '08 Sep 2026', event: 'Jornada Ronda Vive 27 con Av. Primera' },
  { date: '01 Sep 2026', event: 'Jornada Ronda Vive 27 con Av. Primera' },
  { date: '25 Ago 2026', event: 'Jornada Ronda Vive 27 con Av. Primera' },
  { date: '18 Ago 2026', event: 'Jornada Ronda Vive 27 con Av. Primera' }
];

/**
 * Página Mi Ronda Pass (/pass)
 * Vista oficial donde el ciudadano consulta su historial acumulado de visitas en la ciudad.
 */
export default function PassPage() {
  return (
    <main className="page page-narrow">
      <section className="panel pass-layout">
        <div className="pass-header">
          <p className="eyebrow">Alcaldía de Montería</p>
          <h1>Mi Ronda Pass</h1>
          <p className="lede">
            Consulta tu historial oficial de asistencia a las jornadas de Ronda Vive en la Calle 27 con
            Avenida Primera.
          </p>
        </div>

        {/* Tarjeta con los datos del ciudadano */}
        <div className="profile-card">
          <div>
            <span className="profile-label">Ciudadano(a)</span>
            <strong>María Pérez</strong>
          </div>
          <div>
            <span className="profile-label">Estado de Participación</span>
            <strong>Asistente Frecuente</strong>
          </div>
        </div>

        {/* Cifras personales */}
        <div className="metric-grid">
          {progress.map((item) => (
            <article className="metric-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>

        {/* Listado de asistencias pasadas */}
        <div className="section">
          <p className="eyebrow">Historial de Jornadas Registradas</p>
          <div className="journey-table">
            {attendancesHistory.map((item, index) => (
              <div className="journey-row" key={index}>
                <span>📅 {item.date}</span>
                <span>📍 {item.event}</span>
                <span>✅ Confirmado</span>
              </div>
            ))}
          </div>
        </div>

        <div className="notice">
          <strong>¡Gracias por hacer parte de Ronda Vive!</strong>
          <p>Tu presencia fortalece la cultura, el encuentro y el civismo en la ciudad de Montería.</p>
        </div>
      </section>
    </main>
  );
}
