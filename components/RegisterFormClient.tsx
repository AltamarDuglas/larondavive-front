'use client';

/**
 * Importaciones de React y Next.js.
 * - useState, useEffect: Manejo del flujo de 2 pasos (1. Código -> 2. Formulario -> Confirmación).
 * - useRouter, useSearchParams: Lectura del código de la URL y redirección rápida.
 * - Link: Navegación del cliente sin recargar la página.
 */
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * Interfaz de propiedades para RegisterFormClient.
 */
export interface RegisterFormClientProps {
  /** Código del evento o QR proveniente de los parámetros del servidor */
  initialCode?: string;
  /** Identificador de la jornada */
  initialEvent?: string;
}

/**
 * Componente RegisterFormClient (Flujo en 2 Pasos)
 * Responsabilidad Única (SRP): Controlar la secuencia interactiva de registro:
 * Paso 1: Pedir y validar el código del evento / QR.
 * Paso 2: Desplegar el formulario de datos del ciudadano.
 * Paso 3: Mostrar la confirmación oficial e instantánea de asistencia.
 */
export default function RegisterFormClient({
  initialCode = 'RV-150926',
  initialEvent = 'RV-150926'
}: RegisterFormClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Código obtenido del parámetro URL '?code=...' si el usuario escaneó el QR
  const paramCode = searchParams.get('code') || initialCode;

  // Paso activo del flujo: 1 = Código, 2 = Formulario de Datos, 3 = Confirmación Exitosa
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Campos de formulario
  const [code, setCode] = useState<string>(paramCode);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  /**
   * Carga de datos previos guardados en el navegador (reconocimiento de ciudadana/o recurrente)
   */
  useEffect(() => {
    try {
      const savedName = localStorage.getItem('rv_user_fullname');
      const savedPhone = localStorage.getItem('rv_user_phone');
      const savedEmail = localStorage.getItem('rv_user_email');

      if (savedName) setFullName(savedName);
      if (savedPhone) setPhone(savedPhone);
      if (savedEmail) setEmail(savedEmail);
    } catch {
      // Ignorar errores de acceso a localStorage
    }
  }, []);

  /**
   * Manejador del Paso 1: Validar e ingresar el código
   */
  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim();

    if (!cleanCode) {
      setErrorMessage('Por favor ingresa un código de asistencia válido.');
      return;
    }

    setErrorMessage('');
    setStep(2);
  };

  /**
   * Manejador del Paso 2: Enviar formulario de datos del ciudadano
   */
  const handleSubmitData = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setErrorMessage('Por favor completa todos los campos del formulario.');
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage('Debes aceptar el tratamiento de datos personales (Habeas Data).');
      return;
    }

    // Almacenar datos en localStorage para futuras visitas
    try {
      localStorage.setItem('rv_user_fullname', fullName.trim());
      localStorage.setItem('rv_user_phone', phone.trim());
      localStorage.setItem('rv_user_email', email.trim());
      localStorage.setItem('rv_last_code', code.trim());
      localStorage.setItem('rv_last_date', new Date().toLocaleDateString('es-CO'));
    } catch {
      // Ignorar fallback
    }

    setErrorMessage('');
    setStep(3);
  };

  return (
    <div className="register-client-container">
      {/* Indicadores sobrios de progreso (Paso 1 de 2) */}
      {step < 3 && (
        <div className="step-progress-bar">
          <div className={`step-pill ${step === 1 ? 'is-active' : 'is-completed'}`}>
            <span>1</span> Código de Asistencia
          </div>
          <div className="step-line" />
          <div className={`step-pill ${step === 2 ? 'is-active' : ''}`}>
            <span>2</span> Datos del Ciudadano
          </div>
        </div>
      )}

      {/* Alerta de error si aplica */}
      {errorMessage && (
        <div className="form-error-alert" role="alert">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ==========================================================================
         PASO 1: PEDIR O CONFIRMAR EL CÓDIGO DE ASISTENCIA / QR
         ========================================================================== */}
      {step === 1 && (
        <section className="form-step-card">
          <div className="form-step-head">
            <span className="eyebrow">Paso 1: Validación</span>
            <h2>Ingresa el Código de Asistencia</h2>
            <p className="lede">
              Introduce el código de la jornada o el código impreso en el pendón QR oficial en la
              Calle 27 con Avenida Primera.
            </p>
          </div>

          <form onSubmit={handleValidateCode} className="clean-form">
            <label className="form-group">
              <span className="form-label-text">Código del Evento / QR</span>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ej: RV-150926"
                className="clean-input clean-input--code"
                required
                autoFocus
              />
            </label>

            <div className="form-actions">
              <button type="submit" className="clean-btn clean-btn--primary">
                Continuar al Formulario
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ==========================================================================
         PASO 2: FORMULARIO DE DATOS PERSONALES DEL CIUDADANO
         ========================================================================== */}
      {step === 2 && (
        <section className="form-step-card">
          <div className="code-status-badge">
            <span>Código de Jornada: <strong>{code}</strong></span>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-change-code"
              title="Cambiar código"
            >
              Cambiar Código
            </button>
          </div>

          <div className="form-step-head">
            <span className="eyebrow">Paso 2: Registro Ciudadano</span>
            <h2>Ingresa tus Datos Básicos</h2>
            <p className="lede">
              Confirma tu información para registrar tu asistencia oficial en la jornada de hoy.
            </p>
          </div>

          <form onSubmit={handleSubmitData} className="clean-form">
            <label className="form-group">
              <span className="form-label-text">Nombre Completo</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej: María Pérez"
                className="clean-input"
                required
              />
            </label>

            <div className="form-row-2col">
              <label className="form-group">
                <span className="form-label-text">Teléfono Celular</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej: 3001234567"
                  className="clean-input"
                  required
                />
              </label>

              <label className="form-group">
                <span className="form-label-text">Correo Electrónico</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="clean-input"
                  required
                />
              </label>
            </div>

            <div className="consent-box">
              <label className="check-label">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                />
                <span>
                  Acepto el tratamiento de datos personales (Habeas Data) de la Alcaldía de Montería.
                </span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="clean-btn clean-btn--primary">
                Confirmar mi Asistencia
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ==========================================================================
         PASO 3: CONFIRMACIÓN EXITOSA Y TICKET DIGITAL DE ASISTENCIA
         ========================================================================== */}
      {step === 3 && (
        <section className="success-ticket-card">
          <div className="ticket-header">
            <span className="ticket-badge-success">Asistencia Confirmada</span>
            <h2>¡Registro Completado con Éxito!</h2>
            <p>Alcaldía de Montería • Calle 27 con Avenida Primera</p>
          </div>

          <div className="ticket-details-grid">
            <div className="ticket-detail-item">
              <span className="item-label">Ciudadano(a)</span>
              <strong className="item-value">{fullName}</strong>
            </div>

            <div className="ticket-detail-item">
              <span className="item-label">Jornada Registrada</span>
              <strong className="item-value">{code}</strong>
            </div>

            <div className="ticket-detail-item">
              <span className="item-label">Lugar de Encuentro</span>
              <strong className="item-value">Calle 27 con Av. Primera</strong>
            </div>

            <div className="ticket-detail-item">
              <span className="item-label">Fecha y Hora</span>
              <strong className="item-value">
                {new Date().toLocaleDateString('es-CO')}
              </strong>
            </div>
          </div>

          <div className="ticket-actions">
            <Link href="/pass" className="clean-btn clean-btn--primary">
              Ver Mi Ronda Pass
            </Link>

            <Link href="/" className="clean-btn clean-btn--secondary">
              Volver al Inicio
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
