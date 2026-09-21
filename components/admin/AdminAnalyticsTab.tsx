"use client";

import { FullAnalyticsData, JornadaRecord } from "./adminTypes";
import AnalyticsBarChart from "./AnalyticsBarChart";
import AnalyticsPieChart from "./AnalyticsPieChart";
import AnalyticsStatCard from "./AnalyticsStatCard";

/**
 * Propiedades para la pestaña de Analítica Institucional (AdminAnalyticsTab)
 */
interface AdminAnalyticsTabProps {
  /** Objeto unificado con el 100% de los datos analíticos */
  fullAnalytics: FullAnalyticsData;
  /** Lista de jornadas institucionales disponibles */
  jornadas: JornadaRecord[];
  /** Código de la jornada activa seleccionada para filtrar ("TODAS" o código específico) */
  selectedJornadaFilter: string;
  /** Función callback al cambiar el filtro de jornada */
  onJornadaFilterChange: (code: string) => void;
  /** Callback para exportación oficial en PDF */
  onExportPDF: () => void;
  /** Callback para exportación en Excel */
  onExportExcel: () => void;
  /** Callback para exportación en CSV */
  onExportCSV: () => void;
}

/**
 * Pestaña de Analítica General y Caracterización Sociodemográfica del Panel Administrador.
 * Principio SOLID - SRP: Presentación desacoplada y estructurada de desgloses estadísticos.
 * Mobile-First: Optimizado con tarjetas fluidas, rejillas adaptables y gráficos vectoriales SVG táctiles.
 */
export default function AdminAnalyticsTab({
  fullAnalytics,
  jornadas,
  selectedJornadaFilter,
  onJornadaFilterChange,
  onExportPDF,
  onExportExcel,
  onExportCSV,
}: AdminAnalyticsTabProps) {
  const {
    metricsSummary,
    ageBreakdown,
    genderBreakdown,
    zoneBreakdown,
    bornInMonteriaBreakdown,
    topOriginLocations,
    attendedWithChildrenBreakdown,
    childrenCountDistribution,
    comunaBreakdown,
    topBarrios,
    populationGroupBreakdown,
    socialGroupCounts,
    otherSocialGroupSpecs,
    habeasDataBreakdown,
    termsAcceptanceBreakdown,
    jornadaAttendanceCounts,
  } = fullAnalytics;

  const totalCiudadanos = metricsSummary.totalCiudadanos || 1;

  // Transformación de datos para Gráfico de Dona: Identidad de Género
  const genderSlices = [
    { label: "Femenino", value: genderBreakdown["Femenino"] || 0, color: "#dc2626" },
    { label: "Masculino", value: genderBreakdown["Masculino"] || 0, color: "#2563eb" },
    { label: "OSIGD", value: genderBreakdown["OSIGD"] || 0, color: "#9333ea" },
    { label: "Prefiero no responder", value: genderBreakdown["Prefiero no responder"] || 0, color: "#64748b" },
  ];

  // Transformación de datos para Gráfico de Pastel: Nacimiento en Montería
  const bornInMonteriaSlices = [
    { label: "Montería", value: bornInMonteriaBreakdown["Nacidos en Montería"] || 0, color: "#16a34a" },
    { label: "Fuera de Montería", value: bornInMonteriaBreakdown["Nacidos fuera de Montería"] || 0, color: "#ea580c" },
  ];

  // Transformación para Gráfico de Dona: Asistencia con Niños/as
  const childrenSlices = [
    { label: "Con Niños/as", value: attendedWithChildrenBreakdown["Con Niños/as"] || 0, color: "#0284c7" },
    { label: "Sin Niños/as", value: attendedWithChildrenBreakdown["Sin Niños/as"] || 0, color: "#94a3b8" },
  ];

  // Transformación para Gráfico de Dona: Zona Territorial (Urbana vs Rural)
  const zoneSlices = [
    { label: "Zona Urbana", value: zoneBreakdown["Urbana"] || 0, color: "#2563eb" },
    { label: "Zona Rural", value: zoneBreakdown["Rural"] || 0, color: "#16a34a" },
  ];

  // Transformación para Gráfico de Dona: Pertenencia Étnica / Poblacional
  const populationGroupSlices = [
    { label: "Comunidades Indígenas", value: populationGroupBreakdown["Comunidades indígenas"] || 0, color: "#d97706" },
    { label: "NARP (Afro/Raizal)", value: populationGroupBreakdown["NARP"] || 0, color: "#059669" },
    { label: "ROM (Gitanos)", value: populationGroupBreakdown["Pueblos gitanos (ROM)"] || 0, color: "#7c3aed" },
    { label: "Ninguno / General", value: populationGroupBreakdown["Ninguno"] || 0, color: "#475569" },
  ];

  // Transformación para Gráfico de Dona: Habeas Data
  const habeasSlices = [
    { label: "Autorizado (Sí)", value: habeasDataBreakdown["Aceptado (Sí)"] || 0, color: "#16a34a" },
    { label: "Pendiente (No)", value: habeasDataBreakdown["Pendiente (No)"] || 0, color: "#dc2626" },
  ];

  return (
    <section className="admin-tab-content">
      {/* HEADER BAR CON FILTRO DE JORNADA Y EXPORTACIONES */}
      <div className="admin-card admin-filter-header-card" style={{ marginBottom: "20px" }}>
        <div className="card-header-flex">
          <div>
            <span className="admin-badge-tag">Analítica Municipal 100% Completa</span>
            <h3>Caracterización Sociodemográfica y Reporte de Datos</h3>
            <p className="card-desc">
              Visualización de indicadores de participación, perfilación demográfica, origen, niñez, comunas y protección especial.
            </p>
          </div>

          <div className="admin-header-actions">
            {/* SELECTOR DE FILTRO DE JORNADA */}
            <div className="jornada-filter-selector">
              <label htmlFor="jornada-filter-select" className="filter-select-label">
                Filtro por Jornada:
              </label>
              <select
                id="jornada-filter-select"
                className="clean-select"
                value={selectedJornadaFilter}
                onChange={(e) => onJornadaFilterChange(e.target.value)}
              >
                <option value="TODAS">📍 Todas las Jornadas (Acumulado General)</option>
                {jornadas.map((j) => (
                  <option key={j.code} value={j.code}>
                    {j.code} — {j.title} ({j.status})
                  </option>
                ))}
              </select>
            </div>

            {/* BOTONES DE EXPORTACIÓN */}
            <div className="export-btn-group">
              <button
                type="button"
                className="clean-btn clean-btn--pdf"
                onClick={onExportPDF}
                title="Descargar Informe Ejecutivo en PDF"
              >
                📄 PDF
              </button>
              <button
                type="button"
                className="clean-btn clean-btn--excel"
                onClick={onExportExcel}
                title="Exportar a Excel"
              >
                📊 Excel
              </button>
              <button
                type="button"
                className="clean-btn"
                onClick={onExportCSV}
                title="Exportar CSV"
              >
                📥 CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: TARJETAS MÉTRICAS KPI (RESPONSIVAS MOBILE-FIRST) */}
      <div className="admin-stat-cards-grid" style={{ marginBottom: "24px" }}>
        <AnalyticsStatCard
          title="Ciudadanos Caracterizados"
          value={metricsSummary.totalCiudadanos}
          icon="👥"
          subtitle="Registros únicos en la plataforma"
          variant="blue"
        />
        <AnalyticsStatCard
          title="Ingresos Confirmados QR"
          value={metricsSummary.asistenciasAcumuladas}
          icon="🎟️"
          subtitle={`Tasa de Confirmación: ${metricsSummary.confirmacionesQr}`}
          variant="green"
        />
        <AnalyticsStatCard
          title="Niños/as Acompañantes"
          value={metricsSummary.totalNiñosAcompañantes}
          icon="🧸"
          subtitle="Acompañamiento en núcleo familiar"
          variant="purple"
        />
        <AnalyticsStatCard
          title="Nacidos en Montería"
          value={metricsSummary.porcentajeNacidosMonteria}
          icon="🏛️"
          subtitle="Población nativa del municipio"
          variant="dark"
        />
        <AnalyticsStatCard
          title="Tasa de Retorno Recurrente"
          value={metricsSummary.tasaRetorno}
          icon="🔄"
          subtitle="Asistentes a 2 o más jornadas"
          variant="red"
        />
      </div>

      {/* SECCIÓN 2: DEMOGRAFÍA Y GÉNERO */}
      <div className="admin-grid-2" style={{ marginBottom: "20px" }}>
        <article className="admin-card">
          <div className="card-title-group">
            <h3>Identidad de Género</h3>
            <span className="card-badge">Gráfico de Dona</span>
          </div>
          <p className="card-desc">
            Distribución porcentual por géneros e identidades diversas (OSIGD).
          </p>
          <AnalyticsPieChart
            slices={genderSlices}
            centerTitle="Población"
            centerValue={`${metricsSummary.totalCiudadanos}`}
            donutMode={true}
          />
        </article>

        <article className="admin-card">
          <div className="card-title-group">
            <h3>Distribución por Rango de Edad</h3>
            <span className="card-badge">Gráfico de Barras</span>
          </div>
          <p className="card-desc">
            Caracterización etaria de la población desde los 18 hasta más de 70 años.
          </p>
          <AnalyticsBarChart
            data={ageBreakdown}
            total={totalCiudadanos}
            fillClassName="fill-blue"
          />
        </article>
      </div>

      {/* SECCIÓN 3: ORIGEN Y ACOMPAÑAMIENTO FAMILIAR */}
      <div className="admin-grid-2" style={{ marginBottom: "20px" }}>
        <article className="admin-card">
          <div className="card-title-group">
            <h3>Origen de Nacimiento</h3>
            <span className="card-badge">Gráfico de Pastel</span>
          </div>
          <p className="card-desc">
            Proporción de ciudadanos nacidos en Montería vs. otros municipios del país.
          </p>
          <AnalyticsPieChart
            slices={bornInMonteriaSlices}
            centerTitle="Origen"
            centerValue={metricsSummary.porcentajeNacidosMonteria}
            donutMode={false}
          />

          {topOriginLocations.length > 0 && (
            <div className="analytics-subblock" style={{ marginTop: "16px" }}>
              <h4>Top Lugares de Origen (Fuera de Montería)</h4>
              <div className="chart-bar-group">
                {topOriginLocations.map((item) => (
                  <div className="chart-bar-item" key={item.location}>
                    <div className="chart-bar-label">
                      <span>{item.location}</span>
                      <strong>{item.count} personas</strong>
                    </div>
                    <div className="chart-bar-track">
                      <div
                        className="chart-bar-fill fill-dark"
                        style={{
                          width: `${Math.max(
                            6,
                            Math.round(
                              (item.count / (topOriginLocations[0]?.count || 1)) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        <article className="admin-card">
          <div className="card-title-group">
            <h3>Acompañamiento de Niños/as y Familia</h3>
            <span className="card-badge">Gráfico de Dona & Barras</span>
          </div>
          <p className="card-desc">
            Asistencia familiar y distribución por cantidad de niños menores acompañantes.
          </p>
          <AnalyticsPieChart
            slices={childrenSlices}
            centerTitle="Total Niños"
            centerValue={`${metricsSummary.totalNiñosAcompañantes}`}
            donutMode={true}
          />

          <div className="analytics-subblock" style={{ marginTop: "16px" }}>
            <h4>Distribución por Número de Niños Acompañantes</h4>
            <AnalyticsBarChart
              data={childrenCountDistribution}
              total={metricsSummary.totalNiñosAcompañantes || 1}
              fillClassName="fill-purple"
              emptyMessage="No hay acompañamiento de niños registrado."
            />
          </div>
        </article>
      </div>

      {/* SECCIÓN 4: COBERTURA TERRITORIAL Y BARRIOS */}
      <div className="admin-grid-2" style={{ marginBottom: "20px" }}>
        <article className="admin-card">
          <div className="card-title-group">
            <h3>Distribución por Comunas de Montería</h3>
            <span className="card-badge">Gráfico de Barras</span>
          </div>
          <p className="card-desc">
            Participación comunal de la zona urbana (Comunas 1 a 9).
          </p>
          <AnalyticsBarChart
            data={comunaBreakdown}
            total={totalCiudadanos}
            fillClassName="fill-blue"
          />
        </article>

        <article className="admin-card">
          <div className="card-title-group">
            <h3>Zona Territorial y Top Barrios</h3>
            <span className="card-badge">Dona & Ranking</span>
          </div>
          <p className="card-desc">
            Cobertura Urbana vs. Rural y sectores urbanos con mayor concentración.
          </p>

          <AnalyticsPieChart
            slices={zoneSlices}
            centerTitle="Zona"
            centerValue={zoneBreakdown["Urbana"] > zoneBreakdown["Rural"] ? "Urbana" : "Rural"}
            donutMode={true}
          />

          <div className="analytics-subblock" style={{ marginTop: "16px" }}>
            <h4>Top 10 Barrios de Mayor Participación</h4>
            <div className="chart-bar-group">
              {topBarrios.length === 0 ? (
                <div className="empty-state">No hay registros de barrios.</div>
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
          </div>
        </article>
      </div>

      {/* SECCIÓN 5: INCLUSIÓN POBLACIONAL Y ESPECIAL PROTECCIÓN */}
      <div className="admin-grid-2" style={{ marginBottom: "20px" }}>
        <article className="admin-card">
          <div className="card-title-group">
            <h3>Pertenencia Étnica y Grupos Poblacionales</h3>
            <span className="card-badge">Gráfico de Dona</span>
          </div>
          <p className="card-desc">
            Autorreconocimiento étnico: Comunidades Indígenas, NARP y Pueblos Gitanos (ROM).
          </p>
          <AnalyticsPieChart
            slices={populationGroupSlices}
            centerTitle="Población"
            centerValue={`${metricsSummary.totalCiudadanos}`}
            donutMode={true}
          />
        </article>

        <article className="admin-card">
          <div className="card-title-group">
            <h3>Sujetos de Especial Protección Social</h3>
            <span className="card-badge">Gráfico de Barras</span>
          </div>
          <p className="card-desc">
            Sectores priorizados: Víctimas del conflicto, mujeres, discapacidad, adultos mayores, campesinos.
          </p>
          <AnalyticsBarChart
            data={socialGroupCounts}
            total={totalCiudadanos}
            fillClassName="fill-red"
            emptyMessage="No hay registros poblacionales."
          />

          {otherSocialGroupSpecs.length > 0 && (
            <div className="other-social-specs-box" style={{ marginTop: "14px" }}>
              <h4>Otros Grupos Sociales Especificados:</h4>
              <div className="specs-tag-list">
                {otherSocialGroupSpecs.slice(0, 8).map((spec, idx) => (
                  <span className="spec-tag-item" key={idx}>
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>

      {/* SECCIÓN 6: CUMPLIMIENTO LEGAL Y ASISTENCIA POR JORNADAS */}
      <div className="admin-grid-2">
        <article className="admin-card">
          <div className="card-title-group">
            <h3>Cumplimiento Legal y Habeas Data</h3>
            <span className="card-badge">Gráfico de Dona</span>
          </div>
          <p className="card-desc">
            Autorización de tratamiento de datos personales conforme a la ley colombiana.
          </p>
          <AnalyticsPieChart
            slices={habeasSlices}
            centerTitle="Habeas Data"
            centerValue={metricsSummary.porcentajeHabeasData}
            donutMode={true}
          />
        </article>

        <article className="admin-card">
          <div className="card-title-group">
            <h3>Ingresos Confirmados por Código de Jornada</h3>
            <span className="card-badge">Gráfico de Barras</span>
          </div>
          <p className="card-desc">
            Total acumulado de asistentes escaneados con QR por cada evento.
          </p>
          <AnalyticsBarChart
            data={jornadaAttendanceCounts}
            total={metricsSummary.asistenciasAcumuladas || 1}
            fillClassName="fill-green"
            emptyMessage="No hay registros de asistencia por jornada."
            labelPrefix="Jornada "
          />
        </article>
      </div>
    </section>
  );
}
