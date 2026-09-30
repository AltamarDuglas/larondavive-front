-- ============================================================================
-- ESQUEMA SQL OFICIAL PARA SUPABASE POSTGRESQL (RONDA VIVE PASS)
-- Alcaldía de Montería • Secretaría de Cultura
-- ============================================================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Jornadas Institucionales (Jornadas Calle 27 con Av. Primera)
CREATE TABLE IF NOT EXISTS public.jornadas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL DEFAULT 'Calle 27 con Avenida Primera, Montería',
    event_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'activa' CHECK (status IN ('activa', 'programada', 'finalizada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Asistentes Ciudadanos (Caracterización Sociodemográfica y Territorial)
CREATE TABLE IF NOT EXISTS public.asistentes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    age_range VARCHAR(50) NOT NULL,
    gender_identity VARCHAR(100) NOT NULL,
    born_in_monteria BOOLEAN NOT NULL DEFAULT true,
    birth_location VARCHAR(255) NOT NULL DEFAULT 'Montería (Córdoba)',
    attended_with_children BOOLEAN NOT NULL DEFAULT false,
    children_count INT NOT NULL DEFAULT 0,
    comuna VARCHAR(50) NOT NULL,
    barrio VARCHAR(255) NOT NULL,
    zone VARCHAR(50) NOT NULL DEFAULT 'Urbana',
    population_group VARCHAR(100) NOT NULL DEFAULT 'Ninguno',
    social_group VARCHAR(150) NOT NULL DEFAULT 'Ninguno',
    other_social_group_spec VARCHAR(255),
    accepted_habeas_data BOOLEAN NOT NULL DEFAULT true,
    accepted_terms VARCHAR(10) NOT NULL DEFAULT 'SI',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_asistente_phone_email UNIQUE (phone, email)
);

-- 4. Tabla de Registros de Asistencia por Jornada (Relación 1 a Muchos)
CREATE TABLE IF NOT EXISTS public.asistencias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jornada_code VARCHAR(50) NOT NULL REFERENCES public.jornadas(code) ON DELETE CASCADE ON UPDATE CASCADE,
    asistente_id UUID NOT NULL REFERENCES public.asistentes(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_asistente_jornada UNIQUE (jornada_code, asistente_id)
);

-- 5. Tabla de Dudas e Inquietudes Ciudadanas (Atención Ciudadana por Código QR)
CREATE TABLE IF NOT EXISTS public.dudas_inquietudes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    radicado VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    duda_inquietud TEXT NOT NULL,
    consentimiento BOOLEAN NOT NULL DEFAULT true,
    tipo_consulta VARCHAR(50) NOT NULL DEFAULT 'Duda / Inquietud' CHECK (tipo_consulta IN ('Duda / Inquietud', 'Sugerencia', 'Felicitación', 'Petición / Reclamo')),
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_revision', 'atendida')),
    respuesta_institucional TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ÍNDICES DE RENDIMIENTO PARA CONSULTAS Y REPORTES MUNICIPALES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_jornadas_code ON public.jornadas(code);
CREATE INDEX IF NOT EXISTS idx_asistentes_comuna ON public.asistentes(comuna);
CREATE INDEX IF NOT EXISTS idx_asistentes_barrio ON public.asistentes(barrio);
CREATE INDEX IF NOT EXISTS idx_asistentes_email ON public.asistentes(email);
CREATE INDEX IF NOT EXISTS idx_asistentes_phone ON public.asistentes(phone);
CREATE INDEX IF NOT EXISTS idx_asistencias_jornada ON public.asistencias(jornada_code);
CREATE INDEX IF NOT EXISTS idx_asistencias_asistente ON public.asistencias(asistente_id);
CREATE INDEX IF NOT EXISTS idx_dudas_created_at ON public.dudas_inquietudes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dudas_correo ON public.dudas_inquietudes(correo);
CREATE INDEX IF NOT EXISTS idx_dudas_telefono ON public.dudas_inquietudes(telefono);
CREATE INDEX IF NOT EXISTS idx_dudas_estado ON public.dudas_inquietudes(estado);
CREATE INDEX IF NOT EXISTS idx_dudas_radicado ON public.dudas_inquietudes(radicado);

-- ============================================================================
-- DATOS SEMILLA (JORNADAS OFICIALES Y DUDAS INICIALES)
-- ============================================================================
INSERT INTO public.jornadas (code, title, location, event_date, status)
VALUES 
    ('RV-150926', 'Jornada Ronda Vive Calle 27', 'Calle 27 con Avenida Primera, Montería', '2026-09-15', 'activa'),
    ('RV-220926', 'Jornada Ronda Vive Arte & Río', 'Calle 27 con Avenida Primera, Montería', '2026-09-22', 'programada'),
    ('RV-080926', 'Jornada Ronda Vive Tradición', 'Calle 27 con Avenida Primera, Montería', '2026-09-08', 'finalizada')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.dudas_inquietudes (radicado, nombre, telefono, correo, duda_inquietud, consentimiento, tipo_consulta, estado)
VALUES
    ('DI-260901-1001', 'María Camila Gómez', '3001234567', 'maria.gomez@ejemplo.com', '¿Cómo puedo postular mi agrupación de danza folclórica para la próxima jornada?', true, 'Duda / Inquietud', 'pendiente'),
    ('DI-260902-1002', 'Carlos Mario Restrepo', '3109876543', 'carlos.restrepo@ejemplo.com', 'Excelente organización. Sugiero ampliar la zona de sombra y puntos de hidratación para adultos mayores.', true, 'Sugerencia', 'atendida')
ON CONFLICT (radicado) DO NOTHING;

-- ============================================================================
-- SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- Permitir lectura y escritura anónima habilitada para registro fácil en campo
-- ============================================================================
ALTER TABLE public.jornadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asistentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dudas_inquietudes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de jornadas" ON public.jornadas FOR SELECT USING (true);
CREATE POLICY "Permitir insercion publica de jornadas" ON public.jornadas FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizacion publica de jornadas" ON public.jornadas FOR UPDATE USING (true);

CREATE POLICY "Permitir lectura de asistentes" ON public.asistentes FOR SELECT USING (true);
CREATE POLICY "Permitir insercion de asistentes" ON public.asistentes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualizacion de asistentes" ON public.asistentes FOR UPDATE USING (true);

CREATE POLICY "Permitir lectura de asistencias" ON public.asistencias FOR SELECT USING (true);
CREATE POLICY "Permitir insercion de asistencias" ON public.asistencias FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir envio publico de dudas e inquietudes" ON public.dudas_inquietudes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir lectura de dudas e inquietudes" ON public.dudas_inquietudes FOR SELECT USING (true);
CREATE POLICY "Permitir actualizacion de dudas e inquietudes" ON public.dudas_inquietudes FOR UPDATE USING (true);

