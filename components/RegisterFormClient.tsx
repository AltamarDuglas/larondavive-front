'use client';

/**
 * Importaciones de React y Next.js.
 * - useState, useEffect, useRef: Manejo de estado interactivo, escáner de cámara QR y accesibilidad.
 * - useSearchParams: Lectura de parámetros URL.
 * - Link: Navegación del cliente sin recargar la página.
 */
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Html5Qrcode } from 'html5-qrcode';

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

import { registerAsistenciaSync, validateJornadaCode } from '../lib/supabaseClient';

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
 * Incluye escáner de código QR por cámara, formulario limpio por defecto y remoción total de emojis.
 */
export default function RegisterFormClient({
  initialCode = '',
}: RegisterFormClientProps) {
  const searchParams = useSearchParams();

  // Referencias DOM para gestión accesible de foco, scroll y visor de cámara QR
  const containerRef = useRef<HTMLDivElement>(null);
  const ticketHeaderRef = useRef<HTMLHeadingElement>(null);
  const errorAlertRef = useRef<HTMLDivElement>(null);
  const qrScannerInstanceRef = useRef<Html5Qrcode | null>(null);

  // Código obtenido del parámetro URL '?code=...' si el usuario escaneó un QR externo
  const urlParamCode = searchParams.get('code');
  const paramCode = urlParamCode || initialCode;

  // Paso actual (1: Validación de Código / Cámara, 2: Formulario, 3: Ticket Confirmación)
  const [step, setStep] = useState<1 | 2 | 3>(urlParamCode ? 2 : 1);

  // Estado para controlar la activación de la cámara escáner de QR
  const [isScanningQR, setIsScanningQR] = useState<boolean>(false);

  // Indica si existen datos previos guardados localmente para ofrecer autocompletado opcional
  const [hasPreviousData, setHasPreviousData] = useState<boolean>(false);
  // Estado para indicar si el usuario ya estaba registrado previamente en la jornada actual
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState<boolean>(false);

  // ==========================================================================
  // ESTADO DEL FORMULARIO DE ASISTENTE (INICIALIZADO TOTALMENTE LIMPIO)
  // ==========================================================================
  const [code, setCode] = useState<string>(paramCode);
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Información sociodemográfica
  const [ageRange, setAgeRange] = useState<AgeRangeOption | ''>('');
  const [genderIdentity, setGenderIdentity] = useState<GenderIdentityOption | ''>('');
  const [bornInMonteria, setBornInMonteria] = useState<boolean>(true);
  const [birthLocation, setBirthLocation] = useState<string>('Montería (Córdoba)');
  const [attendedWithChildren, setAttendedWithChildren] = useState<boolean>(false);
  const [childrenCount, setChildrenCount] = useState<number>(0);

  // Ubicación territorial
  const [comuna, setComuna] = useState<ComunaOption | ''>('');
  const [barrio, setBarrio] = useState<string>('');
  const [zone, setZone] = useState<ZoneOption | ''>('Urbana');

  // Autorreconocimiento poblacional
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
   * Desplaza la pantalla suavemente al tope y coloca el foco en el elemento indicado
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
   * Verifica la presencia de datos anteriores sin forzar el autocompletado automático
   */
  useEffect(() => {
    try {
      const savedDataRaw = localStorage.getItem('rv_attendee_full_data');
      if (savedDataRaw) {
        setHasPreviousData(true);
      }
    } catch {
      // Ignorar excepciones de lectura de localStorage
    }
  }, []);

  /**
   * Cargar datos anteriores manualmente si el usuario lo solicita explícitamente
   */
  const handleLoadPreviousData = () => {
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
      }
    } catch {
      // Ignorar excepciones
    }
  };

  /**
   * Limpia totalmente el formulario y los datos guardados en el navegador
   */
  const handleClearSavedData = () => {
    try {
      localStorage.removeItem('rv_attendee_full_data');
      localStorage.removeItem('rv_user_fullname');
      localStorage.removeItem('rv_user_phone');
      localStorage.removeItem('rv_user_email');
    } catch {
      // Ignorar
    }
    setHasPreviousData(false);
    setFullName('');
    setPhone('');
    setEmail('');
    setAgeRange('');
    setGenderIdentity('');
    setBornInMonteria(true);
    setBirthLocation('Montería (Córdoba)');
    setAttendedWithChildren(false);
    setChildrenCount(0);
    setComuna('');
    setBarrio('');
    setZone('Urbana');
    setPopulationGroup('Ninguno');
    setSocialGroup('Ninguno');
    setOtherSocialGroupSpec('');
  };

  /**
   * Detección directa y validación del escaneo QR proveniente del parámetro URL
   */
  useEffect(() => {
    if (urlParamCode) {
      setCode(urlParamCode);
      validateJornadaCode(urlParamCode).then((validation) => {
        if (!validation.isValid || validation.isExpired) {
          setErrorMessage(validation.error || 'La jornada escaneada no está disponible.');
          setStep(1);
          scrollToTopAndFocus(errorAlertRef);
        } else {
          setStep(2);
        }
      });
    }
  }, [urlParamCode]);

  /**
   * Inicia el escáner QR mediante la cámara del dispositivo
   */
  const startQRScanner = async () => {
    setErrorMessage('');
    setIsScanningQR(true);

    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode('qr-reader-viewport');
        qrScannerInstanceRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          async (decodedText) => {
            let extractedCode = decodedText.trim();
            try {
              if (extractedCode.includes('code=')) {
                const url = new URL(extractedCode);
                const qParam = url.searchParams.get('code');
                if (qParam) extractedCode = qParam;
              }
            } catch {
              // Si no es URL válida, usar el texto plano del QR
            }

            await stopQRScanner();
            setCode(extractedCode);

            // Validar la jornada obtenida de la cámara
            const validation = await validateJornadaCode(extractedCode);
            if (!validation.isValid || validation.isExpired) {
              setErrorMessage(validation.error || 'La jornada escaneada no es válida.');
              scrollToTopAndFocus(errorAlertRef);
            } else {
              setErrorMessage('');
              setStep(2);
              scrollToTopAndFocus();
            }
          },
          () => {
            // Cuadros no reconocidos ignorados silenciosamente
          }
        );
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'No se pudo activar la cámara del dispositivo.';
        setErrorMessage(
          'No se pudo acceder a la cámara del dispositivo. Verifica que hayas concedido los permisos de cámara en tu navegador.'
        );
        setIsScanningQR(false);
        scrollToTopAndFocus(errorAlertRef);
      }
    }, 200);
  };

  /**
   * Detiene el visor de la cámara de forma segura
   */
  const stopQRScanner = async () => {
    if (qrScannerInstanceRef.current) {
      try {
        if (qrScannerInstanceRef.current.isScanning) {
          await qrScannerInstanceRef.current.stop();
        }
        qrScannerInstanceRef.current.clear();
      } catch {
        // Ignorar excepciones al cerrar cámara
      }
      qrScannerInstanceRef.current = null;
    }
    setIsScanningQR(false);
  };

  // Detener la cámara al desmontar el componente
  useEffect(() => {
    return () => {
      if (qrScannerInstanceRef.current) {
        stopQRScanner();
      }
    };
  }, []);

  /**
   * Manejador del Paso 1: Validar existencia e ingreso del código de asistencia
   */
  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim();

    if (!cleanCode) {
      setErrorMessage('Por favor ingresa un código de asistencia válido.');
      scrollToTopAndFocus(errorAlertRef);
      return;
    }

    const validation = await validateJornadaCode(cleanCode);

    if (!validation.isValid || validation.isExpired) {
      setErrorMessage(validation.error || 'La jornada ingresada no es válida.');
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

    // 2. Validación sociodemográfica
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
              <span className="pill-badge">
                {step > 1 ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  '1'
                )}
              </span>
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

      {/* Alerta de error en caso de omisiones o inconformidades (Sin emojis, usa icono SVG) */}
      {errorMessage && (
        <div className="form-error-alert" role="alert" ref={errorAlertRef} tabIndex={-1} style={{ outline: 'none' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: '8px' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ==========================================================================
         PASO 1: INGRESAR O ESCANEAR CON CÁMARA EL CÓDIGO DE JORNADA
         ========================================================================== */}
      {step === 1 && (
        <section className="form-step-card">
          <div className="form-step-head">
            <span className="eyebrow">Paso 1: Validación de Asistencia</span>
            <h2>Ingresa o Escanea el Código de la Jornada</h2>
            <p className="lede">
              Introduce el código escrito en el pendón de la jornada o usa la cámara de tu dispositivo para escanear el código QR.
            </p>
          </div>

          {/* VISOR DE CÁMARA PARA ESCANEAR CÓDIGO QR */}
          {isScanningQR ? (
            <div className="qr-scanner-box" style={{ background: '#0f172a', padding: '1.25rem', borderRadius: '0.75rem', textAlign: 'center', marginBottom: '1.5rem', color: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Escanear Código QR en Vivo</span>
                <button
                  type="button"
                  onClick={stopQRScanner}
                  className="clean-btn clean-btn--secondary"
                  style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
                >
                  Cerrar Cámara
                </button>
              </div>
              <div id="qr-reader-viewport" style={{ width: '100%', maxWidth: '380px', margin: '0 auto', borderRadius: '0.5rem', overflow: 'hidden' }}></div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.75rem' }}>
                Encuadra el código QR del pendón dentro del recuadro para detectar la jornada automáticamente.
              </p>
            </div>
          ) : (
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <button
                type="button"
                onClick={startQRScanner}
                className="clean-btn clean-btn--secondary"
                style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.95rem', fontWeight: 600 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Escanear Código QR con Cámara
              </button>
            </div>
          )}

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
         PASO 2: FORMULARIO DE CARACTERIZACIÓN Y DATOS DEL CIUDADANO
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

          {/* NOTIFICACIÓN OPCIONAL DE DATOS PREVIOS GUARDADOS (PERMITE CARGAR O INICIAR REGISTRO LIMPIO) */}
          {hasPreviousData && (
            <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '0.85rem 1rem', borderRadius: '0.625rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#334155', fontWeight: 500 }}>
                Se encontraron datos registrados anteriormente en este navegador.
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleLoadPreviousData}
                  className="clean-btn clean-btn--secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                >
                  Cargar mis datos guardados
                </button>
                <button
                  type="button"
                  onClick={handleClearSavedData}
                  className="clean-btn"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1' }}
                >
                  Iniciar registro limpio / Otro ciudadano
                </button>
              </div>
            </div>
          )}

          <div>
            <div className="form-step-head">
              <span className="eyebrow">Paso 2: Caracterización y Registro</span>
              <h2>Formulario Oficial de Asistente</h2>
              <p className="lede">
                Ingresa tus datos personales, sociodemográficos y territoriales para registrar tu presencia
                oficial en la jornada de hoy.
              </p>
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
                Asistencia Previamente Registrada (Datos Actualizados)
              </span>
            ) : (
              <span className="ticket-badge-success">Asistencia Oficial Confirmada</span>
            )}
            <h2 ref={ticketHeaderRef} tabIndex={-1} style={{ outline: 'none' }}>
              {isAlreadyRegistered ? 'Asistencia Reconfirmada con Éxito' : 'Registro Completado con Éxito'}
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
              <strong className="item-value">Habeas Data (Aceptado) | Términos (SI)</strong>
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
