import { AsistenteRecord, JornadaRecord } from "@/lib/supabaseClient";

export type AdminTab = "analytics" | "jornadas" | "asistentes";

export interface MetricsSummary {
  totalCiudadanos: number;
  asistenciasAcumuladas: number;
  confirmacionesQr: string;
  tasaRetorno: string;
}

export interface TopBarrio {
  name: string;
  count: number;
}

export type { AsistenteRecord, JornadaRecord };
