'use client';

/**
 * Importaciones de React.
 */
import { useEffect, useState } from 'react';
import { JornadaRecord } from '../../lib/supabaseClient';

export interface AdminQrModalProps {
  jornada: JornadaRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal e Impresor de Códigos QR Oficiales para Pendón de la Alcaldía de Montería.
 * Estética sobria e institucional sin emojis.
 */
export default function AdminQrModal({ jornada, isOpen, onClose }: AdminQrModalProps) {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (jornada) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ronda-vive.vercel.app';
      const targetUrl = `${baseUrl}/register?code=${jornada.code}`;
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetUrl)}&color=0f172a&bgcolor=ffffff`;
      setQrUrl(qrApiUrl);
    }
  }, [jornada]);

  if (!isOpen || !jornada) return null;

  const registerUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/register?code=${jornada.code}`
    : `/register?code=${jornada.code}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-card qr-poster-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="admin-modal-header no-print">
          <div>
            <span className="eyebrow">Alcaldía de Montería</span>
            <h3>Pendón Oficial de Registro QR</h3>
          </div>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* CONTENIDO DEL PENDÓN DE IMPRESIÓN OFICIAL */}
        <div className="qr-poster-frame">
          <div className="qr-poster-head">
            <span className="poster-institution">ALCALDÍA DE MONTERÍA</span>
            <span className="poster-department">SECRETARÍA DE CULTURA</span>
            <h2 className="poster-title">RONDA VIVE PASS</h2>
            <p className="poster-subtitle">Registro Oficial de Asistencia Ciudadana</p>
          </div>

          <div className="qr-image-wrapper">
            {qrUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrUrl}
                alt={`Código QR para la jornada ${jornada.code}`}
                className="qr-code-img"
              />
            ) : (
              <div className="qr-placeholder">Generando QR...</div>
            )}
            <span className="qr-badge-code">{jornada.code}</span>
          </div>

          <div className="qr-poster-body">
            <h3>{jornada.title}</h3>
            <p className="poster-location">Ubicación: {jornada.location}</p>
            <p className="poster-instructions">
              <strong>Escanea con la cámara de tu celular</strong> para confirmar tu presencia en la jornada de hoy.
            </p>
            <div className="poster-link-box">
              <span>{registerUrl}</span>
            </div>
          </div>
        </div>

        <div className="admin-modal-actions no-print">
          <button type="button" className="clean-btn clean-btn--secondary" onClick={onClose}>
            Cerrar
          </button>
          <button type="button" className="clean-btn clean-btn--primary" onClick={handlePrint}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
              <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <path d="M6 14h12v8H6z" />
            </svg>
            Imprimir Pendón QR
          </button>
        </div>
      </div>
    </div>
  );
}
