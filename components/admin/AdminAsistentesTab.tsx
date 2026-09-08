"use client";

import { AsistenteRecord } from "./adminTypes";

interface AdminAsistentesTabProps {
  filteredAsistentes: AsistenteRecord[];
  isLoading: boolean;
  onComunaFilterChange: (value: string) => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
  onSearchChange: (value: string) => void;
  searchQuery: string;
  selectedComunaFilter: string;
}

const comunaOptions = [
  "Comuna 1",
  "Comuna 2",
  "Comuna 3",
  "Comuna 4",
  "Comuna 5",
  "Comuna 6",
  "Comuna 7",
  "Comuna 8",
  "Comuna 9",
];

export default function AdminAsistentesTab({
  filteredAsistentes,
  isLoading,
  onComunaFilterChange,
  onExportCSV,
  onExportExcel,
  onSearchChange,
  searchQuery,
  selectedComunaFilter,
}: AdminAsistentesTabProps) {
  return (
    <section className="admin-tab-content">
      <div className="admin-card">
        <div className="card-header-flex">
          <div>
            <h3>Directorio General de Ciudadanos (Supabase)</h3>
            <p className="card-desc">
              Filtra y exporta los asistentes caracterizados en las jornadas de
              Ronda Vive.
            </p>
          </div>
          <div className="admin-header-actions">
            <button
              type="button"
              className="clean-btn clean-btn--excel"
              onClick={onExportExcel}
            >
              Descargar Excel (.xlsx)
            </button>

            <button
              type="button"
              className="clean-btn clean-btn--secondary"
              onClick={onExportCSV}
            >
              Descargar CSV
            </button>
          </div>
        </div>

        <div className="table-filter-bar">
          <div className="filter-item filter-search">
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono, correo o barrio..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="clean-input"
            />
          </div>

          <div className="filter-item">
            <select
              value={selectedComunaFilter}
              onChange={(e) => onComunaFilterChange(e.target.value)}
              className="clean-input"
            >
              <option value="TODAS">Todas las Comunas</option>
              {comunaOptions.map((comuna) => (
                <option value={comuna} key={comuna}>
                  {comuna}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          {isLoading ? (
            <div className="loading-state">
              Cargando directorio de Supabase...
            </div>
          ) : filteredAsistentes.length === 0 ? (
            <div className="empty-state">
              No hay asistentes registrados en Supabase que coincidan con la
              búsqueda.
            </div>
          ) : (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Ciudadano / Nombre</th>
                  <th>Contacto</th>
                  <th>Ubicación</th>
                  <th>Edad / Género</th>
                  <th>Población</th>
                  <th>Términos</th>
                </tr>
              </thead>
              <tbody>
                {filteredAsistentes.map((a, i) => (
                  <tr key={a.id || i}>
                    <td>
                      <div className="cell-user">
                        <strong>{a.full_name}</strong>
                        <small>
                          {a.born_in_monteria
                            ? "Nacido en Montería"
                            : a.birth_location}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="cell-contact">
                        <span>{a.phone}</span>
                        <span>{a.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cell-location">
                        <strong>{a.barrio}</strong>
                        <small>
                          {a.comuna} ({a.zone})
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="cell-demo">
                        <span>{a.age_range}</span>
                        <small>{a.gender_identity}</small>
                      </div>
                    </td>
                    <td>
                      <div className="cell-population">
                        <span>{a.population_group}</span>
                        <small>{a.social_group}</small>
                      </div>
                    </td>
                    <td>
                      <span className="legal-badge">Habeas Data</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
