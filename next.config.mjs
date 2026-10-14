/**
 * Configuración maestra de Next.js para la plataforma La Ronda Vive.
 * 
 * DECISIÓN DE ARQUITECTURA DE ENRUTAMIENTO:
 * La plataforma ahora opera bajo el dominio institucional https://www.laculturavive.site/
 * y se aloja formalmente bajo la subruta y basePath '/larondavive' (https://www.laculturavive.site/larondavive).
 * 
 * - basePath: '/larondavive' prefija automáticamente todas las rutas, assets y enlaces generados por Next.js.
 * - redirects: Asegura que cualquier acceso a la raíz (/) o rutas directas sin prefijo sean redirigidos
 *   automáticamente hacia /larondavive con código HTTP temporal para no romper enlaces previos.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Prefijo base para alojar la aplicación bajo /larondavive
  basePath: '/larondavive',
  // Redirecciones automáticas para accesos en la raíz o rutas directas sin el prefijo
  async redirects() {
    return [
      {
        source: '/',
        destination: '/larondavive',
        basePath: false,
        permanent: false,
      },
      {
        source: '/register',
        destination: '/larondavive/register',
        basePath: false,
        permanent: false,
      },
      {
        source: '/admin',
        destination: '/larondavive/admin',
        basePath: false,
        permanent: false,
      },
      {
        source: '/dudas',
        destination: '/larondavive/dudas',
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

