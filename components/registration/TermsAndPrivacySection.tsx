'use client';

/**
 * Importaciones de React y tipos.
 * Componente enfocado en la Responsabilidad Única (SRP): Secciones de Protección de Datos (Habeas Data) y Términos y Condiciones 16.
 */
import React from 'react';
import { TermsAcceptanceOption } from '../../types/registration';

/**
 * Propiedades para el componente TermsAndPrivacySection
 */
export interface TermsAndPrivacySectionProps {
  /** Aceptación previa e informada de Habeas Data */
  acceptedHabeasData: boolean;
  /** Función para actualizar el estado de Habeas Data */
  onChangeAcceptedHabeasData: (value: boolean) => void;

  /** Respuesta a la Sección 16 (SI / NO) */
  acceptedTermsAndConditions: TermsAcceptanceOption | '';
  /** Función para actualizar la aceptación de términos */
  onChangeAcceptedTermsAndConditions: (value: TermsAcceptanceOption) => void;
}

/**
 * Componente TermsAndPrivacySection
 * Manejo de autorizaciones legales y declaración juramentada de participación para asistentes.
 */
export default function TermsAndPrivacySection({
  acceptedHabeasData,
  onChangeAcceptedHabeasData,
  acceptedTermsAndConditions,
  onChangeAcceptedTermsAndConditions,
}: TermsAndPrivacySectionProps) {
  return (
    <div className="form-section-block">
      {/* ==========================================================================
         AUTORIZACIÓN DE TRATAMIENTO DE DATOS PERSONALES (HABEAS DATA)
         ========================================================================== */}
      <div className="form-section-header">
        <span className="section-badge-num">🔒</span>
        <div>
          <h3 className="section-title">Autorización de Tratamiento de Datos Personales (Habeas Data)</h3>
          <p className="section-subtitle">Secretaría de Cultura de Montería • Ley 1581 de 2012</p>
        </div>
      </div>

      <div className="habeas-data-box">
        <p className="habeas-text">
          Autorizo de manera previa, expresa e informada a la Secretaría de Cultura de Montería para el
          tratamiento de mis datos personales, conforme a la normativa vigente sobre protección de datos
          personales, con fines administrativos, estadísticos y de seguimiento de la convocatoria.
        </p>

        <label className="check-label check-label--prominent">
          <input
            type="checkbox"
            checked={acceptedHabeasData}
            onChange={(e) => onChangeAcceptedHabeasData(e.target.checked)}
            required
          />
          <span className="check-text">
            <strong>Acepto la autorización de tratamiento de datos personales (Habeas Data)</strong>
          </span>
        </label>
      </div>

      {/* ==========================================================================
         SECCIÓN 16: ACEPTACIÓN DE TÉRMINOS Y CONDICIONES DE PARTICIPACIÓN
         ========================================================================== */}
      <div className="terms-section-wrapper">
        <div className="form-section-header">
          <span className="section-badge-num">16</span>
          <div>
            <h3 className="section-title">16. Aceptación de Términos y Condiciones de Participación</h3>
            <p className="section-subtitle">
              Declaración juramentada y compromiso legal para la jornada de la Alcaldía de Montería.
            </p>
          </div>
        </div>

        {/* Cuadro de texto legal completo con scrollbar sobria */}
        <div className="legal-terms-scrollbox">
          <p>
            Declaro que conozco, he leído y acepto en su totalidad el Manual del Portafolio de Estímulos
            Montería 2026, así como las condiciones generales y específicas de la presente convocatoria.
            Manifiesto que los datos consignados en este formulario y los documentos soporte anexos son
            veraces, completos y comprobables, y asumo plena responsabilidad por su contenido. Así mismo,
            me hago responsable de las consignaciones que se efectúen a la cuenta bancaria presentada en
            caso de resultar apoyado(a), y me comprometo a informar oportunamente cualquier novedad o
            modificación relacionada con dicha cuenta. Declaro que conozco y me comprometo a cumplir con la
            normativa vigente en materia de obligaciones tributarias, contables y fiscales, y, cuando sea
            aplicable, con la normativa relacionada con derechos de autor, respecto de la titularidad, uso,
            reproducción y comunicación pública de las obras o contenidos presentados, conforme a la
            legislación vigente. Certifico bajo la gravedad de juramento que, ni yo ni los integrantes del
            grupo constituido o de la persona jurídica postulante, nos encontramos incursos en causales de
            inhabilidad, incompatibilidad o prohibición legalmente establecidas, que no nos encontramos
            inscritos en el boletín de responsables fiscales (Contraloría General de la República), que no
            tenemos registros de antecedentes disciplinarios (Procuraduría General de la República), que no
            tenemos asuntos pendientes con autoridades judiciales y/o medidas correctivas pendientes por
            cumplir (RNMC), y que no nos encontramos reportados como Deudores Alimentarios Morosos (REDAM),
            de conformidad con la normatividad vigente. Acepto que las comunicaciones oficiales relacionadas
            con la convocatoria se realicen a través del correo electrónico suministrado en este formulario,
            de conformidad con lo dispuesto en el artículo 67 de la Ley 1437 de 2011.
          </p>
        </div>

        {/* Selector de Aceptación (SI / NO) fiel a la captura de pantalla */}
        <div className="form-group terms-select-group">
          <label className="form-label-text" htmlFor="terms-conditions-select">
            Acepto los términos y condiciones de participación <span className="req-star">*</span>
          </label>
          <select
            id="terms-conditions-select"
            value={acceptedTermsAndConditions}
            onChange={(e) => onChangeAcceptedTermsAndConditions(e.target.value as TermsAcceptanceOption)}
            className="clean-input clean-select clean-select--terms"
            required
          >
            <option value="">(Seleccione opción)</option>
            <option value="SI">SI - Acepto los términos y condiciones de participación</option>
            <option value="NO">NO - No acepto</option>
          </select>
          {acceptedTermsAndConditions === 'SI' && (
            <span className="terms-status-pill is-accepted">Seleccionado: SI</span>
          )}
          {acceptedTermsAndConditions === 'NO' && (
            <span className="terms-status-pill is-rejected">Seleccionado: NO</span>
          )}
        </div>
      </div>
    </div>
  );
}
