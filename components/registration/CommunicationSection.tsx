'use client';

/**
 * Importaciones de React.
 * Componente enfocado en la Responsabilidad Única (SRP): Sección 5 - Canales Oficiales de Comunicación.
 */
import React from 'react';

/**
 * Propiedades para el componente CommunicationSection
 */
export interface CommunicationSectionProps {
  /** Número de teléfono celular */
  phone: string;
  /** Función para actualizar el número de teléfono */
  onChangePhone: (value: string) => void;

  /** Correo electrónico activo */
  email: string;
  /** Función para actualizar el correo electrónico */
  onChangeEmail: (value: string) => void;
}

/**
 * Componente CommunicationSection
 * Sección 5 del formulario de registro oficial para asistentes de Ronda Vive.
 */
export default function CommunicationSection({
  phone,
  onChangePhone,
  email,
  onChangeEmail,
}: CommunicationSectionProps) {
  return (
    <div className="form-section-block">
      <div className="form-section-header">
        <span className="section-badge-num">5</span>
        <div>
          <h3 className="section-title">Canales de Comunicación Oficiales</h3>
          <p className="section-subtitle">
            Punto de contacto directo para notificaciones, confirmaciones de asistencia e información municipal.
          </p>
        </div>
      </div>

      <div className="communication-notice-box">
        <span className="notice-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8 4a2 2 0 0 1-4 0"></path>
          </svg>
        </span>
        <p className="notice-text">
          Registre un único número telefónico y un solo correo electrónico, ya que serán los canales
          oficiales de comunicación durante todo el proceso. El correo debe mantenerse activo durante la
          ejecución del proyecto.
        </p>
      </div>

      <div className="form-row-2col">
        {/* Número de contacto */}
        <div className="form-group">
          <label className="form-label-text" htmlFor="phone-input">
            Número de contacto celular <span className="req-star">*</span>
          </label>
          <input
            id="phone-input"
            type="tel"
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            placeholder="Ej: 3001234567"
            className="clean-input"
            required
          />
        </div>

        {/* Correo electrónico */}
        <div className="form-group">
          <label className="form-label-text" htmlFor="email-input">
            Correo electrónico <span className="req-star">*</span>
          </label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            className="clean-input"
            required
          />
        </div>
      </div>
    </div>
  );
}
