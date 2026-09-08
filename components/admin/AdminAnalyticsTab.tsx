"use client";

import { AsistenteRecord, TopBarrio } from "./adminTypes";
import AnalyticsBarChart from "./AnalyticsBarChart";

interface AdminAnalyticsTabProps {
  ageBreakdown: Record<string, number>;
  asistentes: AsistenteRecord[];
  genderBreakdown: Record<string, number>;
  onExportPDF: () => void;
  socialGroupCounts: Record<string, number>;
  topBarrios: TopBarrio[];
  zoneBreakdown: Record<string, number>;
}

export default function AdminAnalyticsTab({
  ageBreakdown,
  asistentes,
  genderBreakdown,
  onExportPDF,
  socialGroupCounts,
  topBarrios,
  zoneBreakdown,
}: AdminAnalyticsTabProps) {
  const totalAsistentes = asistentes.length || 1;

  return (
    <section className="admin-tab-content">
      <div className="admin-card" style={{ marginBottom: "20px" }}>
        <div className="card-header-flex">
          <div>
            <h3>Analítica y Caracterización Demográfica</h3>
            <p className="card-desc">
              Reporte institucional de indicadores, rangos de edad, género y
              sectores de Montería.
            </p>
          </div>
          <div className="admin-header-actions">
            <button
              type="button"
              className="clean-btn clean-btn--pdf"
              onClick={onExportPDF}
              title="Generar y descargar Informe Ejecutivo de Analítica en PDF"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ marginRight: "6px" }}
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
              Exportar PDF de Analítica
            </button>
          </div>
        </div>
      </div>

      <div className="admin-grid-2">
        <article className="admin-card">
          <h3>Distribución por Rango de Edad</h3>
          <p className="card-desc">
            Caracterización etaria de los asistentes caracterizados.
          </p>
          <AnalyticsBarChart
            data={ageBreakdown}
            total={totalAsistentes}
            fillClassName="fill-blue"
          />
        </article>

        <article className="admin-card">
          <h3>Identidad de Género y Zona Territorial</h3>
          <p className="card-desc">
            Proporción por género y cobertura urbana vs rural.
          </p>

          <div className="analytics-subblock">
            <h4>Identidad de Género</h4>
            <AnalyticsBarChart
              data={genderBreakdown}
              total={totalAsistentes}
              fillClassName="fill-red"
            />
          </div>

          <div className="analytics-subblock" style={{ marginTop: "16px" }}>
            <h4>Zona Territorial</h4>
            <AnalyticsBarChart
              data={zoneBreakdown}
              total={totalAsistentes}
              fillClassName="fill-dark"
              labelPrefix="Zona "
            />
          </div>
        </article>
      </div>

      <div className="admin-grid-2" style={{ marginTop: "20px" }}>
        <article className="admin-card">
          <h3>Top Barrios de Mayor Participación en Montería</h3>
          <p className="card-desc">
            Ranking real de sectores urbanos con mayor concentración.
          </p>
          <div className="chart-bar-group">
            {topBarrios.length === 0 ? (
              <div className="empty-state">
                No hay registros de barrios suficientes.
              </div>
            ) : (
              topBarrios.map((b, idx) => {
                const max = topBarrios[0]?.count || 1;
                const pct = Math.round((b.count / max) * 100);
                return (
                  <div className="chart-bar-item" key={b.name}>
                    <div className="chart-bar-label">
                      <span>
                        {idx + 1}. {b.name}
                      </span>
                      <strong>{b.count} registros</strong>
                    </div>
                    <div className="chart-bar-track">
                      <div
                        className="chart-bar-fill fill-blue"
                        style={{ width: `${Math.max(4, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </article>

        <article className="admin-card">
          <h3>Grupos Sociales y Protección Especial</h3>
          <p className="card-desc">
            Autorreconocimiento e inclusión de sectores priorizados.
          </p>
          <AnalyticsBarChart
            data={socialGroupCounts}
            total={totalAsistentes}
            fillClassName="fill-red"
            emptyMessage="No hay registros poblacionales."
          />
        </article>
      </div>
    </section>
  );
}
