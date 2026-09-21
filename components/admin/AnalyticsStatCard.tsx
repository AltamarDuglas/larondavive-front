"use client";

import { ReactNode } from "react";

/**
 * Propiedades del componente de Tarjeta de Métrica (AnalyticsStatCard)
 */
interface AnalyticsStatCardProps {
  /** Título o nombre de la métrica */
  title: string;
  /** Valor principal (número o porcentaje) */
  value: string | number;
  /** Ícono o emoji decorativo */
  icon: ReactNode;
  /** Subtítulo descriptivo o tendencia */
  subtitle?: string;
  /** Variante de color para destacar (blue, red, green, purple, dark) */
  variant?: "blue" | "red" | "green" | "purple" | "dark";
  /** Etiqueta destacada (Badge opcional) */
  badgeText?: string;
}

/**
 * Componente de Tarjeta de Métrica KPI para el Panel Administrador.
 * Diseño Mobile-First: Adaptable con área táctil, sombras suaves y alta legibilidad.
 */
export default function AnalyticsStatCard({
  title,
  value,
  icon,
  subtitle,
  variant = "blue",
  badgeText,
}: AnalyticsStatCardProps) {
  return (
    <article className={`analytics-stat-card variant-${variant}`}>
      <div className="stat-card-header">
        <div className="stat-card-icon">{icon}</div>
        {badgeText && <span className="stat-card-badge">{badgeText}</span>}
      </div>

      <div className="stat-card-content">
        <span className="stat-card-title">{title}</span>
        <strong className="stat-card-value">{value}</strong>
        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
      </div>
    </article>
  );
}
