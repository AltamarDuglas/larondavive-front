"use client";

/**
 * Propiedades del componente Gráfico de Barras Progresivas (AnalyticsBarChart)
 */
interface AnalyticsBarChartProps {
  /** Objeto clave-valor con la etiqueta y la cantidad */
  data: Record<string, number>;
  /** Total global de referencia que representa el 100% de la pista */
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
 * Componente Gráfico de Barras Horizontales con Llenado Progresivo Real.
 * Cada barra se llena proporcionalmente al 100% del total de referencia (safeTotal).
 * Principio SOLID - Responsabilidad Única para representación visual en barra.
 * Mobile-First: Barras flexibles, legibles y diseño responsivo sin emojis.
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

  // El total de referencia representa el 100% del ancho del track
  const safeTotal = total > 0 ? total : 1;

  return (
    <div className="chart-bar-group">
      {entries.map(([label, count]) => {
        // Porcentaje exacto respecto al 100% del total general
        const pctOfTotal = Math.min(100, Math.round((count / safeTotal) * 100));

        return (
          <div className="chart-bar-item" key={label}>
            <div className="chart-bar-label">
              <span>
                {labelPrefix}
                {label}
              </span>
              <strong>
                {count} ({pctOfTotal}%)
              </strong>
            </div>
            <div className="chart-bar-track">
              <div
                className={`chart-bar-fill ${fillClassName}`}
                style={{ width: `${count > 0 ? Math.max(3, pctOfTotal) : 0}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
