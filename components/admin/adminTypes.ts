// Importación de tipos de registros de Supabase
import { AsistenteRecord, JornadaRecord, AsistenciaRecord } from "@/lib/supabaseClient";

/**
 * Pestañas principales de navegación del panel administrador
 */
export type AdminTab = "analytics" | "jornadas" | "asistentes";

/**
 * Resumen de indicadores clave de rendimiento (KPIs)
 */
export interface MetricsSummary {
  /** Total de ciudadanos únicos registrados en la plataforma */
  totalCiudadanos: number;
  /** Total acumulado de ingresos a jornadas */
  asistenciasAcumuladas: number;
  /** Porcentaje de confirmación vía código QR */
  confirmacionesQr: string;
  /** Tasa de retorno de ciudadanos a múltiples jornadas */
  tasaRetorno: string;
  /** Total de niños acompañantes registrados */
  totalNiñosAcompañantes: number;
  /** Porcentaje de ciudadanos nacidos en Montería */
  porcentajeNacidosMonteria: string;
  /** Porcentaje de cumplimiento de Habeas Data */
  porcentajeHabeasData: string;
  /** Porcentaje de aceptación de Términos Estímulos 2026 */
  porcentajeTerminos: string;
}

/**
 * Estructura de ítem para ranking de barrios
 */
export interface TopBarrio {
  /** Nombre del barrio u urbanización */
  name: string;
  /** Cantidad de registros acumulados */
  count: number;
}

/**
 * Estructura de segmento de datos para gráficos de pastel / dona (PieChart / DonutChart)
 */
export interface PieChartSlice {
  /** Etiqueta descriptiva del segmento */
  label: string;
  /** Valor numérico del segmento */
  value: number;
  /** Color hexadecimal o CSS asignado al segmento */
  color: string;
  /** Porcentaje relativo calculado (0-100) */
  percentage?: number;
}

/**
 * Desglose de origen de nacimiento fuera de Montería
 */
export interface OriginLocationCount {
  location: string;
  count: number;
}

/**
 * Objeto consolidado con todas las métricas analíticas representativas del 100% de los datos
 */
export interface FullAnalyticsData {
  metricsSummary: MetricsSummary;
  ageBreakdown: Record<string, number>;
  genderBreakdown: Record<string, number>;
  zoneBreakdown: Record<string, number>;
  bornInMonteriaBreakdown: Record<string, number>;
  topOriginLocations: OriginLocationCount[];
  attendedWithChildrenBreakdown: Record<string, number>;
  childrenCountDistribution: Record<string, number>;
  comunaBreakdown: Record<string, number>;
  topBarrios: TopBarrio[];
  populationGroupBreakdown: Record<string, number>;
  socialGroupCounts: Record<string, number>;
  otherSocialGroupSpecs: string[];
  habeasDataBreakdown: Record<string, number>;
  termsAcceptanceBreakdown: Record<string, number>;
  jornadaAttendanceCounts: Record<string, number>;
}

export type { AsistenteRecord, JornadaRecord, AsistenciaRecord };

