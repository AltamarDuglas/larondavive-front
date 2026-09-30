'use client';

/**
 * Importaciones de React.
 * - useState, useMemo: Manejo reactivo de filtros, búsqueda y paginación.
 * - DudaInquietudRecord: Tipado estandarizado del registro de dudas.
 * 
 * Principio SOLID - SRP:
 * Este componente es responsable únicamente de presentar, buscar, filtrar y actualizar el estado
 * de las dudas e inquietudes radicadas por los ciudadanos a través del código QR.
 */
import { useMemo, useState } from 'react';
import { DudaInquietudRecord } from '../../lib/supabaseClient';

export interface AdminDudasTabProps {
  dudas: DudaInquietudRecord[];
  onOpenQrModal: () => void;
  onUpdateStatus: (
    radicado: string,
    nuevoEstado: 'pendiente' | 'en_revision' | 'atendida',
    respuesta?: string
  ) => Promise<void>;
  onExportCSV: () => void;
}

export default function AdminDudasTab({
  dudas,
  onOpenQrModal,
  onUpdateStatus,
  onExportCSV,
}: AdminDudasTabProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendiente' | 'en_revision' | 'atendida'>('todos');
  const [updatingRadicado, setUpdatingRadicado] = useState<string | null>(null);

  /**
   * Filtrado en memoria de las dudas ciudadanas.
   */
  const filteredDudas = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return dudas.filter((item) => {
      // Filtro por estado
      if (statusFilter !== 'todos' && item.estado !== statusFilter) {
        return false;
      }
      // Filtro por texto
      if (!q) return true;
      const matchRadicado = item.radicado?.toLowerCase().includes(q);
      const matchNombre = item.nombre?.toLowerCase().includes(q);
      const matchCorreo = item.correo?.toLowerCase().includes(q);
      const matchTelefono = item.telefono?.toLowerCase().includes(q);
      const matchTexto = item.duda_inquietud?.toLowerCase().includes(q);
      return matchRadicado || matchNombre || matchCorreo || matchTelefono || matchTexto;
    });
  }, [dudas, searchQuery, statusFilter]);

  /**
   * Conteo por cada estado para los badges de los filtros
   */
  const counts = useMemo(() => {
    return {
      total: dudas.length,
      pendientes: dudas.filter((d) => (d.estado || 'pendiente') === 'pendiente').length,
      enRevision: dudas.filter((d) => d.estado === 'en_revision').length,
      atendidas: dudas.filter((d) => d.estado === 'atendida').length,
    };
  }, [dudas]);

  const handleStatusChange = async (
    radicado: string,
    newStatus: 'pendiente' | 'en_revision' | 'atendida'
  ) => {
    setUpdatingRadicado(radicado);
    try {
      await onUpdateStatus(radicado, newStatus);
    } finally {
      setUpdatingRadicado(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Barra de herramientas superior */}
      <div className="admin-dudas-toolbar">
        {/* Buscador de texto */}
        <div className="admin-dudas-search-box">
          <svg
            className="admin-dudas-search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="admin-dudas-search-input"
            placeholder="Buscar por nombre, correo, teléfono o radicado..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Acciones principales: Generar Pendón QR y Exportar a CSV */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="clean-btn clean-btn--primary"
            onClick={onOpenQrModal}
            style={{ width: 'auto', padding: '8px 16px', fontSize: '0.86rem' }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              style={{ marginRight: '6px' }}
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Generar Pendón QR
          </button>

          <button
            type="button"
            className="clean-btn clean-btn--secondary"
            onClick={onExportCSV}
            style={{ width: 'auto', padding: '8px 16px', fontSize: '0.86rem' }}
            title="Descargar listado en formato CSV"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              style={{ marginRight: '6px' }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Filtros por estado */}
      <div className="admin-dudas-filters">
        <button
          type="button"
          className={`admin-dudas-filter-btn ${statusFilter === 'todos' ? 'is-active' : ''}`}
          onClick={() => setStatusFilter('todos')}
        >
          Todas ({counts.total})
        </button>
        <button
          type="button"
          className={`admin-dudas-filter-btn ${statusFilter === 'pendiente' ? 'is-active' : ''}`}
          onClick={() => setStatusFilter('pendiente')}
        >
          Pendientes ({counts.pendientes})
        </button>
        <button
          type="button"
          className={`admin-dudas-filter-btn ${statusFilter === 'en_revision' ? 'is-active' : ''}`}
          onClick={() => setStatusFilter('en_revision')}
        >
          En Revisión ({counts.enRevision})
        </button>
        <button
          type="button"
          className={`admin-dudas-filter-btn ${statusFilter === 'atendida' ? 'is-active' : ''}`}
          onClick={() => setStatusFilter('atendida')}
        >
          Atendidas ({counts.atendidas})
        </button>
      </div>

      {/* Lista de Dudas e Inquietudes */}
      {filteredDudas.length === 0 ? (
        <div
          style={{
            background: 'var(--surface-white)',
            border: '1px solid var(--border-light)',
            borderRadius: '20px',
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--text-subtle)',
          }}
        >
          <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
            No se encontraron consultas ciudadanas con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredDudas.map((item) => {
            const currentStatus = item.estado || 'pendiente';
            const isUpdating = updatingRadicado === item.radicado;

            return (
              <article key={item.radicado} className="admin-dudas-card">
                {/* Cabecera del ítem */}
                <div className="admin-dudas-header">
                  <div className="admin-dudas-citizen-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span className="admin-dudas-citizen-name">{item.nombre}</span>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                        }}
                      >
                        {item.radicado}
                      </span>
                      <span className={`status-badge status-${currentStatus}`}>
                        {currentStatus === 'pendiente' && 'Pendiente'}
                        {currentStatus === 'en_revision' && 'En Revisión'}
                        {currentStatus === 'atendida' && 'Atendida'}
                      </span>
                    </div>

                    <div className="admin-dudas-citizen-contacts">
                      <span>
                        <strong>Tel:</strong>{' '}
                        <a href={`tel:${item.telefono}`} style={{ color: '#0284c7', textDecoration: 'none' }}>
                          {item.telefono}
                        </a>
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Correo:</strong>{' '}
                        <a href={`mailto:${item.correo}`} style={{ color: '#0284c7', textDecoration: 'none' }}>
                          {item.correo}
                        </a>
                      </span>
                      <span>•</span>
                      <span>
                        <strong>Tipo:</strong> {item.tipo_consulta || 'Duda / Inquietud'}
                      </span>
                    </div>
                  </div>

                  {/* Fecha de registro y consentimiento */}
                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    <div>
                      {item.created_at ? new Date(item.created_at).toLocaleString('es-CO') : 'Reciente'}
                    </div>
                    <div style={{ color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                      Consentimiento Habeas Data: Sí
                    </div>
                  </div>
                </div>

                {/* Cuerpo del mensaje / Duda o Inquietud */}
                <div className="admin-dudas-body">
                  <p style={{ margin: 0 }}>{item.duda_inquietud}</p>
                  {item.respuesta_institucional && (
                    <div
                      style={{
                        marginTop: '10px',
                        paddingTop: '8px',
                        borderTop: '1px dashed #cbd5e1',
                        fontSize: '0.85rem',
                        color: '#15803d',
                      }}
                    >
                      <strong>Respuesta enviada:</strong> {item.respuesta_institucional}
                    </div>
                  )}
                </div>

                {/* Acciones de gestión y actualización de estado */}
                <div className="admin-dudas-actions-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Cambiar Estado:
                    </span>
                    <select
                      className="dudas-select"
                      style={{ padding: '6px 12px', fontSize: '0.82rem', width: 'auto', minHeight: 'auto' }}
                      value={currentStatus}
                      disabled={isUpdating}
                      onChange={(e) =>
                        handleStatusChange(
                          item.radicado,
                          e.target.value as 'pendiente' | 'en_revision' | 'atendida'
                        )
                      }
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_revision">En Revisión</option>
                      <option value="atendida">Atendida</option>
                    </select>
                    {isUpdating && <span style={{ fontSize: '0.78rem', color: '#059669' }}>Guardando...</span>}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={`https://wa.me/57${item.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hola ${item.nombre}, te contactamos desde la Alcaldía de Montería - La Ronda Vive respecto a tu consulta con radicado ${item.radicado}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="clean-btn clean-btn--outline"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:${item.correo}?subject=${encodeURIComponent(
                        `Respuesta a tu consulta en La Ronda Vive - Radicado ${item.radicado}`
                      )}&body=${encodeURIComponent(`Apreciado(a) ${item.nombre},\n\n`)}`}
                      className="clean-btn clean-btn--secondary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      Responder por Correo
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
