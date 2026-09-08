'use client';

/**
 * Importaciones de React.
 */
import { useState } from 'react';
import { createJornada, JornadaRecord } from '../../lib/supabaseClient';

/**
 * Propiedades del componente AdminJornadaModal.
 */
export interface AdminJornadaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJornadaCreated: (newJornada: JornadaRecord) => void;
}

/**
 * Modal para la creación de nuevas Jornadas Institucionales (Alcaldía de Montería).
 * Estética institucional sobria (Sin emojis, usando íconos vectoriales SVG).
 */
export default function AdminJornadaModal({
  isOpen,
  onClose,
  onJornadaCreated,
}: AdminJornadaModalProps) {
  const [code, setCode] = useState<string>(
    'RV-' +
      new Date().getDate().toString().padStart(2, '0') +
      (new Date().getMonth() + 1).toString().padStart(2, '0') +
      new Date().getFullYear().toString().slice(-2)
  );
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
          </div>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="clean-form">
          <div className="form-group">
            <label className="form-label-text">Código Único del Pendón QR *</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ej: RV-150926"
              className="clean-input clean-input--code"
              required
            />
            <small className="help-text">
              Este código se incluirá en el enlace QR impreso (`?code=${code}`)
            </small>
          </div>

          <div className="form-group">
            <label className="form-label-text">Título de la Jornada *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Jornada Ronda Vive Calle 27"
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
                className="clean-input"
              >
                <option value="activa">Activa (Acepta registros)</option>
                <option value="programada">Programada</option>
                <option value="finalizada">Finalizada</option>
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
              {isSubmitting ? 'Guardando...' : 'Crear Jornada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
