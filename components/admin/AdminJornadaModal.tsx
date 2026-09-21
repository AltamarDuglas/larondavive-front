'use client';

import { useState } from 'react';
import { createJornada, JornadaRecord } from '../../lib/supabaseClient';

export interface AdminJornadaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJornadaCreated: (newJornada: JornadaRecord) => void;
}

/**
 * Modal para la creación ágil de nuevas Jornadas Institucionales.
 * UX Mobile-First: Campos limpios, sugerencia inteligente de código y botones táctiles.
 * Sin Emojis: Utiliza íconos vectoriales SVG limpios.
 */
export default function AdminJornadaModal({
  isOpen,
  onClose,
  onJornadaCreated,
}: AdminJornadaModalProps) {
  // Código sugerido por defecto según la fecha de hoy
  const generateDefaultCode = () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString().slice(-2);
    return `RV-${day}${month}${year}`;
  };

  const [code, setCode] = useState<string>(generateDefaultCode());
  const [title, setTitle] = useState<string>('Jornada Ronda Vive Calle 27');
  const [location, setLocation] = useState<string>('Calle 27 con Avenida Primera, Montería');
  const [eventDate, setEventDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'activa' | 'programada' | 'finalizada'>('activa');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim() || !eventDate) return;

    setIsSubmitting(true);
    try {
      const created = await createJornada({
        code: code.trim().toUpperCase(),
        title: title.trim(),
        location: location.trim(),
        event_date: eventDate,
        status,
      });

      onJornadaCreated(created);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
      >
        <div className="admin-modal-header">
          <div>
            <span className="eyebrow">Alcaldía de Montería</span>
            <h3 id="modal-title">Crear Nueva Jornada Oficial</h3>
            <p className="card-desc">Configura el código QR y fecha para la nueva jornada.</p>
          </div>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Cerrar modal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="clean-form">
          <div className="form-group">
            <label className="form-label-text">Código Único del Pendón QR *</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ej: RV-150926"
                className="clean-input clean-input--code"
                style={{ flex: 1 }}
                required
              />
              <button
                type="button"
                className="btn-table-action"
                onClick={() => setCode(generateDefaultCode())}
                title="Generar código sugerido con la fecha de hoy"
              >
                Auto
              </button>
            </div>
            <small className="help-text">
              Enlace del pendón: <code>?code={code || 'CODIGO'}</code>
            </small>
          </div>

          <div className="form-group">
            <label className="form-label-text">Título / Nombre de la Jornada *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Jornada Ronda Vive Arte & Río"
              className="clean-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label-text">Lugar de Ejecución</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="clean-input"
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label-text">Fecha del Evento *</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="clean-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label-text">Estado Inicial</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'activa' | 'programada' | 'finalizada')}
                className="clean-select"
                style={{ fontWeight: 700 }}
              >
                <option value="activa">Activa (Acepta registros)</option>
                <option value="programada">Programada</option>
                <option value="finalizada">Finalizada (Bloqueada)</option>
              </select>
            </div>
          </div>

          <div className="admin-modal-actions">
            <button
              type="button"
              className="clean-btn clean-btn--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="clean-btn clean-btn--primary"
              disabled={isSubmitting}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              {isSubmitting ? 'Guardando...' : 'Crear Jornada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
