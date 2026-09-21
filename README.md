# La Ronda Vive — Plataforma Digital de Registro de Asistencia Ciudadana

**La Ronda Vive** es la plataforma web oficial desarrollada para la **Alcaldía de Montería** destinada al registro digital de asistencia por código QR y la captura segura de información de los asistentes que participan en las jornadas periódicas de **La Ronda Vive** en la **Calle 27 con Avenida Primera**.

> 🏢 **ENTREGA A TECNOLOGÍAS DE LA INFORMACIÓN (TI):**
> Para entregar este proyecto al Ingeniero de Sistemas de la Alcaldía de Montería y desplegarlo en los servidores internos / ERP de la institución (sin Vercel ni Supabase), consulta la **[`Guía Oficial de Entrega y Despliegue en Servidores de la Alcaldía`](file:///c:/Users/Hewlett-Packard/OneDrive/Desktop/Ronda%20vive/MANUAL_DESPLIEGUE_SERVIDORES_ALCALDIA.md)**.

---

## 🏛️ Visión General del Proyecto

El sistema reemplaza las planillas físicas manuales por una solución web minimalista, ágil y de alto impacto visual accesible desde cualquier dispositivo móvil:

- **Confirmación de Asistencia por QR:** Al escanear el código QR (`?code=...`), la aplicación redirige de una al Paso 2 del formulario.
- **Asistente Registrado / Recurrente:** Para ciudadanos con visitas previas guardadas en su navegador, el sistema despliega una tarjeta de bienvenida con su Nombre Completo, Celular y Correo, ofreciendo un botón de confirmación en 1 clic y un botón desplegable en acordeón para modificar sus datos sociodemográficos únicamente si lo desea.

- **Lenguaje Público y Cercano:** Textos de producción redactados 100% para los ciudadanos asistentes de Montería.
- **Reconocimiento en el Dispositivo:** Los ciudadanos no tienen que volver a escribir sus datos en visitas posteriores mediante almacenamiento seguro en `localStorage`.
- **Analítica para la Alcaldía de Montería:** Medición de asistencia total, registros por QR y tasa de retorno de participantes recurrentes.
- **Protección de Datos (Habeas Data):** Cumplimiento estricto con la normativa colombiana de tratamiento de información (Secretaría de Cultura de Montería).
- **Aceptación de Términos del Portafolio de Estímulos 2026:** Inclusión del Manual oficial y la declaración juramentada (Sección 16).

---

## 📝 Secciones Estandarizadas del Formulario de Asistente

1. **Canales de Comunicación (Sección 5):** Número de celular de contacto y correo electrónico activo para notificaciones institucionales.
2. **Información Sociodemográfica (Sección 4):**
   - **4.1 Rango de Edad:** `18 a 28 años`, `29 a 40 años`, `41 a 59 años`, `60 a 69 años`, `70 años o más`.
   - **4.2 Identidad de Género:** `Masculino`, `Femenino`, `OSIGD`, `Prefiero no responder`.
   - **4.3 Lugar de Nacimiento:** Pregunta si nació en Montería. En caso negativo, selector con búsqueda estandarizada de todos los 1,100+ municipios y 32 departamentos de Colombia (`ALL_COLOMBIAN_MUNICIPALITIES`) mediante el componente `SearchableSelect` (donde escribir es exclusivamente para filtrar y el usuario selecciona de la lista fija).
   - **Acompañamiento Infantil:** Pregunta si asistió con niños/as y selector desplegable de cantidad (1 a 10).
3. **Ubicación Territorial en Montería (Sección 7):**
   - **Barrio o Urbanización (Aparece Primero):** Buscador interactivo `SearchableSelect` con el catálogo oficial de barrios de Montería (`MONTERIA_BARRIOS_LIST`).
   - **7.1 Comunas:** Inferencia y asignación automática de la `Comuna 1` a `Comuna 9` según el barrio seleccionado (con posibilidad de verificar/ajustar).
   - **7.2 Zona:** `Urbana` o `Rural`.

4. **Autorreconocimiento Poblacional (Sección 8):**
   - **8.1 Grupo Poblacional:** `Comunidades indígenas`, `NARP`, `Pueblos gitanos (ROM)`, `Ninguno`.
   - **8.2 Sujeto de Especial Protección:** `Víctima del conflicto armado`, `Mujer`, `Persona con discapacidad`, `Persona con orientación sexual/género diversa`, `Población campesina`, `Persona adulta mayor`, `Ninguno`, `Otros` (con campo libre para especificar).
5. **Autorizaciones Legales:**
   - **Habeas Data:** Autorización explícita para el tratamiento de datos personales por la Secretaría de Cultura de Montería.
   - **Sección 16:** Aceptación legal del Manual del Portafolio de Estímulos Montería 2026 y juramento de inhabilidades/REDAM mediante selector `SI` / `NO`.

---

## 🏗️ Arquitectura del Monorepo y Metodología SOLID

El proyecto está organizado como un **Monorepo** modular estructurado bajo los principios **SOLID**:

```text
ronda-vive/
├── apps/
│   ├── web/                     # Frontend Next.js 15 (React 19 + TypeScript + CSS Vanilla)
│   │   ├── app/                 # Rutas App Router (/register, /admin, page.tsx)
│   │   │   ├── globals.css      # Orquestador maestro de estilos CSS (SRP - Importa modulos)
│   │   │   ├── styles/          # Módulos CSS organizados por dominio según SOLID (SRP)
│   │   │   │   ├── tokens.css       # Variables globales, paleta de colores y resets
│   │   │   │   ├── intro.css        # Pantallas de bienvenida, carga y carrusel animado
│   │   │   │   ├── home.css         # Header, Hero cultural, tarjetas y footer
│   │   │   │   ├── registration.css # Formulario en 2 pasos, escáner QR, modal y términos
│   │   │   │   └── admin.css        # Dashboard admin, tablas, métricas y modal QR horizontal
│   │   │   └── page.tsx         # Pantalla principal integradora de componentes
│   │   ├── types/
│   │   │   └── registration.ts  # Tipos de TypeScript y catálogos estandarizados (SRP / OCP)
│   │   └── components/          # Componentes modulares con responsabilidad única (SRP)
│   │       ├── registration/    # Subcomponentes del Formulario de Registro
│   │       │   ├── SociodemographicSection.tsx      # Rango de edad, género, lugar de nacimiento y niños
│   │       │   ├── CommunicationSection.tsx         # Teléfono celular y correo electrónico
│   │       │   ├── TerritorialLocationSection.tsx   # Comunas 1-9, barrios y zona urbana/rural
│   │       │   ├── PopulationRecognitionSection.tsx # Grupos poblacionales y sujetos de protección
│   │       │   └── TermsAndPrivacySection.tsx       # Habeas Data y Aceptación de Términos (Sección 16)
│   │       ├── RegisterFormClient.tsx # Coordinador de flujo en 3 pasos, control de foco/scroll y ticket digital
│   │       ├── IntroAnimation.tsx  # Presentación Alcaldía de Montería -> Ronda Vive
│   │       ├── HeaderNav.tsx       # Encabezado ultralimpio e identidad unificada
│   │       ├── HeroSection.tsx     # Tarjeta principal de bienvenida y acceso al registro por QR
│   │       ├── CitizenFlow.tsx     # Flujo simple de 4 pasos para registrar asistencia
│   │       ├── DataPrivacyCard.tsx # Tarjeta sobre tratamiento seguro de información (Habeas Data)
│   │       ├── StatsSection.tsx    # Métricas de asistencia y tasa de retorno municipal
│   │       └── Footer.tsx          # Pie de página institucional y créditos
│   │
│   └── api/                     # Backend NestJS (Módulos de Auth, Usuarios, Asistencias)
│       └── prisma/              # Esquema de base de datos PostgreSQL
│
├── Propuesta de Plataforma Digital Ronda Vive.md
├── Requerimientos funcionales y no funcionales — Ronda Vive.md
└── docker-compose.yml           # Servicio local de PostgreSQL
```

---

### 🛡️ Manejo de Registros, Escáner QR de Cámara y Experiencia de Usuario

1. **Escáner de Código QR con Cámara (Paso 1):**
   - Incorpora la lectura en vivo desde la cámara del celular o computador utilizando la librería `html5-qrcode`.
   - Permite encuadrar el código QR impreso en los pendones oficiales, extrayendo el parámetro de jornada automáticamente y avanzando al Paso 2 si la jornada está activa.
2. **Formulario Limpio por Defecto (Sin Plantillas de Prueba):**
   - Todos los campos del formulario inician totalmente limpios (`''`), evitando la precarga obligatoria de datos viejos de prueba.
   - Si existen registros locales en el dispositivo, se habilita una opción discreta para elegir si se desea autocompletar o iniciar un *"Registro limpio para otro ciudadano"*.
3. **Validación de Existencia y Vigencia de Jornadas:**
   - **Jornada Inexistente:** Si el código escaneado o ingresado (ej: `RV-999999`) no existe, se bloquea el paso 2 con mensaje de alerta.
   - **Jornada Finalizada:** Si la jornada ya pasó o su estado es `'finalizada'` (ej: `RV-080926`), se impide el registro.
4. **Gestión de Estados de Jornadas desde Panel Admin (`/admin`):**
   - En la pestaña de Jornadas, el administrador puede cambiar el estado de cualquier jornada (`Activa`, `Programada`, `Finalizada`) mediante un selector interactivo.
   - El cambio se sincroniza en tiempo real en Supabase PostgreSQL y actualiza la vigencia inmediatamente en el formulario público.
5. **Diseño Ultra Limpio Institucional (Sin Emojis):**
   - Interfaz sobria acorde a la Alcaldía de Montería utilizando íconos SVG vectoriales limpios y badges descriptivos.

---

## 🚀 Guía de Instalación y Configuración Local

### 1. Requisitos Previos
- **Node.js** v18 o superior.
- **npm** v9 o superior.
- **Docker Desktop** (para PostgreSQL local).

### 2. Configuración de Variables de Entorno (Vercel & Local)
Copia el archivo de ejemplo a `.env` o `.env.local` en la raíz del proyecto:
```bash
cp .env.example .env.local
```

Para conectar con **Supabase** en **Vercel** o en local, agrega las siguientes variables de entorno:
```env
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key-publica"
```

### 3. Acceso Administrativo e Inicio de Sesión (`/admin`)
- **Ruta de Acceso:** `https://tu-dominio.com/admin` (o `http://localhost:3000/admin` en desarrollo)
- **Creación del Usuario Administrador en Producción (Supabase):**
  1. Ingresa a tu Dashboard de **[Supabase](https://supabase.com/dashboard)**.
  2. En el menú lateral ve a **Authentication** -> **Users**.
  3. Haz clic en **Add User** -> **Create User**.
  4. Ingresa el Correo Institucional (ej: `admin@monteria.gov.co`) y tu Contraseña Segura de Producción.
  5. Asegúrate de marcar **Auto Confirm User?** para activar el usuario inmediatamente.
- **Alternativa mediante Variables de Entorno (Vercel / Servidor):**
  Si prefieres definir un usuario administrativo directo, agrega en Vercel / `.env.local`:
  ```env
  NEXT_PUBLIC_ADMIN_EMAIL="admin@monteria.gov.co"
  NEXT_PUBLIC_ADMIN_PASSWORD="TuContraseñaSegura2026!"
  ```
- **Exportación:** Permite la descarga nativa de reportes en Microsoft Excel (`.xlsx`) y formato CSV.

### 4. Configuración de Supabase PostgreSQL
1. Abre tu proyecto en el Dashboard de [Supabase](https://supabase.com).
2. Ve al **SQL Editor**.
3. Ejecuta el contenido del archivo [`supabase_schema.sql`](file:///c:/Users/Hewlett-Packard/OneDrive/Desktop/Ronda%20vive/supabase_schema.sql) disponible en la raíz de este proyecto.

### 🗄️ Alternativa: PostgreSQL Independiente y Migración sin Supabase
Si deseas conectar el proyecto utilizando PostgreSQL independiente (Docker, VPS o nube gestionada como Neon/Railway/AWS) sin depender de Supabase:
- 🖥️ **Conexión Exclusiva desde el Frontend (`apps/web`):** Consulta la [`Guía de Conexión de Base de Datos para el Frontend`](file:///c:/Users/Hewlett-Packard/OneDrive/Desktop/Ronda%20vive/FRONTEND_DATABASE_GUIDE.md).
- 🗄️ **Migración Global de Arquitectura (Backend + BD):** Consulta la [`Guía General de Migración de Base de Datos PostgreSQL`](file:///c:/Users/Hewlett-Packard/OneDrive/Desktop/Ronda%20vive/DATABASE_MIGRATION_GUIDE.md).

### 5. Iniciar PostgreSQL con Docker (Opcional)
```bash
docker compose up -d
```

### 4. Instalación de Dependencias
```bash
npm install
```

### 5. Generar Cliente Prisma e Inicializar Base de Datos (API)
```bash
npm run db:generate
npm run prisma:seed --workspace @ronda-vive/api
```

### 6. Ejecutar Servidores en Desarrollo
- **Iniciar Frontend Web (Next.js):**
  ```bash
  npm run dev:web
  ```
  Disponible en `http://localhost:3000`.

- **Iniciar Backend API (NestJS):**
  ```bash
  npm run dev:api
  ```
  Disponible en `http://localhost:3001`.

---

## 📊 Panel Administrador Mobile-First y Analítica Completa con Gráficos

El Panel Administrador (`/admin`) adopta un enfoque **Mobile-First 100% responsivo**, optimizado para interacción táctil en teléfonos inteligentes, tabletas y computadores de escritorio.

### 🎯 Características Principales del Panel Administrador

1. **Selector de Filtro Dinámico por Jornada:**
   - Permite alternar en tiempo real entre la **Analítica Acumulada General** (Todas las jornadas) o los datos específicos de una **Jornada en Particular** (`RV-150926`, `RV-220926`, etc.).

2. **Edición de Nombres, Estado de Actividad y Eliminación de Jornadas:**
   - Permite al administrador editar el nombre oficial de cualquier jornada registrada directamente con guardado inmediato en Supabase y respaldo local.
   - El estado de la jornada (`activa`, `programada`, `finalizada`) es de control manual exclusivo por el administrador sin bloqueos automáticos por desfase horario.
   - Posibilidad de eliminar jornadas del sistema (`deleteJornada`), diferenciando de forma inmediata aquellas con 0 asistentes vs. jornadas con registros existentes mediante alertas de seguridad.

3. **UX Mobile-First de Jornadas en Lista Desplegable (Acordeón sin Scroll Horizontal):**
   - Sustituye la tabla ancha tradicional por un acordeón táctil optimizado para smartphones:
     - **Vista resumida:** Muestra únicamente el Código (`RV-...`), Nombre de la jornada, Badge de personas registradas (`X registrados` / `0 registrados`) y el Estado actual.
     - **Vista expandida (al hacer clic o tocar):** Despliega fecha del evento, lugar, edición del nombre, selector de estado, botón para generar el Pendón QR horizontal y botón de eliminación.

4. **Optimización Mobile-First y Bloqueo de Zoom por Pellizco:**
   - Configuración de `Viewport` (`userScalable: false`, `maximumScale: 1`) y CSS `touch-action: manipulation` para prevenir el zoom accidental al interactuar con botones o gráficos táctiles en smartphones.

5. **Cálculo Exacto del 100% en Barras Analíticas (Sin Falso Llenado Relativo):**
   - El llenado de cada barra (`AnalyticsBarChart.tsx`) representa el **porcentaje real sobre el total poblacional de referencia** (`pctOfTotal = Math.round((count / total) * 100)`).
   - Corrige el problema de escalas artificiales: una barra con la mayor cantidad de personas ya no se dibuja al 100% como si fuera el total de la población si no representa el total absoluto de asistentes.

6. **Componentes Visuales de Analítica Avanzada (SOLID / SRP / Sin Emojis):**
   - **`AnalyticsPieChart.tsx`**: Componente SVG interactivo para renderizado de Gráficos de Pastel o Dona con leyendas y porcentajes.
   - **`AnalyticsStatCard.tsx`**: Tarjetas métricas KPI con variaciones de color e íconos vectoriales SVG.
   - **`AnalyticsBarChart.tsx`**: Barras de llenado progresivo con cálculo real del 100% sobre el total de asistentes.
   - **`AdminJornadasTab.tsx`**: Acordeón interactivo mobile-first con conteo de registros y gestión de jornadas.
   - **`AdminJornadaModal.tsx`**: Creador táctil de jornadas con generación automática de códigos sugeridos.

7. **Modal Adaptativo del Pendón QR (`AdminQrModal.tsx`):**
   - Presentación mobile-first completamente responsiva: en dispositivos móviles se apila limpiamente de forma vertical eliminando cualquier desbordamiento o scroll horizontal.
   - En computadores despliega una vista institucional en dos columnas con cabecera de logos oficiales (`Alcaldía de Montería` y `La Ronda Vive`), código único resaltado, instrucciones de escaneo y botón para copiar el enlace directo.
   - Mantiene intacta la descarga e impresión en alta definición del PDF en formato horizontal (`Landscape A4`).

---

## 📋 Verificación de Código

Para verificar los tipos de TypeScript y linting en la aplicación web:
```bash
cd apps/web
npm run lint
```

---

## 📄 Estándar de Código

Todas las acciones, importaciones, decisiones de diseño y componentes están estrictamente **comentados en español** para facilitar el mantenimiento y la comprensión de cualquier desarrollador, sin importar su nivel previo de experiencia. Se trabaja bajo la **metodología SOLID** con código limpio, modular y organizado.




