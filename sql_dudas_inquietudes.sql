-- ============================================================================
-- SCRIPT SQL: TABLA DE DUDAS E INQUIETUDES (RONDA VIVE - ALCALDÍA DE MONTERÍA)
-- Ejecutar en el SQL Editor de Supabase (Dashboard -> SQL Editor -> New Query)
-- ============================================================================

-- 1. Habilitar extensión UUID (si no estuviese habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear tabla pública de Dudas e Inquietudes Ciudadanas
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

-- 3. Índices de rendimiento para búsqueda rápida por radicado, fecha, contacto y estado
CREATE INDEX IF NOT EXISTS idx_dudas_created_at ON public.dudas_inquietudes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dudas_correo ON public.dudas_inquietudes(correo);
CREATE INDEX IF NOT EXISTS idx_dudas_telefono ON public.dudas_inquietudes(telefono);
CREATE INDEX IF NOT EXISTS idx_dudas_estado ON public.dudas_inquietudes(estado);
CREATE INDEX IF NOT EXISTS idx_dudas_radicado ON public.dudas_inquietudes(radicado);

-- 4. Habilitar Seguridad a Nivel de Fila (Row Level Security - RLS)
ALTER TABLE public.dudas_inquietudes ENABLE ROW LEVEL SECURITY;

-- 5. Políticas de Acceso (Permitir inserción pública desde el celular escaneando el QR)
DROP POLICY IF EXISTS "Permitir envio publico de dudas e inquietudes" ON public.dudas_inquietudes;
CREATE POLICY "Permitir envio publico de dudas e inquietudes" 
ON public.dudas_inquietudes 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura de dudas e inquietudes" ON public.dudas_inquietudes;
CREATE POLICY "Permitir lectura de dudas e inquietudes" 
ON public.dudas_inquietudes 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Permitir actualizacion de dudas e inquietudes" ON public.dudas_inquietudes;
CREATE POLICY "Permitir actualizacion de dudas e inquietudes" 
ON public.dudas_inquietudes 
FOR UPDATE 
USING (true);

-- 6. Registro de prueba inicial opcional
INSERT INTO public.dudas_inquietudes (radicado, nombre, telefono, correo, duda_inquietud, consentimiento, tipo_consulta, estado)
VALUES
    ('DI-260901-1001', 'María Camila Gómez', '3001234567', 'maria.gomez@ejemplo.com', '¿Cómo puedo postular mi agrupación de danza folclórica para la próxima jornada?', true, 'Duda / Inquietud', 'pendiente')
ON CONFLICT (radicado) DO NOTHING;
