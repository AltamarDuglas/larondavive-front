"use client";

import { useState } from "react";
import { JornadaRecord } from "./adminTypes";

interface AdminJornadasTabProps {
  jornadas: JornadaRecord[];
  onCreateJornada: () => void;
  onSelectQrJornada: (jornada: JornadaRecord) => void;
  onUpdateStatus?: (
    code: string,
    newStatus: "activa" | "programada" | "finalizada"
  ) => void;
  onUpdateTitle?: (code: string, newTitle: string) => void;
}

/**
 * Pestaña de Gestión de Jornadas Institucionales.
 * Permite cambiar el estado de actividad, ver el pendón QR y editar el título/nombre oficial.
 * Sin Emojis: Utiliza íconos vectoriales SVG limpios.
 */
export default function AdminJornadasTab({
  jornadas,
  onCreateJornada,
  onSelectQrJornada,
  onUpdateStatus,
  onUpdateTitle,
}: AdminJornadasTabProps) {
  // Estado para edición inline del nombre de la jornada
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState<string>("");

  const startEditing = (j: JornadaRecord) => {
    setEditingCode(j.code);
    setEditingTitleText(j.title);
  };

  const cancelEditing = () => {
    setEditingCode(null);
    setEditingTitleText("");
  };

  const saveEditing = (code: string) => {
    if (editingTitleText.trim() && onUpdateTitle) {
      onUpdateTitle(code, editingTitleText.trim());
    }
    setEditingCode(null);
  };

  return (
    <section className="admin-tab-content">
      <div className="admin-card">
        <div className="card-header-flex">
          <div>
            <h3>Jornadas de Ronda Vive Registradas</h3>
            <p className="card-desc">
              Edición de nombres oficiales, códigos QR y gestión de estado de actividad.
            </p>
          </div>
          <button
            type="button"
            className="clean-btn clean-btn--primary"
            onClick={onCreateJornada}
          >
            + Crear Jornada
          </button>
        </div>

        <div className="table-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Código QR</th>
                <th>Nombre / Título de la Jornada</th>
                <th>Fecha</th>
                <th>Estado de Actividad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {jornadas.map((j) => {
                const isEditing = editingCode === j.code;

                return (
                  <tr key={j.code}>
                    <td>
                      <strong className="code-tag">{j.code}</strong>
                    </td>
                    <td>
                      {isEditing ? (
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input
                            type="text"
                            value={editingTitleText}
                            onChange={(e) => setEditingTitleText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEditing(j.code);
                              if (e.key === "Escape") cancelEditing();
                            }}
                            className="clean-input"
                            style={{
                              padding: "4px 8px",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              minHeight: "32px",
                              width: "100%",
                              maxWidth: "280px",
                            }}
                            autoFocus
                          />
                          <button
                            type="button"
                            className="btn-table-action"
                            onClick={() => saveEditing(j.code)}
                            title="Guardar nuevo nombre"
                            style={{ background: "#16a34a", color: "#ffffff", border: "none" }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            className="btn-table-action"
                            onClick={cancelEditing}
                            title="Cancelar edición"
                            style={{ background: "#dc2626", color: "#ffffff", border: "none" }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontWeight: 700 }}>{j.title}</span>
                          <button
                            type="button"
                            onClick={() => startEditing(j)}
                            title="Editar nombre de esta jornada"
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: "2px",
                              color: "#2563eb",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                    <td>{j.event_date}</td>
                    <td>
                      <select
                        value={j.status}
                        onChange={(e) =>
                          onUpdateStatus?.(
                            j.code,
                            e.target.value as "activa" | "programada" | "finalizada"
                          )
                        }
                        className={`status-badge status-${j.status}`}
                        style={{
                          border: "1px solid rgba(0, 0, 0, 0.1)",
                          cursor: "pointer",
                          outline: "none",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        }}
                        title="Haz clic para cambiar el estado de la jornada"
                      >
                        <option value="activa">Activa</option>
                        <option value="programada">Programada</option>
                        <option value="finalizada">Finalizada</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-table-action"
                        onClick={() => onSelectQrJornada(j)}
                      >
                        Ver/Imprimir QR
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
