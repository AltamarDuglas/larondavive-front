/**
 * Indicadores principales del panel de administración municipal.
 */
const metrics = [
  { label: 'Ciudadanos registrados', value: '3,200' },
  { label: 'Asistencias acumuladas', value: '11,480' },
  { label: 'Confirmaciones por QR', value: '100%' },
  { label: 'Tasa de retorno recurrente', value: '30.6%' }
];

/**
 * Jornadas recientes en la Calle 27 con Avenida Primera.
 */
const journeys = [
  { date: '26 Sep 2026', event: 'RV-260926', attendees: '590', returnRate: '37%' },
  { date: '19 Sep 2026', event: 'RV-190926', attendees: '535', returnRate: '34%' },
  { date: '12 Sep 2026', event: 'RV-120926', attendees: '480', returnRate: '30%' },
  { date: '05 Sep 2026', event: 'RV-050926', attendees: '420', returnRate: '26%' }
];

/**
 * Página de Administración (/admin)
 * Panel oficial para que los funcionarios de la Alcaldía de Montería gestionen jornadas,
 * generen códigos QR y consulten los indicadores de participación.
 */
export default function AdminPage() {
  return (
    <main className="page">
      <section className="panel admin-hero">
        <div>
          <p className="eyebrow">Alcaldía de Montería</p>
          <h1>Panel de Control Institucional</h1>
          <p className="lede">
            Gestión de jornadas, generación de códigos QR y análisis continuo de asistencia ciudadana en la
            Calle 27 con Avenida Primera.
          </p>
        </div>
        <div className="admin-actions">
          <button className="button primary" type="button">
            Crear Jornada
          </button>
          <button className="button secondary" type="button">
            Generar Código QR
          </button>
        </div>
      </section>

      {/* Rejilla de métricas municipales */}
      <section className="section">
        <div className="metric-grid">
          {metrics.map((item) => (
            <article className="metric-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      {/* Registro de jornadas ejecutadas */}
      <section className="section split">
        <article className="panel">
          <p className="eyebrow">Jornadas Ejecutadas</p>
          <div className="journey-table">
            <div className="journey-head">
              <span>Fecha</span>
              <span>Código QR</span>
              <span>Asistentes</span>
              <span>Retorno</span>
            </div>
            {journeys.map((row) => (
              <div className="journey-row" key={row.event}>
                <span>{row.date}</span>
                <span>{row.event}</span>
                <span>{row.attendees}</span>
                <span>{row.returnRate}</span>
              </div>
            ))}
          </div>
        </article>

        {/* Acciones administrativas rápidas */}
        <article className="panel">
          <p className="eyebrow">Herramientas de Gestión</p>
          <div className="badge-list">
            <span>Exportar Asistentes (CSV/XLSX)</span>
            <span>Habilitar Registro de Jornada</span>
            <span>Descargar QR de Impresión</span>
            <span>Ver Reportes de Recurrencia</span>
          </div>
          <div className="notice stacked">
            <strong>Monitoreo de Participación</strong>
            <p>
              El sistema analiza automáticamente qué proporción de asistentes regresa en fechas posteriores
              para medir la apropiación del espacio público.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
