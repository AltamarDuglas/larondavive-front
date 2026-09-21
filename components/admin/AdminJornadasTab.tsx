"use client";

import { useState } from "react";
import { JornadaRecord } from "./adminTypes";

interface AdminJornadasTabProps {
  jornadas: JornadaRecord[];
  jornadaAttendanceCounts?: Record<string, number>;
  onCreateJornada: () => void;
  onSelectQrJornada: (jornada: JornadaRecord) => void;
  onUpdateStatus?: (
    code: string,
    newStatus: "activa" | "programada" | "finalizada"
  ) => void;
  onUpdateTitle?: (code: string, newTitle: string) => void;
  onDeleteJornada?: (code: string) => void;
}

/**
 * Pestaña de Gestión de Jornadas Institucionales con UX Mobile-First Desplegable.
 * Reemplaza la tabla horizontal por una lista colapsable (acordeón):
 * En reposo solo muestra Código, Nombre y Badge de Personas Registradas.
 * Al tocar o hacer clic, se despliegan fecha, lugar, selector de estado y opciones de edición/eliminación.
 * Sin Emojis: Utiliza exclusivamente íconos vectoriales SVG.
 */
export default function AdminJornadasTab({
  jornadas,
  jornadaAttendanceCounts = {},
  onCreateJornada,
  onSelectQrJornada,
  onUpdateStatus,
  onUpdateTitle,
  onDeleteJornada,
}: AdminJornadasTabProps) {
  // Estado para la jornada desplegada actualmente
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  // Estado para edición inline del título
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState<string>("");

  const toggleExpand = (code: string) => {
    setExpandedCode((prev) => (prev === code ? null : code));
  };

  const startEditing = (j: JornadaRecord, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingCode(j.code);
    setEditingTitleText(j.title);
  };

  const cancelEditing = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingCode(null);
    setEditingTitleText("");
  };

  const saveEditing = (code: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (editingTitleText.trim() && onUpdateTitle) {
      onUpdateTitle(code, editingTitleText.trim());
    }
    setEditingCode(null);
  };

  const handleDelete = (code: string, count: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (count > 0) {
      const confirmMsg = `ADVERTENCIA: Esta jornada tiene ${count} personas registradas. ¿Estás seguro de que deseas eliminarla del sistema?`;
      if (window.confirm(confirmMsg)) {
        onDeleteJornada?.(code);
      }
    } else {
      if (window.confirm(`¿Deseas eliminar la jornada ${code}? No tiene registros asociados.`)) {
        onDeleteJornada?.(code);
      }
    }
  };

  return (
    <section className="admin-tab-content">
      <div className="admin-card">
        <div className="card-header-flex">
          <div>
            <span className="admin-badge-tag">Gestión de Jornadas</span>
            <h3>Jornadas de La Ronda Vive Registradas</h3>
            <p className="card-desc">
              Toca cualquier jornada para ver sus detalles, cambiar estado, ver el pendón QR o eliminarla.
            </p>
          </div>
          <button
            type="button"
            className="clean-btn clean-btn--primary"
            onClick={onCreateJornada}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Crear Jornada
          </button>
        </div>

        {/* LISTADO DESPLEGABLE MOBILE-FIRST (SIN SCROLL HORIZONTAL) */}
        <div className="jornadas-accordion-list">
          {jornadas.length === 0 ? (
            <div className="empty-state">No hay jornadas creadas en el sistema.</div>
          ) : (
            jornadas.map((j) => {
              const count = jornadaAttendanceCounts[j.code] || 0;
              const isExpanded = expandedCode === j.code;
              const isEditing = editingCode === j.code;

              return (
                <article
                  key={j.code}
                  className={`jornada-card-accordion ${isExpanded ? "is-expanded" : ""}`}
                >
                  {/* CABECERA RESUMIDA: CÓDIGO + NOMBRE + BADGE ASISTENTES + ESTADO */}
                  <div
                    className="jornada-accordion-header"
                    onClick={() => toggleExpand(j.code)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                  >
                    <div className="jornada-header-left">
                      <strong className="code-tag">{j.code}</strong>
                      <span className="jornada-title-summary">{j.title}</span>
                    </div>

                    <div className="jornada-header-right">
                      {/* BADGE DE PERSONAS REGISTRADAS */}
                      <span
                        className={`jornada-count-badge ${
                          count === 0 ? "is-zero" : "is-positive"
                        }`}
                        title={
                          count === 0
                            ? "0 personas registradas (Sin asistentes, apta para eliminar)"
                            : `${count} personas registradas en esta jornada`
                        }
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                        <strong>{count}</strong> {count === 1 ? "registrado" : "registrados"}
                      </span>

                      {/* BADGE DE ESTADO */}
                      <span className={`status-badge status-${j.status}`}>
                        {j.status}
                      </span>

                      {/* ÍCONO CHEVRON INDICADOR DE DESPLIEGUE */}
                      <div className={`accordion-chevron ${isExpanded ? "rotate-180" : ""}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* CONTENIDO DESPLEGABLE (DETALLES Y ACCIONES) */}
                  {isExpanded && (
                    <div className="jornada-accordion-body">
                      <div className="jornada-details-grid">
                        {/* EDICIÓN DE NOMBRE */}
                        <div className="jornada-detail-item jornada-detail-full">
                          <span className="detail-label">Nombre Oficial de la Jornada:</span>
                          {isEditing ? (
                            <div className="jornada-edit-row">
                              <input
                                type="text"
                                value={editingTitleText}
                                onChange={(e) => setEditingTitleText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveEditing(j.code);
                                  if (e.key === "Escape") cancelEditing();
                                }}
                                className="clean-input"
                                style={{ flex: 1, fontWeight: 700 }}
                                autoFocus
                              />
                              <button
                                type="button"
                                className="btn-table-action"
                                onClick={(e) => saveEditing(j.code, e)}
                                title="Guardar nuevo nombre"
                                style={{ background: "#16a34a", color: "#ffffff", border: "none" }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Guardar
                              </button>
                              <button
                                type="button"
                                className="btn-table-action"
                                onClick={cancelEditing}
                                title="Cancelar"
                                style={{ background: "#64748b", color: "#ffffff", border: "none" }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <line x1="18" y1="6" x2="6" y2="18" />
                                  <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div className="jornada-title-view">
                              <strong>{j.title}</strong>
                              <button
                                type="button"
                                onClick={(e) => startEditing(j, e)}
                                className="clean-link-btn"
                                title="Editar nombre de la jornada"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Editar Nombre
                              </button>
                            </div>
                          )}
                        </div>

                        {/* FECHA */}
                        <div className="jornada-detail-item">
                          <span className="detail-label">Fecha del Evento:</span>
                          <strong>{j.event_date}</strong>
                        </div>

                        {/* LUGAR */}
                        <div className="jornada-detail-item">
                          <span className="detail-label">Lugar de Ejecución:</span>
                          <span>{j.location}</span>
                        </div>

                        {/* SELECTOR DE ESTADO */}
                        <div className="jornada-detail-item">
                          <span className="detail-label">Estado de Actividad:</span>
                          <select
                            value={j.status}
                            onChange={(e) =>
                              onUpdateStatus?.(
                                j.code,
                                e.target.value as "activa" | "programada" | "finalizada"
                              )
                            }
                            className={`clean-select status-${j.status}`}
                            style={{ maxWidth: "200px", fontWeight: 700 }}
                          >
                            <option value="activa">Activa</option>
                            <option value="programada">Programada</option>
                            <option value="finalizada">Finalizada</option>
                          </select>
                        </div>
                      </div>

                      {/* BOTONES DE ACCIÓN: VER QR Y ELIMINAR */}
                      <div className="jornada-actions-bar">
                        <button
                          type="button"
                          className="clean-btn clean-btn--primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectQrJornada(j);
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                          </svg>
                          Ver / Imprimir Pendón QR
                        </button>

                        <button
                          type="button"
                          className={`clean-btn ${count === 0 ? "clean-btn--danger" : "clean-btn--danger-outline"}`}
                          onClick={(e) => handleDelete(j.code, count, e)}
                          title={count === 0 ? "Eliminar jornada sin registros" : "Eliminar jornada"}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                          {count === 0 ? "Eliminar Jornada" : "Eliminar (Con registros)"}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
