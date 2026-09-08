/**
 * Tipos de TypeScript y Catálogos Oficiales para el Formulario de Registro de Asistentes.
 * Cumple con la arquitectura SOLID (Responsabilidad Única) y estándares de documentación en español.
 */

/**
 * Rangos de edad oficiales (Sección 4.1)
 */
export type AgeRangeOption =
  | '18 a 28 años'
  | '29 a 40 años'
  | '41 a 59 años'
  | '60 a 69 años'
  | '70 años o más';

/**
 * Opciones de identidad de género (Sección 4.2)
 */
export type GenderIdentityOption =
  | 'Masculino'
  | 'Femenino'
  | 'OSIGD (orientaciones Sexuales e identidades de género diversas)'
  | 'Prefiero no responder';

/**
 * Comunas de Montería (Sección 7.1)
 */
export type ComunaOption =
  | 'Comuna 1'
  | 'Comuna 2'
  | 'Comuna 3'
  | 'Comuna 4'
  | 'Comuna 5'
  | 'Comuna 6'
  | 'Comuna 7'
  | 'Comuna 8'
  | 'Comuna 9'
  | 'No aplica';

/**
 * Zonas territoriales (Sección 7.2)
 */
export type ZoneOption = 'Urbana' | 'Rural';

/**
 * Comunidades o grupos poblacionales (Sección 8.1)
 */
export type PopulationGroupOption =
  | 'Comunidades indígenas'
  | 'NARP'
  | 'Pueblos gitanos (ROM)'
  | 'Ninguno';

/**
 * Grupos sociales o sujetos de especial protección (Sección 8.2)
 */
export type SocialGroupOption =
  | 'Víctima del conflicto armado'
  | 'Mujer'
  | 'Persona con discapacidad'
  | 'Persona con orientación sexual o identidad de género diversa'
  | 'Población campesina'
  | 'Persona adulta mayor'
  | 'Ninguno'
  | 'Otros';

/**
 * Respuesta a términos de participación (Sección 16)
 */
export type TermsAcceptanceOption = 'SI' | 'NO';

/**
 * Estructura de datos completa del asistente a la jornada Ronda Vive.
 */
export interface RegistrationFormData {
  /** Nombre completo del asistente */
  fullName: string;
  /** Número de teléfono celular oficial */
  phone: string;
  /** Correo electrónico activo */
  email: string;

  /** 4.1 Rango de edad */
  ageRange: AgeRangeOption | '';
  /** 4.2 Identidad de género */
  genderIdentity: GenderIdentityOption | '';
  /** 4.3 ¿Nació en Montería? */
  bornInMonteria: boolean;
  /** 4.3 Municipio y departamento fijo de nacimiento (si no nació en Montería) */
  birthLocation: string;
  /** Asistencia en compañía de niños/as */
  attendedWithChildren: boolean;
  /** Cantidad de niños (1 a 10) si attendedWithChildren es true */
  childrenCount: number;

  /** 7.1 Comuna del municipio de Montería */
  comuna: ComunaOption | '';
  /** Barrio o urbanización de residencia en Montería */
  barrio: string;
  /** 7.2 Zona (Urbana / Rural) */
  zone: ZoneOption | '';

  /** 8.1 Comunidad o grupo poblacional */
  populationGroup: PopulationGroupOption | '';
  /** 8.2 Grupo social o sujeto de especial protección */
  socialGroup: SocialGroupOption | '';
  /** Especificación libre si el grupo social es 'Otros' */
  otherSocialGroupSpec?: string;

  /** Autorización de tratamiento de datos (Habeas Data) */
  acceptedHabeasData: boolean;
  /** Sección 16: Aceptación del Manual del Portafolio de Estímulos 2026 */
  acceptedTermsAndConditions: TermsAcceptanceOption | '';
}

/**
 * Catálogo constante de opciones de formulario (Principio Open/Closed - OCP).
 */
export const REGISTRATION_CATALOGS = {
  ageRanges: [
    '18 a 28 años',
    '29 a 40 años',
    '41 a 59 años',
    '60 a 69 años',
    '70 años o más',
  ] as AgeRangeOption[],

  genderIdentities: [
    'Masculino',
    'Femenino',
    'OSIGD (orientaciones Sexuales e identidades de género diversas)',
    'Prefiero no responder',
  ] as GenderIdentityOption[],

  comunas: [
    'Comuna 1',
    'Comuna 2',
    'Comuna 3',
    'Comuna 4',
    'Comuna 5',
    'Comuna 6',
    'Comuna 7',
    'Comuna 8',
    'Comuna 9',
    'No aplica',
  ] as ComunaOption[],

  zones: ['Urbana', 'Rural'] as ZoneOption[],

  populationGroups: [
    'Comunidades indígenas',
    'NARP',
    'Pueblos gitanos (ROM)',
    'Ninguno',
  ] as PopulationGroupOption[],

  socialGroups: [
    'Víctima del conflicto armado',
    'Mujer',
    'Persona con discapacidad',
    'Persona con orientación sexual o identidad de género diversa',
    'Población campesina',
    'Persona adulta mayor',
    'Ninguno',
    'Otros',
  ] as SocialGroupOption[],
};

/**
 * Mapa de Comunas y Barrios de Montería para autocompletado y asignación rápida.
 */
export const MONTERIA_COMUNAS_AND_BARRIOS: Record<ComunaOption, string[]> = {
  'Comuna 1': [
    'El Dorado',
    'El Poblado',
    'Rancho Grande',
    'La Palma',
    'Mi Ranchito',
    'Nuevo Horizonte',
    'El Campano',
    'La Ribera',
    'República de Panamá',
    'El Ébano',
    'Villa Nazaret',
    'Jerusalem',
    'Nueva Esperanza',
    'La Navarra',
    'Betancí',
    'El Níspero',
    'Los Colores',
  ],
  'Comuna 2': [
    'La Julia',
    'La Granja',
    'Balboa',
    'San Martín',
    'San José',
    'Campo Alegre',
    'El Carmen',
    'Los Laureles',
    'Sevilla',
    'San Cayetano',
    'Los Mangos',
  ],
  'Comuna 3': [
    'Centro',
    'Chuchurubí',
    'Obrero',
    'La Coquerita',
    'Sucre',
    'La Ceiba',
    'Urbanización Montería Moderno',
    'Pasatiempo',
    'La Trinidad',
  ],
  'Comuna 4': [
    'Mogambo',
    'P5',
    'Edmundo López',
    'Furatena',
    'Galilea',
    'Panzenú',
    'Boston',
    'Colina Real',
    'Damasco',
    'Dos de Septiembre',
    'El Paraíso',
    'El Prado',
    'La Candelaria',
    'Las Américas',
    'Los Araujos',
    'Pablo VI',
    'Paz del Río',
    'Robinson Pitalúa',
    'Santa Rosa',
    'Villa Margarita',
  ],
  'Comuna 5': [
    'Primero de Mayo',
    'Cantaclaro',
    'El Salvador',
    'Villa Caribe',
    'Villa Melisa',
    'El Recuerdo',
    'Los Recuerdos',
    'La Pradera',
    'Villarreal',
  ],
  'Comuna 6': [
    'Costa de Oro',
    'Micaribe',
    'Urbanización La Floresta',
    'Tacasuán',
    'Urbanización Los Ángeles',
    'Urbanización Santa Lucía',
    'Urbanización Sevilla',
  ],
  'Comuna 7': [
    'Sucre',
    'Industrial',
    'Buenavista',
    'Bari',
    'Urbanización El Recreo Norte',
    'Urbanización Universidad',
  ],
  'Comuna 8': [
    'El Recreo',
    'La Castellana',
    'Monteverde',
    'Versalles',
    'El Mora',
    'La Floresta',
    'Los Alcázares',
    'Los Robles del Norte',
    'Villa Cielo',
    'San Francisco',
    'Bonanza',
    'Villa Fátima',
  ],
  'Comuna 9': [
    'Micaribe Norte',
    'Urbanización Camilo Torres',
    'Mocari',
    'Camilo Torres',
    'Urbanización Los Garzones',
    'Las Viñas',
    'Bosques de Mocarí',
    'Urbanización Comfacor',
  ],
  'No aplica': [],
};

/**
 * Lista estandarizada de Municipios y Departamentos de Colombia para opción fija de nacimiento.
 */
export const COLOMBIAN_LOCATIONS: string[] = [
  'Lorica (Córdoba)',
  'Cereté (Córdoba)',
  'Sahagún (Córdoba)',
  'Planeta Rica (Córdoba)',
  'Montelíbano (Córdoba)',
  'Tierralta (Córdoba)',
  'Ciénaga de Oro (Córdoba)',
  'Chinú (Córdoba)',
  'San Pelayo (Córdoba)',
  'Cotorra (Córdoba)',
  'Moñitos (Córdoba)',
  'Puerto Escondido (Córdoba)',
  'San Bernardo del Viento (Córdoba)',
  'San Antero (Córdoba)',
  'Valencia (Córdoba)',
  'Pueblo Nuevo (Córdoba)',
  'Ayapel (Córdoba)',
  'Medellín (Antioquia)',
  'Bogotá, D.C.',
  'Cali (Valle del Cauca)',
  'Barranquilla (Atlántico)',
  'Cartagena (Bolívar)',
  'Bucaramanga (Santander)',
  'Cúcuta (Norte de Santander)',
  'Santa Marta (Magdalena)',
  'Pereira (Risaralda)',
  'Manizales (Caldas)',
  'Ibagué (Tolima)',
  'Villavicencio (Meta)',
  'Pasto (Nariño)',
  'Neiva (Huila)',
  'Armenia (Quindío)',
  'Popayán (Cauca)',
  'Sincelejo (Sucre)',
  'Valledupar (Cesar)',
  'Riohacha (La Guajira)',
  'Tunja (Boyacá)',
  'Florencia (Caquetá)',
  'Yopal (Casanare)',
  'Quibdó (Chocó)',
  'San Andrés (San Andrés y Providencia)',
  'Apartadó (Antioquia)',
  'Turbo (Antioquia)',
  'Caucasia (Antioquia)',
  'Bello (Antioquia)',
  'Itagüí (Antioquia)',
  'Envigado (Antioquia)',
  'Soledad (Atlántico)',
  'Magangué (Bolívar)',
  'Palmira (Valle del Cauca)',
  'Buenaventura (Valle del Cauca)',
  'Tuluá (Valle del Cauca)',
  'Otro Municipio / Departamento de Colombia',
];
