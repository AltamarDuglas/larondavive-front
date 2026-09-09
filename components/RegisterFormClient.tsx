import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

/**
 * Importaciones de subcomponentes modulares de formulario (Principio SOLID - SRP).
 */
import SociodemographicSection from './registration/SociodemographicSection';
import CommunicationSection from './registration/CommunicationSection';
import TerritorialLocationSection from './registration/TerritorialLocationSection';
import PopulationRecognitionSection from './registration/PopulationRecognitionSection';
import TermsAndPrivacySection from './registration/TermsAndPrivacySection';

/**
 * Importaciones de tipos y catálogos estandarizados.
 */
import {
  AgeRangeOption,
  GenderIdentityOption,
  ComunaOption,
  ZoneOption,
  PopulationGroupOption,
  SocialGroupOption,
  TermsAcceptanceOption,
} from '../types/registration';

import { registerAsistenciaSync } from '../lib/supabaseClient';

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
 * Componente RegisterFormClient (Flujo para Asistentes Nuevos y Recurrentes)
 * Responsabilidad Única (SRP): Controlar la secuencia interactiva de registro para la Alcaldía de Montería.
 * Detección directa de QR (salta al Paso 2), tarjeta colapsable para asistentes ya registrados, y gestión de foco/scroll.
 */
export default function RegisterFormClient({
  initialCode = 'RV-150926',
}: RegisterFormClientProps) {
  const searchParams = useSearchParams();

  // Referencias DOM para gestión accesible de foco y desplazamiento al tope de pantalla
  const containerRef = useRef<HTMLDivElement>(null);
  const ticketHeaderRef = useRef<HTMLHeadingElement>(null);
  const errorAlertRef = useRef<HTMLDivElement>(null);

  // Código obtenido del parámetro URL '?code=...' si el usuario escaneó el QR
  const urlParamCode = searchParams.get('code');
  const paramCode = urlParamCode || initialCode;

  // Si hay código en la URL (escaneo QR), ingresa directamente al Paso 2
  const [step, setStep] = useState<1 | 2 | 3>(urlParamCode ? 2 : 1);

  // Indica si el asistente ya cuenta con datos previos guardados en el dispositivo
  const [hasPreviousData, setHasPreviousData] = useState<boolean>(false);
  // Estado para controlar el despliegue del formulario completo cuando el usuario es recurrente
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);
  // Estado para indicar si el usuario ya estaba registrado previamente en la jornada actual
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState<boolean>(false);

  // ==========================================================================
  // ESTADO DEL FORMULARIO DE ASISTENTE
  // ==========================================================================
  const [code, setCode] = useState<string>(paramCode);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // 4. Información sociodemográfica
  const [ageRange, setAgeRange] = useState<AgeRangeOption | ''>('');
  const [genderIdentity, setGenderIdentity] = useState<GenderIdentityOption | ''>('');
  const [bornInMonteria, setBornInMonteria] = useState<boolean>(true);
  const [birthLocation, setBirthLocation] = useState<string>('Montería (Córdoba)');
  const [attendedWithChildren, setAttendedWithChildren] = useState<boolean>(false);
  const [childrenCount, setChildrenCount] = useState<number>(0);

  // 7. Ubicación territorial
  const [comuna, setComuna] = useState<ComunaOption | ''>('');
  const [barrio, setBarrio] = useState<string>('');
  const [zone, setZone] = useState<ZoneOption | ''>('Urbana');

  // 8. Autorreconocimiento poblacional
  const [populationGroup, setPopulationGroup] = useState<PopulationGroupOption | ''>('Ninguno');
  const [socialGroup, setSocialGroup] = useState<SocialGroupOption | ''>('Ninguno');
  const [otherSocialGroupSpec, setOtherSocialGroupSpec] = useState<string>('');

  // Términos y Habeas Data
  const [acceptedHabeasData, setAcceptedHabeasData] = useState<boolean>(true);
  const [acceptedTermsAndConditions, setAcceptedTermsAndConditions] =
    useState<TermsAcceptanceOption | ''>('SI');

  // Mensaje de alerta de error
  const [errorMessage, setErrorMessage] = useState<string>('');

  /**
   * Función de utilidad para desplazar suavemente al tope de pantalla y colocar el foco
   * en el elemento de interés (Encabezado de Ticket o Alerta de Error).
   */
  const scrollToTopAndFocus = (targetRef?: React.RefObject<HTMLElement | null>) => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setTimeout(() => {
      if (targetRef?.current) {
        targetRef.current.focus();
      }
    }, 150);
  };

  /**
   * Carga de datos previos guardados en el navegador (asistente recurrente)
   */
  useEffect(() => {
    try {
      const savedDataRaw = localStorage.getItem('rv_attendee_full_data');
      if (savedDataRaw) {
        const parsed = JSON.parse(savedDataRaw);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.ageRange) setAgeRange(parsed.ageRange);
        if (parsed.genderIdentity) setGenderIdentity(parsed.genderIdentity);
        if (typeof parsed.bornInMonteria === 'boolean') setBornInMonteria(parsed.bornInMonteria);
        if (parsed.birthLocation) setBirthLocation(parsed.birthLocation);
        if (typeof parsed.attendedWithChildren === 'boolean')
          setAttendedWithChildren(parsed.attendedWithChildren);
        if (parsed.childrenCount) setChildrenCount(parsed.childrenCount);
        if (parsed.comuna) setComuna(parsed.comuna);
        if (parsed.barrio) setBarrio(parsed.barrio);
        if (parsed.zone) setZone(parsed.zone);
        if (parsed.populationGroup) setPopulationGroup(parsed.populationGroup);
        if (parsed.socialGroup) setSocialGroup(parsed.socialGroup);
        if (parsed.otherSocialGroupSpec) setOtherSocialGroupSpec(parsed.otherSocialGroupSpec);

        if (parsed.fullName && parsed.phone && parsed.email) {
          setHasPreviousData(true);
        }
      } else {
        // Fallback a llaves individuales anteriores
        const savedName = localStorage.getItem('rv_user_fullname');
        const savedPhone = localStorage.getItem('rv_user_phone');
        const savedEmail = localStorage.getItem('rv_user_email');
        if (savedName) setFullName(savedName);
        if (savedPhone) setPhone(savedPhone);
        if (savedEmail) setEmail(savedEmail);
        if (savedName && savedPhone && savedEmail) {
          setHasPreviousData(true);
        }
      }
    } catch {
      // Ignorar excepciones de lectura de localStorage
    }
  }, []);

  /**
   * Detección directa del escaneo QR proveniente del parámetro URL
   */
  useEffect(() => {
    if (urlParamCode) {
      setCode(urlParamCode);
      setStep(2);
    }
  }, [urlParamCode]);

  /**
   * Manejador del Paso 1: Validar e ingresar el código de asistencia
   */
  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim();

    if (!cleanCode) {
      setErrorMessage('Por favor ingresa un código de asistencia válido.');
      scrollToTopAndFocus(errorAlertRef);
      return;
    }

    setErrorMessage('');
    setStep(2);
    scrollToTopAndFocus();
  };

  /**
   * Manejador del Paso 2: Enviar formulario completo de datos del asistente
   */
  const handleSubmitData = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validación de datos básicos
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setErrorMessage('Por favor completa los canales de comunicación y nombre completo.');
      scrollToTopAndFocus(errorAlertRef);
      return;
    }

    // 2. Validación sociodemográfica (si está expandido o es primer registro)
    if (!ageRange) {
      setErrorMessage('Por favor selecciona tu rango de edad (Sección 4.1).');
      scrollToTopAndFocus(errorAlertRef);
      return;
    }
    if (!genderIdentity) {
      setErrorMessage('Por favor selecciona tu identidad de género (Sección 4.2).');
      scrollToTopAndFocus(errorAlertRef);
      return;
    }
    if (!bornInMonteria && !birthLocation.trim()) {
      setErrorMessage('Por favor selecciona tu municipio de nacimiento (Sección 4.3).');
      scrollToTopAndFocus(errorAlertRef);
      return;
    }
    if (attendedWithChildren && childrenCount <= 0) {
      setErrorMessage('Por favor selecciona la cantidad de niños/as que te acompañan.');
      scrollToTopAndFocus(errorAlertRef);
      return;
    }

    // 3. Validación territorial
    if (!barrio.trim()) {
      setErrorMessage('Por favor indica tu barrio o urbanización en Montería.');
      scrollToTopAndFocus(errorAlertRef);
      return;
    }
    if (!comuna) {
      setErrorMessage('Por favor selecciona la Comuna de Montería (Sección 7.1).');
      scrollToTopAndFocus(errorAlertRef);
      return;
    }
    if (!zone) {
      setErrorMessage('Por favor selecciona tu zona territorial (Urbana o Rural).');
      scrollToTopAndFocus(errorAlertRef);
      return;
    }

    // 4. Validación de autorreconocimiento poblacional
    if (!populationGroup) {
      setErrorMessage('Por favor selecciona tu comunidad o grupo poblacional (Sección 8.1).');
      scrollToTopAndFocus(errorAlertRef);
      return;
    }
    if (!socialGroup) {
      setErrorMessage('Por favor selecciona tu grupo social o sujeto de especial protección (Sección 8.2).');
      scrollToTopAndFocus(errorAlertRef);
      return;
    }
    if (socialGroup === 'Otros' && !otherSocialGroupSpec.trim()) {
      setErrorMessage('Por favor especifica el grupo social o condición especial.');
      scrollToTopAndFocus(errorAlertRef);
      return;
    }

    // 5. Validación legal y Habeas Data
    if (!acceptedHabeasData) {
      setErrorMessage('Debes aceptar la autorización de tratamiento de datos personales (Habeas Data).');
      scrollToTopAndFocus(errorAlertRef);
      return;
    }
    if (acceptedTermsAndConditions !== 'SI') {
      setErrorMessage(
        'Debes aceptar los términos y condiciones de participación (Sección 16) seleccionando "SI".'
      );
      scrollToTopAndFocus(errorAlertRef);
      return;
    }

    // Almacenar datos consolidados en localStorage y sincronizar con Supabase
    const fullDataPayload = {
      code: code.trim(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      ageRange: ageRange as AgeRangeOption,
      genderIdentity: genderIdentity as GenderIdentityOption,
      bornInMonteria,
      birthLocation: bornInMonteria ? 'Montería (Córdoba)' : birthLocation.trim(),
      attendedWithChildren,
      childrenCount,
      comuna: comuna as ComunaOption,
      barrio: barrio.trim(),
      zone: zone as ZoneOption,
      populationGroup: populationGroup as PopulationGroupOption,
      socialGroup: socialGroup as SocialGroupOption,
      otherSocialGroupSpec: socialGroup === 'Otros' ? otherSocialGroupSpec.trim() : '',
      acceptedHabeasData,
      acceptedTermsAndConditions: acceptedTermsAndConditions as TermsAcceptanceOption,
    };

    // Sincronizar asistencia y capturar si el registro era un duplicado
    const res = await registerAsistenciaSync(fullDataPayload);
    setIsAlreadyRegistered(Boolean(res.isAlreadyRegistered));
    setHasPreviousData(true);

    setErrorMessage('');
    setStep(3);
    scrollToTopAndFocus(ticketHeaderRef);
  };

  return (
    <div className="register-client-container" ref={containerRef}>
      {/* Indicadores intuitivos de progreso (Paso 1 de 2 / Paso 2 de 2) */}
      {step < 3 && (
        <nav className="step-progress-wrapper" aria-label="Progreso de Registro">
          <div className="step-progress-header">
            <span className="step-counter-label">
              Paso <strong>{step}</strong> de 2: {step === 1 ? 'Validación de Código' : 'Datos del Asistente'}
            </span>
          </div>

          <div className="step-progress-bar">
            <button
              type="button"
              className={`step-pill ${step === 1 ? 'is-active' : 'is-completed'}`}
              onClick={() => {
                if (step === 2) {
                  setStep(1);
                  scrollToTopAndFocus();
                }
              }}
              title={step === 2 ? 'Volver al Paso 1 para cambiar código' : undefined}
            >
              <span className="pill-badge">{step > 1 ? '✓' : '1'}</span>
              <span className="pill-text">
                <span className="pill-text-full">1. Código de Asistencia</span>
                <span className="pill-text-short">1. Código</span>
              </span>
            </button>

            <div className={`step-line ${step === 2 ? 'is-filled' : ''}`}>
              <div className="step-line-fill" />
            </div>

            <div className={`step-pill ${step === 2 ? 'is-active' : ''}`}>
              <span className="pill-badge">2</span>
              <span className="pill-text">
                <span className="pill-text-full">2. Datos del Asistente</span>
                <span className="pill-text-short">2. Datos</span>
              </span>
            </div>
          </div>
        </nav>
      )}

      {/* Alerta de error en caso de omisiones o inconformidades */}
      {errorMessage && (
        <div className="form-error-alert" role="alert" ref={errorAlertRef} tabIndex={-1} style={{ outline: 'none' }}>
          <span>⚠️ {errorMessage}</span>
        </div>
      )}

      {/* ==========================================================================
         PASO 1: PEDIR O CONFIRMAR EL CÓDIGO DE ASISTENCIA / QR
         ========================================================================== */}
      {step === 1 && (
        <section className="form-step-card">
          <div className="form-step-head">
            <span className="eyebrow">Paso 1: Validación de Asistencia</span>
            <h2>Ingresa el Código de la Jornada</h2>
            <p className="lede">
              Introduce el código impreso en el pendón QR oficial o suministrado en la Calle 27 con
              Avenida Primera.
            </p>
          </div>

          <form onSubmit={handleValidateCode} className="clean-form">
            <label className="form-group">
              <span className="form-label-text">Código del Evento / Pendón QR</span>
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
                Continuar al Formulario de Asistente
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ==========================================================================
         PASO 2: FORMULARIO Y RECONOCIMIENTO DE ASISTENTE RECURRENTE
         ========================================================================== */}
      {step === 2 && (
        <section className="form-step-card">
          <div className="code-status-badge">
            <span>
              Código de Jornada: <strong>{code}</strong>
            </span>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-change-code"
              title="Cambiar código"
            >
              Cambiar Código
            </button>
          </div>

          {/* VISTA RESUMIDA PARA ASISTENTE RECURRENTE (NO DESPLIEGA TODO EL FORMULARIO POR DEFECTO) */}
          {hasPreviousData && !isFormExpanded ? (
            <div className="recurring-attendee-card">
              <div className="recurring-head">
                <span className="recurring-badge">Asistente Registrado(a)</span>
                <h2>¡Hola de nuevo, {fullName}!</h2>
                <p className="lede">
                  Reconocemos tus datos oficiales guardados en este dispositivo.
                </p>
              </div>

              <div className="recurring-summary-grid">
                <div className="summary-card-item">
                  <span className="summary-label">Nombre del Asistente</span>
                  <strong className="summary-value">{fullName}</strong>
                </div>
                <div className="summary-card-item">
                  <span className="summary-label">Teléfono Celular</span>
                  <strong className="summary-value">{phone}</strong>
                </div>
                <div className="summary-card-item">
                  <span className="summary-label">Correo Electrónico</span>
                  <strong className="summary-value">{email}</strong>
                </div>
                {barrio && (
                  <div className="summary-card-item">
                    <span className="summary-label">Ubicación Registrada</span>
                    <strong className="summary-value">
                      {barrio} ({comuna})
                    </strong>
                  </div>
                )}
              </div>

              {/* Acordeón para desplegar / modificar los datos sociodemográficos si lo requiere */}
              <div className="recurring-accordion-box">
                <button
                  type="button"
                  className="btn-toggle-accordion"
                  onClick={() => setIsFormExpanded(true)}
                >
                  ✏️ Ver o modificar mi caracterización completa (Barrio, Edad, Niños, etc.)
                </button>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleSubmitData}
                  className="clean-btn clean-btn--primary clean-btn--lg"
                >
                  Confirmar Mi Asistencia ({code})
                </button>
              </div>
            </div>
          ) : (
            /* VISTA DEL FORMULARIO COMPLETO */
            <div>
              <div className="form-step-head">
                <span className="eyebrow">Paso 2: Caracterización y Registro</span>
                <h2>Formulario Oficial de Asistente</h2>
                <p className="lede">
                  Ingresa tus datos personales, sociodemográficos y territoriales para registrar tu presencia
                  oficial en la jornada de hoy.
                </p>
                {hasPreviousData && (
                  <button
                    type="button"
                    className="btn-collapse-form"
                    onClick={() => setIsFormExpanded(false)}
                  >
                    ▲ Ocultar formulario completo (Usar datos guardados)
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitData} className="clean-form">
                {/* NOMBRE COMPLETO */}
                <div className="form-group">
                  <label className="form-label-text" htmlFor="fullname-input">
                    Nombre Completo del Asistente <span className="req-star">*</span>
                  </label>
                  <input
                    id="fullname-input"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej: María Pérez"
                    className="clean-input"
                    required
                  />
                </div>

                {/* SECCIÓN 5: CANALES DE COMUNICACIÓN */}
                <CommunicationSection
                  phone={phone}
                  onChangePhone={setPhone}
                  email={email}
                  onChangeEmail={setEmail}
                />

                {/* SECCIÓN 4: INFORMACIÓN SOCIODEMOGRÁFICA */}
                <SociodemographicSection
                  ageRange={ageRange}
                  onChangeAgeRange={setAgeRange}
                  genderIdentity={genderIdentity}
                  onChangeGenderIdentity={setGenderIdentity}
                  bornInMonteria={bornInMonteria}
                  onChangeBornInMonteria={setBornInMonteria}
                  birthLocation={birthLocation}
                  onChangeBirthLocation={setBirthLocation}
                  attendedWithChildren={attendedWithChildren}
                  onChangeAttendedWithChildren={setAttendedWithChildren}
                  childrenCount={childrenCount}
                  onChangeChildrenCount={setChildrenCount}
                />

                {/* SECCIÓN 7: UBICACIÓN TERRITORIAL EN MONTERÍA */}
                <TerritorialLocationSection
                  barrio={barrio}
                  onChangeBarrio={setBarrio}
                  comuna={comuna}
                  onChangeComuna={setComuna}
                  zone={zone}
                  onChangeZone={setZone}
                />

                {/* SECCIÓN 8: AUTORRECONOCIMIENTO POBLACIONAL */}
                <PopulationRecognitionSection
                  populationGroup={populationGroup}
                  onChangePopulationGroup={setPopulationGroup}
                  socialGroup={socialGroup}
                  onChangeSocialGroup={setSocialGroup}
                  otherSocialGroupSpec={otherSocialGroupSpec}
                  onChangeOtherSocialGroupSpec={setOtherSocialGroupSpec}
                />

                {/* HABEAS DATA Y SECCIÓN 16: TÉRMINOS Y CONDICIONES */}
                <TermsAndPrivacySection
                  acceptedHabeasData={acceptedHabeasData}
                  onChangeAcceptedHabeasData={setAcceptedHabeasData}
                  acceptedTermsAndConditions={acceptedTermsAndConditions}
                  onChangeAcceptedTermsAndConditions={setAcceptedTermsAndConditions}
                />

                <div className="form-actions">
                  <button type="submit" className="clean-btn clean-btn--primary clean-btn--lg">
                    Confirmar Mi Registro de Asistencia
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      )}

      {/* ==========================================================================
         PASO 3: CONFIRMACIÓN EXITOSA Y TICKET DIGITAL DE ASISTENCIA
         ========================================================================== */}
      {step === 3 && (
        <section className="success-ticket-card">
          <div className="ticket-header">
            {isAlreadyRegistered ? (
              <span
                className="ticket-badge-notice"
                style={{
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  display: 'inline-block',
                  marginBottom: '0.5rem',
                  border: '1px solid #bae6fd',
                }}
              >
                ℹ️ Asistencia Previamente Registrada (Datos Actualizados)
              </span>
            ) : (
              <span className="ticket-badge-success">Asistencia Oficial Confirmada</span>
            )}
            <h2 ref={ticketHeaderRef} tabIndex={-1} style={{ outline: 'none' }}>
              {isAlreadyRegistered ? '¡Asistencia Reconfirmada con Éxito!' : '¡Registro Completado con Éxito!'}
            </h2>
            <p>
              {isAlreadyRegistered
                ? 'Ya contabas con un registro previo para esta jornada. Tus datos han sido actualizados y tu asistencia se reconfirmó.'
                : 'Alcaldía de Montería • Ronda Vive en la Calle 27 con Av. Primera'}
            </p>
          </div>

          {/* Resumen completo del asistente */}
          <div className="ticket-details-grid">
            <div className="ticket-detail-item">
              <span className="item-label">Asistente</span>
              <strong className="item-value">{fullName}</strong>
            </div>

            <div className="ticket-detail-item">
              <span className="item-label">Jornada Registrada</span>
              <strong className="item-value">{code}</strong>
            </div>

            <div className="ticket-detail-item">
              <span className="item-label">Celular y Correo</span>
              <strong className="item-value">
                {phone} • {email}
              </strong>
            </div>

            <div className="ticket-detail-item">
              <span className="item-label">Ubicación en Montería</span>
              <strong className="item-value">
                {barrio} ({comuna} • Zona {zone})
              </strong>
            </div>

            <div className="ticket-detail-item">
              <span className="item-label">Lugar de Nacimiento</span>
              <strong className="item-value">
                {bornInMonteria ? 'Montería (Córdoba)' : birthLocation}
              </strong>
            </div>

            <div className="ticket-detail-item">
              <span className="item-label">Acompañamiento Niños</span>
              <strong className="item-value">
                {attendedWithChildren
                  ? `${childrenCount} niño(s) acompañante(s)`
                  : 'Sin menores de edad'}
              </strong>
            </div>

            <div className="ticket-detail-item">
              <span className="item-label">Fecha y Hora</span>
              <strong className="item-value">{new Date().toLocaleDateString('es-CO')}</strong>
            </div>

            <div className="ticket-detail-item">
              <span className="item-label">Estado Legal</span>
              <strong className="item-value">Habeas Data ✅ | Términos Aceptados (SI) ✅</strong>
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
