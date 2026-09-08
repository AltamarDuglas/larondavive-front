'use client';

/**
 * Importaciones de React y catálogos estandarizados.
 * Componente enfocado en la Responsabilidad Única (SRP): Captura sociodemográfica del asistente.
 * Incluye búsqueda y selección fija obligatoria para todas las ciudades de Colombia.
 */
import React from 'react';
import { AgeRangeOption, GenderIdentityOption, REGISTRATION_CATALOGS } from '../../types/registration';
import { ALL_COLOMBIAN_MUNICIPALITIES } from '../../data/colombiaData';
import SearchableSelect from './SearchableSelect';

/**
 * Propiedades para el componente SociodemographicSection
 */
export interface SociodemographicSectionProps {
  /** Rango de edad seleccionado */
  ageRange: AgeRangeOption | '';
  /** Función para actualizar el rango de edad */
  onChangeAgeRange: (value: AgeRangeOption) => void;

  /** Identidad de género seleccionada */
  genderIdentity: GenderIdentityOption | '';
  /** Función para actualizar la identidad de género */
  onChangeGenderIdentity: (value: GenderIdentityOption) => void;

  /** Indica si nació en el municipio de Montería (true = Sí, false = No) */
  bornInMonteria: boolean;
  /** Función para actualizar si nació en Montería */
  onChangeBornInMonteria: (value: boolean) => void;

  /** Ubicación fija de nacimiento (Municipio y Departamento) si nació fuera de Montería */
  birthLocation: string;
  /** Función para actualizar la ubicación de nacimiento */
  onChangeBirthLocation: (value: string) => void;

  /** Indica si asistió acompañado/a de niños/as */
  attendedWithChildren: boolean;
  /** Función para actualizar si asistió con niños */
  onChangeAttendedWithChildren: (value: boolean) => void;

  /** Cantidad de niños con los que asistió (1 a 10) */
  childrenCount: number;
  /** Función para actualizar la cantidad de niños */
  onChangeChildrenCount: (value: number) => void;
}

/**
 * Componente SociodemographicSection
 * Sección 4 del formulario de registro oficial para asistentes de Ronda Vive.
 */
export default function SociodemographicSection({
  ageRange,
  onChangeAgeRange,
  genderIdentity,
  onChangeGenderIdentity,
  bornInMonteria,
  onChangeBornInMonteria,
  birthLocation,
  onChangeBirthLocation,
  attendedWithChildren,
  onChangeAttendedWithChildren,
  childrenCount,
  onChangeChildrenCount,
}: SociodemographicSectionProps) {
  return (
    <div className="form-section-block">
      <div className="form-section-header">
        <span className="section-badge-num">4</span>
        <div>
          <h3 className="section-title">Información Sociodemográfica del Asistente</h3>
          <p className="section-subtitle">
            Caracterización sociodemográfica oficial de las personas asistentes a las jornadas de Ronda Vive.
          </p>
        </div>
      </div>

      <div className="form-grid-fields">
        {/* ==========================================================================
           4.1. RANGO DE EDAD
           ========================================================================== */}
        <div className="form-group">
          <label className="form-label-text">
            4.1. Rango de edad <span className="req-star">*</span>
          </label>
          <div className="radio-tiles-grid">
            {REGISTRATION_CATALOGS.ageRanges.map((option) => (
              <label
                key={option}
                className={`radio-tile ${ageRange === option ? 'is-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="ageRange"
                  value={option}
                  checked={ageRange === option}
                  onChange={() => onChangeAgeRange(option)}
                  required
                />
                <span className="tile-text">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ==========================================================================
           ACOMPAÑAMIENTO INFANTIL (UBICADO INMEDIATAMENTE DESPUÉS DEL RANGO DE EDAD)
           ========================================================================== */}
        <div className="form-group">
          <label className="form-label-text">
            Acompañamiento infantil <span className="req-star">*</span>
          </label>
          <span className="form-helper-text">¿Asistió acompañado/a de niños/as?</span>
          <div className="segmented-toggle">
            <button
              type="button"
              className={`toggle-btn ${attendedWithChildren ? 'is-active' : ''}`}
              onClick={() => onChangeAttendedWithChildren(true)}
            >
              Sí, asistí con niños
            </button>
            <button
              type="button"
              className={`toggle-btn ${!attendedWithChildren ? 'is-active' : ''}`}
              onClick={() => {
                onChangeAttendedWithChildren(false);
                onChangeChildrenCount(0);
              }}
            >
              No, asistí solo/a
            </button>
          </div>
        </div>

        {/* Campo condicional: Cantidad de niños si asistió con niños */}
        {attendedWithChildren && (
          <div className="form-group highlight-subgroup">
            <label className="form-label-text" htmlFor="children-count-select">
              ¿Cuántos niños/as le acompañan? <span className="req-star">*</span>
            </label>
            <select
              id="children-count-select"
              value={childrenCount}
              onChange={(e) => onChangeChildrenCount(parseInt(e.target.value, 10))}
              className="clean-input clean-select"
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'niño/a' : 'niños/as'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ==========================================================================
           4.2. IDENTIDAD DE GÉNERO
           ========================================================================== */}
        <div className="form-group">
          <label className="form-label-text">
            4.2. Identidad de género <span className="req-star">*</span>
          </label>
          <div className="radio-tiles-grid radio-tiles-grid--2col">
            {REGISTRATION_CATALOGS.genderIdentities.map((option) => (
              <label
                key={option}
                className={`radio-tile ${genderIdentity === option ? 'is-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="genderIdentity"
                  value={option}
                  checked={genderIdentity === option}
                  onChange={() => onChangeGenderIdentity(option)}
                  required
                />
                <span className="tile-text">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ==========================================================================
           4.3. LUGAR DE NACIMIENTO
           ========================================================================== */}
        <div className="form-group">
          <label className="form-label-text">
            4.3. Lugar de nacimiento <span className="req-star">*</span>
          </label>
          <span className="form-helper-text">¿Nació en el municipio de Montería?</span>
          <div className="segmented-toggle">
            <button
              type="button"
              className={`toggle-btn ${bornInMonteria ? 'is-active' : ''}`}
              onClick={() => {
                onChangeBornInMonteria(true);
                onChangeBirthLocation('Montería (Córdoba)');
              }}
            >
              Sí, en Montería
            </button>
            <button
              type="button"
              className={`toggle-btn ${!bornInMonteria ? 'is-active' : ''}`}
              onClick={() => {
                onChangeBornInMonteria(false);
                if (birthLocation === 'Montería (Córdoba)') {
                  onChangeBirthLocation('');
                }
              }}
            >
              No, en otro municipio
            </button>
          </div>
        </div>

        {/* Campo condicional: Búsqueda y Selección Fija de Municipio/Departamento en Colombia */}
        {!bornInMonteria && (
          <div className="form-group highlight-subgroup">
            <label className="form-label-text" htmlFor="birth-location-searchable-select">
              Municipio y Departamento de nacimiento <span className="req-star">*</span>
            </label>
            <span className="form-helper-text">
              Escriba únicamente para buscar y seleccione su ciudad/municipio oficial de Colombia:
            </span>
            <SearchableSelect
              id="birth-location-searchable-select"
              options={ALL_COLOMBIAN_MUNICIPALITIES}
              value={birthLocation}
              onSelect={onChangeBirthLocation}
              placeholder="Escriba para buscar su municipio (Ej: Lorica, Medellín, Bogotá, Cali...)"
              required
            />
          </div>
        )}
      </div>
    </div>
  );
}
