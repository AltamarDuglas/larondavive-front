"use client";

import { JornadaRecord } from "./adminTypes";

interface AdminJornadasTabProps {
  jornadas: JornadaRecord[];
  onCreateJornada: () => void;
  onSelectQrJornada: (jornada: JornadaRecord) => void;
  onUpdateStatus?: (
    code: string,
    newStatus: "activa" | "programada" | "finalizada"
  ) => void;
}

export default function AdminJornadasTab({
  jornadas,
  onCreateJornada,
  onSelectQrJornada,
  onUpdateStatus,
}: AdminJornadasTabProps) {
  return (
    <section className="admin-tab-content">
      <div className="admin-card">
        <div className="card-header-flex">
          <div>
            <h3>Jornadas de Ronda Vive Registradas</h3>
            <p className="card-desc">
              Códigos QR oficiales, fechas de ejecución y gestión interactiva de estado.
            </p>
          </div>
          <button
            type="button"
            className="clean-btn clean-btn--primary"
            onClick={onCreateJornada}
          >
            Crear Jornada
          </button>
        </div>

        <div className="table-wrapper">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Código QR</th>
                <th>Título de la Jornada</th>
                <th>Fecha</th>
                <th>Estado de Actividad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {jornadas.map((j) => (
                <tr key={j.code}>
                  <td>
                    <strong className="code-tag">{j.code}</strong>
                  </td>
                  <td>{j.title}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
