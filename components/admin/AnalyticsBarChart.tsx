"use client";

/**
 * Propiedades del componente Gráfico de Barras Progresivas (AnalyticsBarChart)
 */
interface AnalyticsBarChartProps {
  /** Objeto clave-valor con la etiqueta y la cantidad */
  data: Record<string, number>;
  /** Total global de referencia para el cálculo de porcentajes */
  total: number;
  /** Clase CSS para el gradiente de llenado (fill-blue, fill-red, fill-dark, fill-green, fill-purple) */
  fillClassName: string;
  /** Mensaje en caso de no existir datos */
  emptyMessage?: string;
  /** Prefijo opcional para cada etiqueta */
  labelPrefix?: string;
  /** Si es verdadero, oculta las barras con conteo cero */
  hideZeroValues?: boolean;
}

/**
 * Componente Gráfico de Barras Horizontales con Llenado Progresivo y Porcentajes.
 * Principio SOLID - Responsabilidad Única para representación visual en barra.
 * Mobile-First: Barras flexibles y diseño responsive.
 */
export default function AnalyticsBarChart({
  data,
  total,
  fillClassName,
  emptyMessage = "No hay registros disponibles.",
  labelPrefix = "",
  hideZeroValues = false,
}: AnalyticsBarChartProps) {
  let entries = Object.entries(data);

  if (hideZeroValues) {
    entries = entries.filter(([, count]) => count > 0);
  }

  const hasNonZero = entries.some(([, count]) => count > 0);

  if (entries.length === 0 || !hasNonZero) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  const safeTotal = total > 0 ? total : 1;

  return (
    <div className="chart-bar-group">
      {entries.map(([label, count]) => {
        const pct = Math.round((count / safeTotal) * 100);
        return (
          <div className="chart-bar-item" key={label}>
            <div className="chart-bar-label">
              <span>
                {labelPrefix}
                {label}
              </span>
              <strong>
                {count} ({pct}%)
              </strong>
            </div>
            <div className="chart-bar-track">
              <div
                className={`chart-bar-fill ${fillClassName}`}
                style={{ width: `${Math.max(count > 0 ? 4 : 0, pct)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
