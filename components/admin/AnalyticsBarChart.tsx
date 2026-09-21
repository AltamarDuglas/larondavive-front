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
  /** Si es verdadero (por defecto), la barra del elemento superior llena el 100% de la pista y las demás escalan proporcionalmente */
  useRelativeMax?: boolean;
}

/**
 * Componente Gráfico de Barras Horizontales con Llenado Progresivo Escalado y Porcentajes.
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
  useRelativeMax = true,
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
  const maxCount = Math.max(...entries.map(([, c]) => c), 1);

  return (
    <div className="chart-bar-group">
      {entries.map(([label, count]) => {
        const pctOfTotal = Math.round((count / safeTotal) * 100);
        // Ancho visual de la barra: relativo al valor máximo o al total global
        const widthPct = useRelativeMax
          ? Math.round((count / maxCount) * 100)
          : pctOfTotal;

        return (
          <div className="chart-bar-item" key={label}>
            <div className="chart-bar-label">
              <span>
                {labelPrefix}
                {label}
              </span>
              <strong>
                {count} {safeTotal > 0 ? `(${pctOfTotal}%)` : ""}
              </strong>
            </div>
            <div className="chart-bar-track">
              <div
                className={`chart-bar-fill ${fillClassName}`}
                style={{ width: `${Math.max(count > 0 ? 6 : 0, widthPct)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
