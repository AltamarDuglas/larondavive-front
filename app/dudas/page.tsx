'use client';

/**
 * Importaciones de React y Next.js.
 * - useState: Manejo de los estados reactivos del formulario, envío y constancia de radicado.
 * - Link: Navegación accesible y sin recarga.
 * - HeaderNav: Cabecera institucional de la Alcaldía de Montería.
 * - Footer: Pie de página institucional con políticas y créditos.
 * - submitDudaInquietud: Servicio de persistencia en Supabase / localStorage (SOLID - SRP).
 */
import { useState } from 'react';
import Link from 'next/link';
import HeaderNav from '../../components/HeaderNav';
import Footer from '../../components/Footer';
import { submitDudaInquietud } from '../../lib/supabaseClient';

/**
 * Tipos de consultas ciudadanas admitidas en el buzón oficial.
 */
type TipoConsulta = 'Duda / Inquietud' | 'Sugerencia' | 'Felicitación' | 'Petición / Reclamo';

/**
 * Componente DudasPage (Página Pública del Buzón de Dudas e Inquietudes)
 * 
 * Principio SOLID - SRP:
 * Encargado exclusivamente de capturar, validar y enviar las dudas, sugerencias y peticiones
 * ciudadanas de los asistentes que escanean el código QR en los pendones de La Ronda Vive.
 * 
 * Requisitos obligatorios solicitados:
 * 1. Nombre completo
 * 2. Teléfono de contacto
 * 3. Correo electrónico
 * 4. Detalle de la duda o inquietud
 * 5. Consentimiento explícito para el tratamiento de datos personales (Habeas Data)
 */
export default function DudasPage() {
  // Estados para los campos requeridos del formulario
  const [nombre, setNombre] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [tipoConsulta, setTipoConsulta] = useState<TipoConsulta>('Duda / Inquietud');
  const [dudaInquietud, setDudaInquietud] = useState<string>('');
  const [consentimiento, setConsentimiento] = useState<boolean>(false);

  // Estados de control de la interfaz (carga, error y éxito)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successRadicado, setSuccessRadicado] = useState<string | null>(null);
  const [copiedRadicado, setCopiedRadicado] = useState<boolean>(false);

  /**
   * Valida exhaustivamente los datos antes de realizar el envío.
   */
  const validateForm = (): boolean => {
    if (!nombre.trim() || nombre.trim().length < 3) {
      setErrorMessage('Por favor ingresa tu nombre completo (mínimo 3 caracteres).');
      return false;
    }
    if (!telefono.trim() || telefono.trim().length < 7) {
      setErrorMessage('Por favor ingresa un número de teléfono celular válido.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo.trim() || !emailRegex.test(correo.trim())) {
      setErrorMessage('Por favor ingresa un correo electrónico válido para recibir respuesta.');
      return false;
    }
    if (!dudaInquietud.trim() || dudaInquietud.trim().length < 10) {
      setErrorMessage('Por favor describe tu duda o inquietud con mayor detalle (mínimo 10 caracteres).');
      return false;
    }
    if (!consentimiento) {
      setErrorMessage('Debes autorizar el tratamiento de tus datos personales para continuar.');
      return false;
    }
    return true;
  };

  /**
   * Manejador del envío del formulario.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Envío de la consulta mediante el servicio desacoplado
      const result = await submitDudaInquietud({
        nombre,
        telefono,
        correo,
        duda_inquietud: dudaInquietud,
        consentimiento,
        tipo_consulta: tipoConsulta,
      });

      if (result.success && result.radicado) {
        setSuccessRadicado(result.radicado);
        // Limpieza de campos
        setNombre('');
        setTelefono('');
        setCorreo('');
        setDudaInquietud('');
        setConsentimiento(false);
      } else {
        setErrorMessage(result.error || 'Ocurrió un error al registrar tu consulta. Intenta nuevamente.');
      }
    } catch (err) {
      setErrorMessage('Error de conexión. Tus datos se guardarán de forma local en el dispositivo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Copia el número de radicado al portapapeles del dispositivo.
   */
  const handleCopyRadicado = () => {
    if (successRadicado && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(successRadicado);
      setCopiedRadicado(true);
      setTimeout(() => setCopiedRadicado(false), 2500);
    }
  };

  /**
   * Reinicia el formulario para registrar una nueva consulta.
   */
  const handleReset = () => {
    setSuccessRadicado(null);
    setErrorMessage(null);
    setCopiedRadicado(false);
  };

  return (
    <div className="home-page-container">
      {/* 1. Cabecera institucional oficial */}
      <HeaderNav />

      {/* 2. Cuerpo principal de la página */}
      <main className="main-content-flow" style={{ minHeight: '70vh' }}>
        <div className="dudas-page-container">
          {/* Encabezado con identidad de la Alcaldía de Montería */}
          <section className="dudas-header-card">
            <span className="dudas-header-badge">
              Atención Ciudadana • La Ronda Vive
            </span>
            <h1>Buzón de Dudas e Inquietudes</h1>
            <p>
              Bienvenido al canal de escucha ciudadana de la <strong>Alcaldía de Montería</strong>. 
              Si tienes preguntas sobre las jornadas culturales, sugerencias, peticiones o inquietudes, 
              déjanos tus datos a continuación y nuestro equipo te responderá oportunamente.
            </p>
          </section>

          {/* Estado A: Formulario de Registro */}
          {!successRadicado ? (
            <section className="dudas-form-card" aria-label="Formulario de dudas e inquietudes">
              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Alerta de error si aplica */}
                {errorMessage && (
                  <div className="dudas-error-banner" role="alert">
                    {errorMessage}
                  </div>
                )}

                {/* 1. Nombre completo */}
                <div className="dudas-form-group">
                  <label htmlFor="campo-nombre">
                    <span>Nombre Completo</span>
                    <span className="required-tag">* Requerido</span>
                  </label>
                  <input
                    id="campo-nombre"
                    type="text"
                    className="dudas-input"
                    placeholder="Ej. Andrés Camilo Pérez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>

                {/* Fila doble: Teléfono y Correo */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  {/* 2. Teléfono Celular */}
                  <div className="dudas-form-group">
                    <label htmlFor="campo-telefono">
                      <span>Teléfono / Celular</span>
                      <span className="required-tag">* Requerido</span>
                    </label>
                    <input
                      id="campo-telefono"
                      type="tel"
                      className="dudas-input"
                      placeholder="Ej. 300 123 4567"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      required
                      autoComplete="tel"
                    />
                  </div>

                  {/* 3. Correo Electrónico */}
                  <div className="dudas-form-group">
                    <label htmlFor="campo-correo">
                      <span>Correo Electrónico</span>
                      <span className="required-tag">* Requerido</span>
                    </label>
                    <input
                      id="campo-correo"
                      type="email"
                      className="dudas-input"
                      placeholder="Ej. ciudadano@ejemplo.com"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* 4. Tipo de Consulta */}
                <div className="dudas-form-group">
                  <label htmlFor="campo-tipo">
                    <span>Tipo de Consulta</span>
                  </label>
                  <select
                    id="campo-tipo"
                    className="dudas-select"
                    value={tipoConsulta}
                    onChange={(e) => setTipoConsulta(e.target.value as TipoConsulta)}
                  >
                    <option value="Duda / Inquietud">Duda / Inquietud sobre el evento</option>
                    <option value="Sugerencia">Sugerencia o propuesta cultural</option>
                    <option value="Felicitación">Felicitación o reconocimiento</option>
                    <option value="Petición / Reclamo">Petición, reclamo o solicitud formal</option>
                  </select>
                </div>

                {/* 5. Descripción de la Duda o Inquietud */}
                <div className="dudas-form-group">
                  <label htmlFor="campo-mensaje">
                    <span>Describe tu Duda o Inquietud</span>
                    <span className="required-tag">* Requerido</span>
                  </label>
                  <textarea
                    id="campo-mensaje"
                    className="dudas-textarea"
                    placeholder="Escribe aquí detalladamente tu pregunta, duda respecto a las jornadas en Calle 27 con Primera, horarios, artistas o cualquier inquietud..."
                    value={dudaInquietud}
                    onChange={(e) => setDudaInquietud(e.target.value)}
                    maxLength={1500}
                    rows={4}
                    required
                  />
                  <div className="dudas-char-count">
                    {dudaInquietud.length} / 1500 caracteres
                  </div>
                </div>

                {/* 6. Consentimiento de Tratamiento de Datos (Habeas Data) */}
                <div className={`dudas-consent-box ${consentimiento ? 'is-checked' : ''}`}>
                  <input
                    id="campo-consentimiento"
                    type="checkbox"
                    className="dudas-consent-checkbox"
                    checked={consentimiento}
                    onChange={(e) => setConsentimiento(e.target.checked)}
                    required
                  />
                  <label htmlFor="campo-consentimiento" className="dudas-consent-text" style={{ cursor: 'pointer' }}>
                    <strong>Autorizo el tratamiento de mis datos personales</strong> por parte de la 
                    <strong> Alcaldía de Montería</strong> y la <strong>Secretaría de Cultura</strong>, 
                    de conformidad con la Ley 1581 de 2012 (Habeas Data), con la única finalidad de dar respuesta 
                    a mi solicitud y hacer seguimiento a la atención ciudadana.
                  </label>
                </div>

                {/* Botón de Envío */}
                <div className="dudas-actions-wrapper">
                  <button
                    type="submit"
                    className="dudas-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Enviando tu consulta...'
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                        Enviar Consulta Ciudadana
                      </>
                    )}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '4px' }}>
                    <Link href="/" style={{ color: 'var(--text-subtle)', fontSize: '0.86rem', textDecoration: 'underline' }}>
                      Volver a la Página Principal
                    </Link>
                  </div>
                </div>
              </form>
            </section>
          ) : (
            /* Estado B: Confirmación con Radicado */
            <section className="dudas-success-card" aria-label="Confirmación de consulta enviada">
              <div className="dudas-success-icon-wrap">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>

              <h2>¡Tu Consulta ha sido Radicada!</h2>

              <p className="dudas-success-message">
                Hemos recibido tu inquietud exitosamente. El equipo de la <strong>Secretaría de Cultura</strong> de 
                la <strong>Alcaldía de Montería</strong> la revisará y te contactará a través de tu teléfono o correo electrónico.
              </p>

              {/* Constancia del Radicado */}
              <div className="dudas-radicado-pill">
                <span className="dudas-radicado-label">Número de Radicado Oficial</span>
                <span className="dudas-radicado-code">{successRadicado}</span>
              </div>

              {/* Acciones de la Constancia */}
              <div className="dudas-success-actions">
                <button
                  type="button"
                  onClick={handleCopyRadicado}
                  className="clean-btn clean-btn--secondary"
                  style={{ width: 'auto', padding: '10px 20px' }}
                >
                  {copiedRadicado ? '¡Radicado Copiado!' : 'Copiar Número de Radicado'}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="clean-btn clean-btn--outline"
                  style={{ width: 'auto', padding: '10px 20px' }}
                >
                  Enviar otra inquietud
                </button>

                <Link
                  href="/"
                  className="clean-btn clean-btn--primary"
                  style={{ width: 'auto', padding: '10px 20px' }}
                >
                  Ir al Inicio
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* 3. Pie de página institucional */}
      <Footer />
    </div>
  );
}
