import { MetricsSummary } from "./adminTypes";

interface AdminMetricsCardsProps {
  metricsSummary: MetricsSummary;
}

const metrics = [
  {
    label: "Ciudadanos Caracterizados",
    valueKey: "totalCiudadanos",
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </>
    ),
  },
  {
    label: "Asistencias Acumuladas",
    valueKey: "asistenciasAcumuladas",
    icon: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </>
    ),
  },
  {
    label: "Confirmación por QR",
    valueKey: "confirmacionesQr",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </>
    ),
  },
  {
    label: "Tasa de Retorno Recurrente",
    valueKey: "tasaRetorno",
    icon: (
      <>
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
      </>
    ),
  },
] as const;

export default function AdminMetricsCards({
  metricsSummary,
}: AdminMetricsCardsProps) {
  return (
    <section className="admin-metrics-row">
      {metrics.map((metric) => {
        const value = metricsSummary[metric.valueKey];
        return (
          <article className="admin-metric-card" key={metric.label}>
            <div className="metric-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {metric.icon}
              </svg>
            </div>
            <div className="metric-info">
              <span className="metric-label">{metric.label}</span>
              <strong className="metric-value">
                {typeof value === "number"
                  ? value.toLocaleString("es-CO")
                  : value}
              </strong>
            </div>
          </article>
        );
      })}
    </section>
  );
}
