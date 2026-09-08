"use client";

import { JornadaRecord } from "./adminTypes";

interface AdminJornadasTabProps {
  jornadas: JornadaRecord[];
  onCreateJornada: () => void;
  onSelectQrJornada: (jornada: JornadaRecord) => void;
}

function getStatusLabel(status: JornadaRecord["status"]) {
  if (status === "activa") return "Activa";
  if (status === "programada") return "Programada";
  return "Finalizada";
}

export default function AdminJornadasTab({
  jornadas,
  onCreateJornada,
  onSelectQrJornada,
}: AdminJornadasTabProps) {
  return (
    <section className="admin-tab-content">
      <div className="admin-card">
        <div className="card-header-flex">
          <div>
            <h3>Jornadas de Ronda Vive Registradas</h3>
            <p className="card-desc">
              Códigos QR oficiales, fechas de ejecución y estado de actividad.
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
                <th>Estado</th>
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
                    <span className={`status-badge status-${j.status}`}>
                      {getStatusLabel(j.status)}
                    </span>
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
