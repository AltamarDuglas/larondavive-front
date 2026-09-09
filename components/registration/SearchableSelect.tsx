'use client';

/**
 * Componente SearchableSelect (Buscador y Selección Fija Obligatoria).
 * Cumple el requerimiento del usuario: el usuario escribe ÚNICAMENTE para buscar entre las opciones
 * existentes y DEBE seleccionar una de la lista (no escribir valores arbitrarios).
 */
import React, { useState, useRef, useEffect } from 'react';

/**
 * Propiedades del componente SearchableSelect
 */
export interface SearchableSelectProps {
  /** Identificador único del input */
  id?: string;
  /** Etiqueta descriptiva del campo */
  label?: string;
  /** Texto de ayuda / placeholder */
  placeholder?: string;
  /** Lista completa de opciones disponibles para seleccionar */
  options: string[];
  /** Valor actualmente seleccionado */
  value: string;
  /** Función que se ejecuta al seleccionar una opción de la lista */
  onSelect: (option: string) => void;
  /** Indica si el campo es obligatorio */
  required?: boolean;
}

export default function SearchableSelect({
  id,
  placeholder = 'Escriba para buscar y seleccione una opción...',
  options,
  value,
  onSelect,
  required = false,
}: SearchableSelectProps) {
  const [query, setQuery] = useState<string>(value);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sincronizar el texto del input cuando cambie el valor externo
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Cerrar el panel al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Si el usuario escribió un texto que no coincide exactamente con ninguna opción, restaurar la opción válida previa
        if (value && query !== value) {
          setQuery(value);
        } else if (!value) {
          setQuery('');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [value, query]);

  // Filtrar las opciones según el texto buscado
  const filteredOptions = query.trim()
    ? options.filter((opt) => opt.toLowerCase().includes(query.toLowerCase())).slice(0, 40)
    : options.slice(0, 40);

  const handleOptionClick = (option: string) => {
    setQuery(option);
    onSelect(option);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setQuery(text);
    setIsOpen(true);
    // Si borra el texto por completo, limpiar la selección previa
    if (text.trim() === '') {
      onSelect('');
    }
  };

  return (
    <div className="searchable-select-container" ref={containerRef}>
      <div className="searchable-input-wrapper">
        <input
          id={id}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="clean-input searchable-input"
          required={required}
          autoComplete="off"
        />
        <span className="searchable-icon" onClick={() => setIsOpen(!isOpen)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
      </div>

      {/* Lista desplegable interactiva */}
      {isOpen && (
        <ul className="searchable-dropdown-list" role="listbox">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`searchable-dropdown-item ${value === option ? 'is-selected' : ''}`}
                role="option"
                aria-selected={value === option}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="searchable-dropdown-empty">
              No se encontraron coincidencias. Por favor seleccione de la lista.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
