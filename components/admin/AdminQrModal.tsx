'use client';

/**
 * Importaciones de React y jsPDF.
 * Responsabilidad Única (SRP): Generación, presentación e impresión de pendones PDF con QR oficial para la Alcaldía de Montería.
 */
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { JornadaRecord } from '../../lib/supabaseClient';

export interface AdminQrModalProps {
  jornada: JornadaRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Función auxiliar para obtener la URL limpia de registro a partir del código de la jornada.
 * Garantiza de forma estricta que NUNCA incluya "/admin" ni rutas administrativas.
 */
function getCleanRegisterUrl(code: string): string {
  if (typeof window === 'undefined') {
    return `/register?code=${code}`;
  }
  // Se obtiene únicamente el origen público (ej. https://larondavive-front.vercel.app o http://localhost:3000)
  const origin = window.location.origin.replace(/\/admin.*$/, '').replace(/\/$/, '');
  return `${origin}/register?code=${code}`;
}

/**
 * Convierte una imagen (URL) a Base64 utilizando HTML Canvas para renderizado sin errores en jsPDF.
 */
function convertImgToBase64(imgSrc: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1000;
      canvas.height = img.naturalHeight || 1000;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('No se pudo obtener el contexto del canvas'));
      }
    };
    img.onerror = (err) => reject(err);
    img.src = imgSrc;
  });
}

/**
 * Modal e Impresor de Códigos QR Oficiales para Pendón de la Alcaldía de Montería.
 * Genera PDF descargable de gran formato (A4) donde el código QR es el protagonista de gran tamaño.
 */
export default function AdminQrModal({ jornada, isOpen, onClose }: AdminQrModalProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  useEffect(() => {
    if (jornada) {
      const targetUrl = getCleanRegisterUrl(jornada.code);
      // Alta resolución 1000x1000 para impresión ultra nítida en formato poster
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(targetUrl)}&color=0f172a&bgcolor=ffffff`;
      setQrUrl(qrApiUrl);
    }
  }, [jornada]);

  if (!isOpen || !jornada) return null;

  const registerUrl = getCleanRegisterUrl(jornada.code);

  /**
   * Genera y descarga un PDF institucional en formato A4 con un diseño sobrio y profesional,
   * donde el Código QR es el elemento predominante de gran tamaño.
   */
  const handleDownloadPdf = async () => {
    if (!jornada || !qrUrl) return;
    setIsGeneratingPdf(true);

    try {
      // 1. Obtener imagen del QR en Base64
      const qrBase64 = await convertImgToBase64(qrUrl);

      // 2. Inicializar documento PDF en formato A4 (210mm x 297mm)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;

      // 3. Encabezado institucional de la Alcaldía de Montería (Fondo azul oscuro #0f172a)
      doc.setFillColor(15, 23, 42); // #0f172a
      doc.rect(0, 0, pageWidth, 36, 'F');

      // Franja verde esmeralda institucional (#059669)
      doc.setFillColor(5, 150, 105);
      doc.rect(0, 36, pageWidth, 3.5, 'F');

      // Textos institucionales del encabezado
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('ALCALDÍA DE MONTERÍA • SECRETARÍA DE CULTURA', pageWidth / 2, 12, { align: 'center' });

      doc.setFontSize(22);
      doc.text('RONDA VIVE', pageWidth / 2, 23, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(226, 232, 240);
      doc.text('Registro Oficial de Asistencia Ciudadana', pageWidth / 2, 31, { align: 'center' });

      // 4. Datos de la Jornada
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text(jornada.title.toUpperCase(), pageWidth / 2, 48, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Ubicación: ${jornada.location}  |  Fecha: ${jornada.event_date}`, pageWidth / 2, 55, { align: 'center' });

      // 5. Marco contenedor del CÓDIGO QR GIGANTE
      const boxWidth = 160;
      const boxHeight = 160;
      const boxX = (pageWidth - boxWidth) / 2; // 25mm
      const boxY = 62;

      // Fondo contenedor gris claro con borde sobrio
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.8);
      doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 4, 4, 'FD');

      // QR Gigante (142mm x 142mm) centrado dentro del marco
      const qrSize = 142;
      const qrX = (pageWidth - qrSize) / 2;
      const qrY = boxY + 7;

      doc.addImage(qrBase64, 'PNG', qrX, qrY, qrSize, qrSize);

      // Badge elegante con el código único de la jornada
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(pageWidth / 2 - 38, boxY + boxHeight - 14, 76, 10, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`CÓDIGO ÚNICO: ${jornada.code}`, pageWidth / 2, boxY + boxHeight - 7.5, { align: 'center' });

      // 6. Instrucción al ciudadano
      const instructionsY = 232;
      doc.setTextColor(5, 150, 105); // Verde esmeralda
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14.5);
      doc.text('ESCANEA CON LA CÁMARA DE TU CELULAR', pageWidth / 2, instructionsY, { align: 'center' });

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Apunta la cámara de tu teléfono al código QR para confirmar tu asistencia.', pageWidth / 2, instructionsY + 7, { align: 'center' });

      // 7. Enlace directo (Limpio y garantizado SIN /admin)
      const urlBoxY = instructionsY + 13;
      const urlBoxWidth = 160;
      const urlBoxX = (pageWidth - urlBoxWidth) / 2;

      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.5);
      doc.roundedRect(urlBoxX, urlBoxY, urlBoxWidth, 12, 2, 2, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text(registerUrl, pageWidth / 2, urlBoxY + 7.5, { align: 'center' });

      // 8. Pie de página institucional
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(15, pageHeight - 12, pageWidth - 15, pageHeight - 12);

      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Alcaldía de Montería — Secretaría de Cultura • Documento de Impresión Oficial Pendón QR', pageWidth / 2, pageHeight - 6, { align: 'center' });

      // 9. Descargar archivo PDF
      doc.save(`Pendon_QR_RondaVive_${jornada.code}.pdf`);
    } catch (error) {
      console.error('Error al generar el PDF del QR:', error);
      alert('Ocurrió un error al generar el PDF. Por favor reintenta.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

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

        {/* CONTENIDO DEL PENDÓN DE IMPRESIÓN OFICIAL / VISTA PREVIA */}
        <div className="qr-poster-frame">
          <div className="qr-poster-head">
            <span className="poster-institution">ALCALDÍA DE MONTERÍA</span>
            <span className="poster-department">SECRETARÍA DE CULTURA</span>
            <h2 className="poster-title">RONDA VIVE</h2>
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

        <div className="admin-modal-actions no-print" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button type="button" className="clean-btn clean-btn--secondary" onClick={onClose}>
            Cerrar
          </button>
          <button type="button" className="clean-btn clean-btn--secondary" onClick={handlePrint}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
              <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <path d="M6 14h12v8H6z" />
            </svg>
            Imprimir Pantalla
          </button>
          <button
            type="button"
            className="clean-btn clean-btn--primary"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {isGeneratingPdf ? 'Generando PDF...' : 'Descargar PDF Oficial (Pendón QR)'}
          </button>
        </div>
      </div>
    </div>
  );
}

