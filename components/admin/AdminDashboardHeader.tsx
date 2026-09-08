"use client";

import { isSupabaseConfigured } from "@/lib/supabaseClient";

interface AdminDashboardHeaderProps {
  onCreateJornada: () => void;
  onLogout: () => void;
}

export default function AdminDashboardHeader({
  onCreateJornada,
  onLogout,
}: AdminDashboardHeaderProps) {
  return (
    <section className="admin-header-card">
      <div className="admin-header-content">
        <div className="admin-header-title">
          <span className="eyebrow">
            Alcaldía de Montería • Secretaría de Cultura
          </span>
          <h1>Panel de Control Institucional</h1>
          <p className="lede">
            Gestión de jornadas, caracterización ciudadana y analítica continua
            en la Calle 27 con Avenida Primera.
          </p>
        </div>

        <div
          className="admin-status-pill-box"
          style={{ display: "flex", gap: "8px", alignItems: "center" }}
        >
          <span
            className={`connection-status-pill ${isSupabaseConfigured ? "is-connected" : "is-local"}`}
          >
            {isSupabaseConfigured ? "Conectado a Supabase" : "Modo Local"}
          </span>
          <button
            type="button"
            className="btn-logout"
            onClick={onLogout}
            title="Cerrar sesión"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div className="admin-header-actions">
        <button
          type="button"
          className="clean-btn clean-btn--primary"
          onClick={onCreateJornada}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ marginRight: "6px" }}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Crear Nueva Jornada
        </button>
      </div>
    </section>
  );
}
