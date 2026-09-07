/**
 * Importaciones de React y Next.js.
 * - Suspense: Manejo del límite de hidratación para componentes que leen parámetros de búsqueda.
 * - HeaderNav: Encabezado institucional compacto.
 * - Footer: Pie de página institucional.
 * - RegisterFormClient: Componente cliente con el flujo interactivo de 2 pasos.
 */
import { Suspense } from 'react';
import HeaderNav from '../../components/HeaderNav';
import Footer from '../../components/Footer';
import RegisterFormClient from '../../components/RegisterFormClient';

/**
 * Tipos de parámetros de búsqueda (searchParams) para la página de registro.
 */
type RegisterPageProps = {
  searchParams?: Promise<{
    event?: string;
    code?: string;
  }>;
};

/**
 * Página de Registro de Asistencia (/register)
 * Implementa el flujo interactivo de 2 pasos:
 * 1. Validación e ingreso del código de asistencia / QR.
 * 2. Formulario de captura de datos del ciudadano.
 */
export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = (await searchParams) ?? {};
  const eventId = params.event ?? 'RV-150926';
  const qrCode = params.code ?? 'RV-150926';

  return (
    <div className="home-page-container">
      {/* Encabezado institucional sobrio */}
      <HeaderNav />

      <main className="main-content-flow page page-narrow">
        <Suspense fallback={<div className="clean-hero">Cargando formulario...</div>}>
          <RegisterFormClient initialCode={qrCode} initialEvent={eventId} />
        </Suspense>
      </main>

      {/* Pie de página institucional */}
      <Footer />
    </div>
  );
}
