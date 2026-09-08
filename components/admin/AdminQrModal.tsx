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
 */
export default function AdminQrModal({ jornada, isOpen, onClose }: AdminQrModalProps) {
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    if (jornada) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ronda-vive.vercel.app';
      const targetUrl = `${baseUrl}/register?code=${jornada.code}`;
      // Usar API generadora de QR estandarizada
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
            ✕
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
            <p className="poster-location">📍 {jornada.location}</p>
            <p className="poster-instructions">
              📱 <strong>Escanea con la cámara de tu celular</strong> para confirmar tu presencia en la jornada de hoy.
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
            🖨️ Imprimir Pendón QR
          </button>
        </div>
      </div>
    </div>
  );
}
