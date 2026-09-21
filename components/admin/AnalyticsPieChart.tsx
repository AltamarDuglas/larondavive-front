"use client";

import { useState } from "react";
import { PieChartSlice } from "./adminTypes";

/**
 * Propiedades para el componente de Gráfico de Pastel / Dona (AnalyticsPieChart)
 */
interface AnalyticsPieChartProps {
  /** Arreglo de segmentos de datos con valor, etiqueta y color asignado */
  slices: PieChartSlice[];
  /** Título central cuando donutMode es verdadero */
  centerTitle?: string;
  /** Subtítulo o valor central destacado */
  centerValue?: string;
  /** Alterna entre formato Dona (con agujero central) o Pastel sólido */
  donutMode?: boolean;
  /** Mensaje mostrado cuando no hay datos */
  emptyMessage?: string;
}

/**
 * Componente gráfico vectorial SVG de Pastel / Dona interactivo.
 * Cumple con la arquitectura SOLID (Single Responsibility Principle) para renderizado visual liviano.
 * Mobile-First: Optimizado para interacciones táctiles en pantallas móviles.
 */
export default function AnalyticsPieChart({
  slices,
  centerTitle = "Total",
  centerValue,
  donutMode = true,
  emptyMessage = "No hay datos para representar",
}: AnalyticsPieChartProps) {
  // Estado para el segmento seleccionado al toque o pasar el cursor
  const [activeSliceIndex, setActiveSliceIndex] = useState<number | null>(null);

  // Filtrar segmentos con valor mayor a 0
  const validSlices = slices.filter((s) => s.value > 0);
  const totalValue = validSlices.reduce((acc, s) => acc + s.value, 0);

  // Estado vacío si no hay valores
  if (totalValue === 0 || validSlices.length === 0) {
    return (
      <div className="analytics-pie-empty">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
          <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  // Configuración de geometría SVG
  const size = 200;
  const center = size / 2;
  const radius = 85;
  const innerRadius = donutMode ? 55 : 0;

  // Cálculo de arcos SVG para cada segmento
  let cumulativeAngle = 0;

  const paths = validSlices.map((slice, index) => {
    const percentage = (slice.value / totalValue) * 100;
    const angle = (slice.value / totalValue) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    // Convertir grados a radianes (desfasado -90 grados para empezar en la parte superior)
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    // Coordenadas exterior
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    // Bandera de arco mayor
    const largeArcFlag = angle > 180 ? 1 : 0;

    let pathData = "";

    if (donutMode) {
      // Coordenadas interior para Dona
      const x3 = center + innerRadius * Math.cos(endRad);
      const y3 = center + innerRadius * Math.sin(endRad);
      const x4 = center + innerRadius * Math.cos(startRad);
      const y4 = center + innerRadius * Math.sin(startRad);

      pathData = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
        "Z",
      ].join(" ");
    } else {
      // Pastel Sólido
      pathData = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");
    }

    const isActive = activeSliceIndex === index;

    return {
      slice,
      percentage,
      pathData,
      isActive,
      index,
    };
  });

  const activeSlice =
    activeSliceIndex !== null ? validSlices[activeSliceIndex] : null;

  return (
    <div className="analytics-pie-container">
      {/* Gráfico Vectorial SVG */}
      <div className="analytics-pie-wrapper">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="analytics-pie-svg"
          aria-label="Gráfico de Pastel o Dona"
        >
          {paths.map(({ pathData, slice, isActive, index }) => (
            <path
              key={slice.label}
              d={pathData}
              fill={slice.color}
              stroke="#ffffff"
              strokeWidth="2.5"
              className={`analytics-pie-slice ${isActive ? "is-active" : ""}`}
              onMouseEnter={() => setActiveSliceIndex(index)}
              onMouseLeave={() => setActiveSliceIndex(null)}
              onTouchStart={() => setActiveSliceIndex(index)}
              style={{
                cursor: "pointer",
                transition: "transform 180ms ease, opacity 180ms ease",
                transform: isActive ? "scale(1.04)" : "scale(1)",
                transformOrigin: `${center}px ${center}px`,
                opacity: activeSliceIndex === null || isActive ? 1 : 0.65,
              }}
            >
              <title>{`${slice.label}: ${slice.value} (${(
                (slice.value / totalValue) *
                100
              ).toFixed(1)}%)`}</title>
            </path>
          ))}

          {/* Texto Central en Modo Dona */}
          {donutMode && (
            <g className="analytics-pie-center-text">
              <circle
                cx={center}
                cy={center}
                r={innerRadius - 4}
                fill="#ffffff"
              />
              <text
                x={center}
                y={center - 6}
                textAnchor="middle"
                className="analytics-pie-center-label"
              >
                {activeSlice ? activeSlice.label : centerTitle}
              </text>
              <text
                x={center}
                y={center + 14}
                textAnchor="middle"
                className="analytics-pie-center-val"
              >
                {activeSlice
                  ? `${activeSlice.value} (${(
                      (activeSlice.value / totalValue) *
                      100
                    ).toFixed(1)}%)`
                  : centerValue || `${totalValue}`}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Leyenda Explicativa de Colores */}
      <div className="analytics-pie-legend">
        {validSlices.map((slice, index) => {
          const percentage = ((slice.value / totalValue) * 100).toFixed(1);
          const isActive = activeSliceIndex === index;

          return (
            <div
              key={slice.label}
              className={`analytics-pie-legend-item ${
                isActive ? "is-active" : ""
              }`}
              onMouseEnter={() => setActiveSliceIndex(index)}
              onMouseLeave={() => setActiveSliceIndex(null)}
              onTouchStart={() => setActiveSliceIndex(index)}
            >
              <span
                className="analytics-pie-legend-dot"
                style={{ backgroundColor: slice.color }}
              />
              <span className="analytics-pie-legend-text">{slice.label}</span>
              <strong className="analytics-pie-legend-count">
                {slice.value} ({percentage}%)
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}
