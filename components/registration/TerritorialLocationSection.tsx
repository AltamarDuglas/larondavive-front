'use client';

/**
 * Importaciones de React y catálogos estandarizados de Montería.
 * Componente con Responsabilidad Única (SRP): Sección 7 - Ubicación Territorial.
 * Cumple la regla del usuario: El Barrio aparece PRIMERO antes que la Comuna.
 */
import React from 'react';
import { ComunaOption, ZoneOption, REGISTRATION_CATALOGS } from '../../types/registration';
import { MONTERIA_BARRIOS_LIST } from '../../data/colombiaData';
import SearchableSelect from './SearchableSelect';

/**
 * Propiedades para el componente TerritorialLocationSection
 */
export interface TerritorialLocationSectionProps {
  /** Barrio o urbanización de residencia en Montería */
  barrio: string;
  /** Función para actualizar el barrio */
  onChangeBarrio: (value: string) => void;

  /** Comuna seleccionada de Montería */
  comuna: ComunaOption | '';
  /** Función para actualizar la comuna */
  onChangeComuna: (value: ComunaOption) => void;

  /** Zona territorial (Urbana / Rural) */
  zone: ZoneOption | '';
  /** Función para actualizar la zona */
  onChangeZone: (value: ZoneOption) => void;
}

/**
 * Componente TerritorialLocationSection
 * Sección 7 del formulario de registro oficial para asistentes de Ronda Vive.
 * El usuario busca y selecciona su Barrio primero, e infiere la Comuna automáticamente.
 */
export default function TerritorialLocationSection({
  barrio,
  onChangeBarrio,
  comuna,
  onChangeComuna,
  zone,
  onChangeZone,
}: TerritorialLocationSectionProps) {
  // Lista de nombres de barrios para el buscador
  const barrioNames = MONTERIA_BARRIOS_LIST.map((b) => b.name);

  /**
   * Al seleccionar un barrio de la lista de Montería, asigna automáticamente su Comuna correspondiente.
   */
  const handleSelectBarrio = (selectedBarrioName: string) => {
    onChangeBarrio(selectedBarrioName);

    const foundBarrioInfo = MONTERIA_BARRIOS_LIST.find((b) => b.name === selectedBarrioName);
    if (foundBarrioInfo) {
      onChangeComuna(foundBarrioInfo.comuna);
    }
  };

  return (
    <div className="form-section-block">
      <div className="form-section-header">
        <span className="section-badge-num">7</span>
        <div>
          <h3 className="section-title">Ubicación Territorial en Montería</h3>
          <p className="section-subtitle">
            Seleccione primero su barrio o urbanización de residencia en Montería.
          </p>
        </div>
      </div>

      <div className="form-grid-fields">
        {/* ==========================================================================
           1. BARRIO DE RESIDENCIA EN MONTERÍA (APARECE PRIMERO)
           ========================================================================== */}
        <div className="form-group">
          <label className="form-label-text" htmlFor="barrio-searchable-select">
            Barrio o Urbanización de residencia <span className="req-star">*</span>
          </label>
          <span className="form-helper-text">
            Escriba para buscar y seleccione su barrio oficial de Montería:
          </span>
          <SearchableSelect
            id="barrio-searchable-select"
            options={barrioNames}
            value={barrio}
            onSelect={handleSelectBarrio}
            placeholder="Escriba para buscar su barrio (Ej: El Recreo, La Granja, Mogambo...)"
            required
          />
        </div>

        {/* ==========================================================================
           2. COMUNA DEL MUNICIPIO DE MONTERÍA (SE ASIGNA AUTOMÁTICAMENTE SEGÚN EL BARRIO)
           ========================================================================== */}
        <div className="form-group">
          <label className="form-label-text" htmlFor="comuna-select">
            7.1. Comuna del municipio de Montería <span className="req-star">*</span>
          </label>
          <span className="form-helper-text">
            Se asigna automáticamente según el barrio seleccionado (o puede modificarla):
          </span>
          <select
            id="comuna-select"
            value={comuna}
            onChange={(e) => onChangeComuna(e.target.value as ComunaOption)}
            className="clean-input clean-select"
            required
          >
            <option value="">(Seleccione Comuna)</option>
            {REGISTRATION_CATALOGS.comunas.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {comuna && (
            <span className="comuna-auto-badge">
              Comuna identificada: <strong>{comuna}</strong>
            </span>
          )}
        </div>

        {/* ==========================================================================
           3. ZONA (URBANA / RURAL)
           ========================================================================== */}
        <div className="form-group">
          <label className="form-label-text">
            7.2. Zona territorial <span className="req-star">*</span>
          </label>
          <div className="radio-tiles-grid radio-tiles-grid--2col">
            {REGISTRATION_CATALOGS.zones.map((option) => (
              <label
                key={option}
                className={`radio-tile ${zone === option ? 'is-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="zone"
                  value={option}
                  checked={zone === option}
                  onChange={() => onChangeZone(option)}
                  required
                />
                <span className="tile-text">Zona {option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
