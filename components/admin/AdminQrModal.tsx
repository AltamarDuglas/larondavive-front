'use client';

/**
 * Importaciones de React, Next.js y jsPDF.
 * Responsabilidad Única (SRP): Generación, presentación e impresión de pendones PDF en formato horizontal (landscape)
 * adornados con logos oficiales transparentes de la Alcaldía de Montería y La Ronda Vive.
 */
import { useEffect, useState } from 'react';
import NextImage from 'next/image';
import jsPDF from 'jspdf';
import { JornadaRecord } from '../../lib/supabaseClient';

// Importación de activos e imágenes oficiales de la Alcaldía y Ronda Vive
import alcaldiaBanner from '../../app/imgs/alcaldia-banner.png';
import alcaldiaLogo from '../../app/imgs/alcaldia-logo.jpg';
import rondaViveLogo from '../../app/imgs/larondavive-logo.png';
import laRondaViveScaled from '../../app/imgs/la-ronda-vive-scaled.jpg';

export interface AdminQrModalProps {
  jornada: JornadaRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ImageInfo {
  dataUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
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
 * Convierte una imagen a Base64 manteniendo la transparencia de archivos PNG (fillWhite = false).
 * Retorna además la relación de aspecto (width / height) para evitar deformaciones en jsPDF.
 */
function convertImgToBase64(imgSrc: string, fillWhite = false): Promise<ImageInfo> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      return resolve({ dataUrl: '', width: 1, height: 1, aspectRatio: 1 });
    }
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1000;
      canvas.height = img.naturalHeight || 1000;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (fillWhite) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        resolve({
          dataUrl: canvas.toDataURL('image/png'),
          width: canvas.width,
          height: canvas.height,
          aspectRatio: canvas.width / canvas.height,
        });
      } else {
        resolve({ dataUrl: '', width: 1, height: 1, aspectRatio: 1 });
      }
    };
    img.onerror = () => resolve({ dataUrl: '', width: 1, height: 1, aspectRatio: 1 });
    img.src = imgSrc;
  });
}

/**
 * Modal e Impresor de Códigos QR Oficiales para Pendón de la Alcaldía de Montería.
 * Genera un PDF horizontal (landscape) de alto impacto decorado con logos institucionales transparentes.
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
   * Genera y descarga un PDF institucional en formato HORIZONTAL (Landscape A4: 297mm x 210mm)
   * decorado con logos PNG transparentes sin deformación y donde el código QR es gigantesco y 100% limpio.
   */
  const handleDownloadPdf = async () => {
    if (!jornada || !qrUrl) return;
    setIsGeneratingPdf(true);

    try {
      // 1. Cargar las imágenes oficiales en Base64 en paralelo respetando transparencia PNG
      const [qrInfo, bannerInfo, logoInfo, rondaLogoInfo, rondaScaledInfo] = await Promise.all([
        convertImgToBase64(qrUrl, true),
        convertImgToBase64(alcaldiaBanner.src, false),
        convertImgToBase64(alcaldiaLogo.src, false),
        convertImgToBase64(rondaViveLogo.src, false),
        convertImgToBase64(laRondaViveScaled.src, true),
      ]);

      // 2. Inicializar documento PDF en orientación HORIZONTAL (Landscape A4: 297mm x 210mm)
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 297;
      const pageHeight = 210;

      // 3. Fondo blanco impecable
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // 4. Encabezado Superior Institucional (Fondo azul navy #0f172a)
      doc.setFillColor(15, 23, 42); // #0f172a
      doc.rect(0, 0, pageWidth, 32, 'F');

      // Franja de acento verde esmeralda (#059669)
      doc.setFillColor(5, 150, 105);
      doc.rect(0, 32, pageWidth, 3.5, 'F');

      // Renderizar Banner o Logo de Alcaldía a la izquierda (respetando relación de aspecto y transparencia PNG)
      if (bannerInfo.dataUrl) {
        const logoH = 22;
        const logoW = Math.min(logoH * bannerInfo.aspectRatio, 62);
        doc.addImage(bannerInfo.dataUrl, 'PNG', 10, (32 - logoH) / 2, logoW, logoH);
      } else if (logoInfo.dataUrl) {
        doc.addImage(logoInfo.dataUrl, 'JPEG', 10, 4, 24, 24);
      }

      // Renderizar Logo oficial de La Ronda Vive a la derecha (transparente sin deformación)
      if (rondaLogoInfo.dataUrl) {
        const logoH = 22;
        const logoW = Math.min(logoH * rondaLogoInfo.aspectRatio, 58);
        doc.addImage(rondaLogoInfo.dataUrl, 'PNG', pageWidth - 10 - logoW, (32 - logoH) / 2, logoW, logoH);
      }

      // Textos centrales en el encabezado
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text('ALCALDÍA DE MONTERÍA • SECRETARÍA DE CULTURA', pageWidth / 2, 11, { align: 'center' });

      doc.setFontSize(16.5);
      doc.setTextColor(16, 185, 129); // Verde brillante #10b981
      doc.text('RONDA VIVE', pageWidth / 2, 20, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(226, 232, 240);
      doc.text('Registro Oficial de Asistencia Ciudadana', pageWidth / 2, 27, { align: 'center' });

      // 5. DISTRIBUCIÓN EN 2 COLUMNAS (IZQUIERDA: INFORMACIÓN Y FOTO; DERECHA: QR GIGANTE)

      // --- COLUMNA IZQUIERDA (x = 14mm a 140mm) ---
      const leftColX = 14;
      const leftColWidth = 126;

      // Foto de La Ronda Vive en lugar del planchón
      if (rondaScaledInfo.dataUrl) {
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.5);
        doc.roundedRect(leftColX, 40, leftColWidth, 48, 3, 3, 'D');
        doc.addImage(rondaScaledInfo.dataUrl, 'JPEG', leftColX + 0.5, 40.5, leftColWidth - 1, 47, undefined, 'FAST');
      }

      // Título de la Jornada
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text(jornada.title.toUpperCase(), leftColX, 98);

      // Tarjeta de Detalles (Ubicación y Fecha)
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.6);
      doc.roundedRect(leftColX, 103, leftColWidth, 18, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(`Ubicación: ${jornada.location}`, leftColX + 5, 110);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Fecha de Ejecución: ${jornada.event_date}`, leftColX + 5, 116);

      // Badge con el Código Único de la Jornada (SIN SOLAPAR EL QR)
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(leftColX, 126, leftColWidth, 12, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`CÓDIGO ÚNICO DE JORNADA: ${jornada.code}`, leftColX + leftColWidth / 2, 133.5, { align: 'center' });

      // Instrucciones para el ciudadano
      const instY = 146;
      doc.setTextColor(5, 150, 105); // Verde esmeralda
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('ESCANEA CON LA CÁMARA DE TU CELULAR', leftColX + leftColWidth / 2, instY, { align: 'center' });

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text('Apunta la cámara de tu teléfono al código QR de la derecha para registrar tu asistencia de forma inmediata.', leftColX + leftColWidth / 2, instY + 6, { align: 'center', maxWidth: leftColWidth });

      // Caja con la URL Limpia (Garantizada SIN /admin)
      const urlBoxY = 163;
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.5);
      doc.roundedRect(leftColX, urlBoxY, leftColWidth, 11, 2, 2, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(registerUrl, leftColX + leftColWidth / 2, urlBoxY + 7, { align: 'center' });


      // --- COLUMNA DERECHA: EL CÓDIGO QR GIGANTE (x = 148mm a 285mm) ---
      const rightColX = 148;
      const rightColWidth = 135;
      const qrBoxHeight = 151;
      const qrBoxY = 40;

      // Marco contenedor del QR Gigante
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.8);
      doc.roundedRect(rightColX, qrBoxY, rightColWidth, qrBoxHeight, 4, 4, 'FD');

      // Franja superior del marco del QR
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(rightColX, qrBoxY, rightColWidth, 10, 4, 4, 'F');
      doc.rect(rightColX, qrBoxY + 6, rightColWidth, 4, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('CÓDIGO QR OFICIAL DE ASISTENCIA', rightColX + rightColWidth / 2, qrBoxY + 6.5, { align: 'center' });

      // QR GIGANTE (122mm x 122mm) NÍTIDO Y TOTALMENTE LIMPIO (SIN NINGÚN ELEMENTO ENCIMA)
      if (qrInfo.dataUrl) {
        const qrSize = 122;
        const qrX = rightColX + (rightColWidth - qrSize) / 2;
        const qrY = qrBoxY + 13;
        doc.addImage(qrInfo.dataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
      }

      // Pie del marco del QR (UBICADO DEBAJO DEL QR, SIN TAPARLO)
      doc.setFillColor(5, 150, 105);
      doc.roundedRect(rightColX + 20, qrBoxY + qrBoxHeight - 12, rightColWidth - 40, 8, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text(`VÁLIDO PARA LA JORNADA: ${jornada.code}`, rightColX + rightColWidth / 2, qrBoxY + qrBoxHeight - 6.5, { align: 'center' });

      // 6. Pie de página institucional limpio
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text('Alcaldía de Montería — Secretaría de Cultura • Plataforma Digital Ronda Vive', pageWidth / 2, pageHeight - 6, { align: 'center' });

      // 7. Descargar archivo PDF
      doc.save(`Pendon_QR_Horizontal_RondaVive_${jornada.code}.pdf`);
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
        className="admin-modal-card qr-poster-modal qr-poster-modal--landscape"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        style={{ maxWidth: '980px', width: '95%' }}
      >
        <div className="admin-modal-header no-print">
          <div>
            <span className="eyebrow">Alcaldía de Montería</span>
            <h3>Pendón Oficial de Registro QR (Vista Horizontal)</h3>
          </div>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* CONTENIDO DEL PENDÓN DE IMPRESIÓN OFICIAL / VISTA PREVIA HORIZONTAL */}
        <div className="qr-poster-frame qr-poster-frame--landscape">
          <div className="qr-poster-head-brand">
            <div className="poster-logo-col">
              <NextImage
                src={alcaldiaBanner}
                alt="Alcaldía de Montería"
                width={160}
                height={60}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="poster-title-col">
              <span className="poster-institution">ALCALDÍA DE MONTERÍA</span>
              <span className="poster-department">SECRETARÍA DE CULTURA</span>
              <h2 className="poster-title">RONDA VIVE</h2>
              <p className="poster-subtitle">Registro Oficial de Asistencia Ciudadana</p>
            </div>
            <div className="poster-logo-col" style={{ textAlign: 'right' }}>
              <NextImage
                src={rondaViveLogo}
                alt="La Ronda Vive"
                width={140}
                height={60}
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>

          <div className="qr-poster-landscape-body">
            {/* Columna Izquierda: Información de la jornada e instrucciones */}
            <div className="poster-info-col">
              <div className="poster-photo-wrapper">
                <NextImage
                  src={laRondaViveScaled}
                  alt="La Ronda Vive"
                  width={340}
                  height={140}
                  style={{ objectFit: 'cover', borderRadius: '12px', width: '100%', height: '140px' }}
                />
              </div>

              <h3 className="poster-jornada-title">{jornada.title}</h3>
              <p className="poster-location">Ubicación: {jornada.location} | Fecha: {jornada.event_date}</p>

              <div className="poster-code-badge">
                CÓDIGO ÚNICO DE JORNADA: {jornada.code}
              </div>

              <p className="poster-instructions">
                <strong>Escanea con la cámara de tu celular</strong> para confirmar tu presencia en la jornada de hoy.
              </p>

              <div className="poster-link-box">
                <span>{registerUrl}</span>
              </div>
            </div>

            {/* Columna Derecha: QR Gigante Limpio sin solapamientos */}
            <div className="poster-qr-col">
              <div className="qr-image-wrapper qr-image-wrapper--clean">
                <span className="qr-top-tag">CÓDIGO QR OFICIAL</span>
                {qrUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrUrl}
                    alt={`Código QR para la jornada ${jornada.code}`}
                    className="qr-code-img qr-code-img--large"
                  />
                ) : (
                  <div className="qr-placeholder">Generando QR...</div>
                )}
                <span className="qr-badge-code">VÁLIDO PARA: {jornada.code}</span>
              </div>
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
            {isGeneratingPdf ? 'Generando PDF Horizontal...' : 'Descargar PDF Horizontal (Pendón QR)'}
          </button>
        </div>
      </div>
    </div>
  );
}


