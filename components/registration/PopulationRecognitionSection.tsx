'use client';

/**
 * Importaciones de React.
 * Componente enfocado en la Responsabilidad Única (SRP): Sección 8 - Autorreconocimiento Poblacional del Asistente.
 */
import React from 'react';
import {
  PopulationGroupOption,
  SocialGroupOption,
  REGISTRATION_CATALOGS,
} from '../../types/registration';

/**
 * Propiedades para el componente PopulationRecognitionSection
 */
export interface PopulationRecognitionSectionProps {
  /** Comunidad o grupo poblacional al que pertenece */
  populationGroup: PopulationGroupOption | '';
  /** Función para actualizar el grupo poblacional */
  onChangePopulationGroup: (value: PopulationGroupOption) => void;

  /** Grupo social o sujeto de especial protección */
  socialGroup: SocialGroupOption | '';
  /** Función para actualizar el grupo social */
  onChangeSocialGroup: (value: SocialGroupOption) => void;

  /** Especificación si seleccionó 'Otros' */
  otherSocialGroupSpec?: string;
  /** Función para actualizar la especificación libre */
  onChangeOtherSocialGroupSpec: (value: string) => void;
}

/**
 * Componente PopulationRecognitionSection
 * Sección 8 del formulario de registro oficial para asistentes de Ronda Vive.
 */
export default function PopulationRecognitionSection({
  populationGroup,
  onChangePopulationGroup,
  socialGroup,
  onChangeSocialGroup,
  otherSocialGroupSpec = '',
  onChangeOtherSocialGroupSpec,
}: PopulationRecognitionSectionProps) {
  return (
    <div className="form-section-block">
      <div className="form-section-header">
        <span className="section-badge-num">8</span>
        <div>
          <h3 className="section-title">Autorreconocimiento Poblacional</h3>
          <p className="section-subtitle">
            Enfoque diferencial de inclusión social y grupos de especial protección.
          </p>
        </div>
      </div>

      <div className="form-grid-fields">
        {/* ==========================================================================
           8.1. COMUNIDAD O GRUPO POBLACIONAL AL QUE PERTENECE
           ========================================================================== */}
        <div className="form-group">
          <label className="form-label-text">
            8.1. Comunidad o grupo poblacional al que pertenece <span className="req-star">*</span>
          </label>
          <div className="radio-tiles-grid radio-tiles-grid--2col">
            {REGISTRATION_CATALOGS.populationGroups.map((option) => (
              <label
                key={option}
                className={`radio-tile ${populationGroup === option ? 'is-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="populationGroup"
                  value={option}
                  checked={populationGroup === option}
                  onChange={() => onChangePopulationGroup(option)}
                  required
                />
                <span className="tile-text">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ==========================================================================
           8.2. GRUPO SOCIAL O SUJETO DE ESPECIAL PROTECCIÓN
           ========================================================================== */}
        <div className="form-group">
          <label className="form-label-text">
            8.2. Grupo social o sujeto de especial protección <span className="req-star">*</span>
          </label>
          <div className="radio-tiles-grid radio-tiles-grid--2col">
            {REGISTRATION_CATALOGS.socialGroups.map((option) => (
              <label
                key={option}
                className={`radio-tile ${socialGroup === option ? 'is-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="socialGroup"
                  value={option}
                  checked={socialGroup === option}
                  onChange={() => onChangeSocialGroup(option)}
                  required
                />
                <span className="tile-text">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Campo condicional para especificar en caso de seleccionar 'Otros' */}
        {socialGroup === 'Otros' && (
          <div className="form-group highlight-subgroup">
            <label className="form-label-text" htmlFor="other-social-group-input">
              Especifique el grupo social o sujeto de especial protección <span className="req-star">*</span>
            </label>
            <input
              id="other-social-group-input"
              type="text"
              value={otherSocialGroupSpec}
              onChange={(e) => onChangeOtherSocialGroupSpec(e.target.value)}
              placeholder="Indique a qué otro grupo o condición pertenece..."
              className="clean-input"
              required
            />
          </div>
        )}
      </div>
    </div>
  );
}
