'use client';

/**
 * Importaciones de React, Next.js y jsPDF.
 * - useState, useEffect: Manejo del estado del modal, generación de PDF y copiado de URL.
 * - Image: Renderizado de la vista previa del código QR y logos.
 * - jsPDF: Librería para compilar el documento PDF oficial para imprenta en formato horizontal.
 * - Activos institucionales: Banner de la Alcaldía, logo de Ronda Vive y fotos de La Ronda.
 * 
 * Principio SOLID - SRP:
 * Este componente tiene la responsabilidad única de generar, previsualizar y descargar el pendón
 * publicitario oficial con el Código QR exclusivo para el Buzón de Dudas e Inquietudes Ciudadanas.
 */
import { useEffect, useState } from 'react';
import NextImage from 'next/image';
import jsPDF from 'jspdf';

// Importación de activos e imágenes oficiales de la Alcaldía y Ronda Vive
import alcaldiaBanner from '../../app/imgs/alcaldia-banner.png';
import alcaldiaLogo from '../../app/imgs/alcaldia-logo.jpg';
import rondaViveLogo from '../../app/imgs/larondavive-logo.png';
import laRondaViveScaled from '../../app/imgs/la-ronda-vive-scaled.jpg';

export interface AdminDudasQrModalProps {
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
 * Obtiene la URL limpia y pública hacia la página de Dudas e Inquietudes (/dudas).
 * Garantiza que nunca contenga prefijos administrativos.
 */
function getCleanDudasUrl(): string {
  if (typeof window === 'undefined') {
    return '/dudas';
  }
  const origin = window.location.origin.replace(/\/admin.*$/, '').replace(/\/$/, '');
  return `${origin}/dudas`;
}

/**
 * Convierte un recurso de imagen a Base64 respetando la transparencia de imágenes PNG.
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
 * Modal y Generador de Pendón QR para Dudas e Inquietudes Ciudadanas.
 */
export default function AdminDudasQrModal({ isOpen, onClose }: AdminDudasQrModalProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  const targetUrl = getCleanDudasUrl();

  useEffect(() => {
    if (isOpen) {
      // Código QR de alta definición (1000x1000) apuntando a la URL pública /dudas
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(targetUrl)}&color=0f172a&bgcolor=ffffff`;
      setQrUrl(qrApiUrl);
    }
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  /**
   * Copia la URL limpia al portapapeles.
   */
  const handleCopyUrl = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(targetUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  /**
   * Genera el documento PDF horizontal listo para imprimir en pendón o cartel físico.
   */
  const handleDownloadPdf = async () => {
    if (!qrUrl) return;
    setIsGeneratingPdf(true);

    try {
      // 1. Carga de imágenes en paralelo con transparencia PNG preservada
      const [qrInfo, bannerInfo, logoInfo, rondaLogoInfo, rondaScaledInfo] = await Promise.all([
        convertImgToBase64(qrUrl, true),
        convertImgToBase64(alcaldiaBanner.src, false),
        convertImgToBase64(alcaldiaLogo.src, false),
        convertImgToBase64(rondaViveLogo.src, false),
        convertImgToBase64(laRondaViveScaled.src, true),
      ]);

      // 2. Inicialización de documento PDF horizontal (Landscape A4: 297mm x 210mm)
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 297;
      const pageHeight = 210;

      // 3. Fondo blanco general
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // 4. Encabezado superior institucional (Azul noche #0f172a)
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 32, 'F');

      // Franja de acento verde esmeralda institucional (#059669)
      doc.setFillColor(5, 150, 105);
      doc.rect(0, 32, pageWidth, 3.5, 'F');

      // Banner de la Alcaldía de Montería a la izquierda
      if (bannerInfo.dataUrl) {
        const logoH = 21;
        const logoW = Math.min(logoH * bannerInfo.aspectRatio, 62);
        const logoX = 10;
        const logoY = (32 - logoH) / 2;

        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(255, 255, 255);
        doc.roundedRect(logoX - 2, logoY - 1, logoW + 4, logoH + 2, 2, 2, 'F');
        doc.addImage(bannerInfo.dataUrl, 'PNG', logoX, logoY, logoW, logoH);
      } else if (logoInfo.dataUrl) {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(8, 3, 26, 26, 2, 2, 'F');
        doc.addImage(logoInfo.dataUrl, 'JPEG', 9, 4, 24, 24);
      }

      // Logo de La Ronda Vive a la derecha
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
      doc.setTextColor(255, 255, 255);
      doc.text('BUZÓN DE DUDAS E INQUIETUDES', pageWidth / 2, 20, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(226, 232, 240);
      doc.text('Atención Ciudadana y Participación Comunitaria • La Ronda Vive', pageWidth / 2, 27, { align: 'center' });

      // 5. DISTRIBUCIÓN EN 2 COLUMNAS (IZQUIERDA: INFORMACIÓN Y FOTO; DERECHA: CÓDIGO QR GIGANTE)
      const leftColX = 14;
      const leftColWidth = 126;
      const photoBoxH = 50;
      const photoY = 39;

      // Fotografía oficial en la columna izquierda
      if (rondaScaledInfo.dataUrl) {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.6);
        doc.roundedRect(leftColX, photoY, leftColWidth, photoBoxH, 3, 3, 'FD');

        const ratio = rondaScaledInfo.aspectRatio || 1.6;
        let drawW = leftColWidth - 1;
        let drawH = drawW / ratio;

        if (drawH > photoBoxH - 1) {
          drawH = photoBoxH - 1;
          drawW = drawH * ratio;
        }

        const drawX = leftColX + (leftColWidth - drawW) / 2;
        const drawY = photoY + (photoBoxH - drawH) / 2;

        doc.addImage(rondaScaledInfo.dataUrl, 'JPEG', drawX, drawY, drawW, drawH, undefined, 'FAST');
      }

      // Título en la columna izquierda
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14.5);
      doc.text('¿TIENES DUDAS, SUGERENCIAS O INQUIETUDES?', leftColX, 97);

      // Tarjeta de requisitos
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.setLineWidth(0.6);
      doc.roundedRect(leftColX, 102, leftColWidth, 25, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(6, 78, 59);
      doc.text('DATOS REQUERIDOS AL CIUDADANO:', leftColX + 5, 109);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(4, 120, 87);
      doc.text('1. Nombre Completo       2. Teléfono / Celular', leftColX + 5, 116);
      doc.text('3. Correo Electrónico   4. Consentimiento de Datos (Habeas Data)', leftColX + 5, 122);

      // Badge institucional
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(leftColX, 132, leftColWidth, 11, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text('CANAL DE ATENCIÓN DIRECTA AL CIUDADANO', leftColX + leftColWidth / 2, 139, { align: 'center' });

      // Instrucciones de escaneo
      const instY = 150;
      doc.setTextColor(5, 150, 105);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12.5);
      doc.text('ESCANEA CON LA CÁMARA DE TU CELULAR', leftColX + leftColWidth / 2, instY, { align: 'center' });

      doc.setTextColor(51, 65, 85);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Apunta la cámara de tu teléfono al código QR de la derecha para abrir el formulario y radicar tu solicitud en segundos.', leftColX + leftColWidth / 2, instY + 5.5, { align: 'center', maxWidth: leftColWidth });

      // Enlace directo en la parte inferior izquierda
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(leftColX, 169, leftColWidth, 9, 2, 2, 'FD');
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(`Enlace web: ${targetUrl}`, leftColX + leftColWidth / 2, 174.5, { align: 'center' });

      // --- COLUMNA DERECHA: CÓDIGO QR GIGANTE ---
      const qrColX = 150;
      const qrColWidth = 133;
      const qrBoxHeight = 158;
      const qrBoxY = 39;

      // Marco contenedor exterior
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.8);
      doc.roundedRect(qrColX, qrBoxY, qrColWidth, qrBoxHeight, 4, 4, 'FD');

      // Tira superior de la tarjeta QR
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(qrColX + 0.8, qrBoxY + 0.8, qrColWidth - 1.6, 12, 3, 3, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text('CÓDIGO QR • BUZÓN DE INQUIETUDES', qrColX + qrColWidth / 2, qrBoxY + 8.5, { align: 'center' });

      // Código QR Nítido y Central
      if (qrInfo.dataUrl) {
        const qrSize = 112;
        const qrX = qrColX + (qrColWidth - qrSize) / 2;
        const qrY = qrBoxY + 16;
        doc.addImage(qrInfo.dataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
      }

      // Franja inferior con llamada a la acción
      doc.setFillColor(5, 150, 105);
      doc.roundedRect(qrColX + 6, qrBoxY + 134, qrColWidth - 12, 14, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('¡TU OPINIÓN CUENTA EN LA RONDA VIVE!', qrColX + qrColWidth / 2, qrBoxY + 143, { align: 'center' });

      // Pie de página institucional del cartel
      doc.setFillColor(15, 23, 42);
      doc.rect(0, pageHeight - 7, pageWidth, 7, 'F');
      doc.setTextColor(203, 213, 225);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('Alcaldía de Montería • Secretaría de Cultura • Calle 27 con Avenida Primera • Canal de Dudas e Inquietudes Ciudadanas', pageWidth / 2, pageHeight - 2.5, { align: 'center' });

      const fileName = `Pendon_QR_Dudas_Inquietudes_LaRondaVive_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('Error al generar el pendón PDF de dudas:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="admin-modal-container admin-qr-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px' }}
      >
        {/* Cabecera del Modal */}
        <div className="admin-modal-header">
          <div>
            <span className="eyebrow" style={{ color: '#059669' }}>
              Código QR Institucional Independiente
            </span>
            <h2 style={{ margin: '4px 0 0' }}>Buzón de Dudas e Inquietudes</h2>
          </div>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ margin: 0, color: 'var(--text-subtle)', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Este código QR es <strong>independiente de las jornadas de asistencia</strong>. Está diseñado para colocarse 
            en carteles, pendones de información, mesas de atención y redes sociales. Al escanearlo, los ciudadanos 
            acceden al formulario donde registran su <strong>Nombre, Teléfono, Correo, Inquietud y Consentimiento</strong>.
          </p>

          {/* Tarjeta de previsualización del Pendón Horizontal */}
          <div
            style={{
              background: '#f8fafc',
              border: '1.5px solid var(--border-light)',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            {/* Vista previa del Código QR */}
            <div style={{ textAlign: 'center', margin: '0 auto' }}>
              {qrUrl ? (
                <div
                  style={{
                    background: '#ffffff',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    display: 'inline-block',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                  }}
                >
                  <img
                    src={qrUrl}
                    alt="Código QR de Dudas e Inquietudes"
                    width={180}
                    height={180}
                    style={{ display: 'block', borderRadius: '4px' }}
                  />
                </div>
              ) : (
                <div style={{ width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Generando QR...
                </div>
              )}
              <span style={{ display: 'block', marginTop: '8px', fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                Escanea para probar (/dudas)
              </span>
            </div>

            {/* Información y características del cartel */}
            <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px' }}>
                <strong style={{ display: 'block', color: '#166534', fontSize: '0.86rem', marginBottom: '4px' }}>
                  Formato Oficial para Impresión
                </strong>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#15803d', lineHeight: 1.45 }}>
                  PDF Horizontal (Landscape A4) de alta resolución preparado con los logos oficiales de la Alcaldía de Montería y La Ronda Vive.
                </p>
              </div>

              <div style={{ fontSize: '0.84rem', color: 'var(--text-main)' }}>
                <strong>URL Pública de Destino:</strong>
                <div
                  style={{
                    marginTop: '4px',
                    padding: '8px 12px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: '#0f172a',
                    wordBreak: 'break-all',
                  }}
                >
                  {targetUrl}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="clean-btn clean-btn--secondary"
                  style={{ width: 'auto', padding: '8px 14px', fontSize: '0.82rem' }}
                >
                  {copiedUrl ? '¡URL Copiada!' : 'Copiar URL Limpia'}
                </button>

                <a
                  href="/dudas"
                  target="_blank"
                  rel="noreferrer"
                  className="clean-btn clean-btn--outline"
                  style={{ width: 'auto', padding: '8px 14px', fontSize: '0.82rem' }}
                >
                  Abrir Formulario en Nueva Pestaña
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Pie del Modal con Botón de Descarga del Pendón */}
        <div className="admin-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" className="clean-btn clean-btn--outline" onClick={onClose}>
            Cerrar
          </button>

          <button
            type="button"
            className="clean-btn clean-btn--primary"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            style={{ width: 'auto', padding: '10px 22px' }}
          >
            {isGeneratingPdf ? (
              'Generando Pendón PDF...'
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ marginRight: '6px' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Descargar Pendón PDF para Impresión
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
