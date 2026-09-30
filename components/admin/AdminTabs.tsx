"use client";

import { AdminTab } from "./adminTypes";

interface AdminTabsProps {
  activeTab: AdminTab;
  asistentesCount: number;
  jornadasCount: number;
  dudasCount?: number;
  onTabChange: (tab: AdminTab) => void;
}

export default function AdminTabs({
  activeTab,
  asistentesCount,
  jornadasCount,
  dudasCount = 0,
  onTabChange,
}: AdminTabsProps) {
  return (
    <div className="admin-tabs-bar">
      <button
        type="button"
        className={`admin-tab-btn ${activeTab === "analytics" ? "is-active" : ""}`}
        onClick={() => onTabChange("analytics")}
      >
        Analítica y Caracterización
      </button>
      <button
        type="button"
        className={`admin-tab-btn ${activeTab === "jornadas" ? "is-active" : ""}`}
        onClick={() => onTabChange("jornadas")}
      >
        Gestión de Jornadas ({jornadasCount})
      </button>
      <button
        type="button"
        className={`admin-tab-btn ${activeTab === "asistentes" ? "is-active" : ""}`}
        onClick={() => onTabChange("asistentes")}
      >
        Directorio de Asistentes ({asistentesCount})
      </button>
      <button
        type="button"
        className={`admin-tab-btn ${activeTab === "dudas" ? "is-active" : ""}`}
        onClick={() => onTabChange("dudas")}
      >
        Buzón de Dudas e Inquietudes ({dudasCount})
      </button>
    </div>
  );
}
