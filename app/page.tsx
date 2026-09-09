'use client';

/**
 * Importaciones de React para coordinar el estado de la animación de inicio.
 */
import { useState } from 'react';

/**
 * Importación de los componentes sobrios estructurados bajo la metodología SOLID:
 * - IntroAnimation: Presentación secuencial sobria (Alcaldía de Montería -> La Ronda Vive).
 * - HeaderNav: Encabezado flotante con el sello de la Alcaldía de Montería.
 * - HeroSection: Banner principal centrado en el registro de asistencia por QR en Calle 27 con Av. Primera.
 * - CitizenFlow: Proceso directo de 4 pasos para el registro del ciudadano.
 * - DataPrivacyCard: Información transparente sobre la captura de datos (Nombre, Teléfono, Correo) y Habeas Data.
 * - StatsSection: Indicadores de asistencia, registros por QR y tasa de retorno ciudadana.
 * - Footer: Pie de página institucional de la Alcaldía de Montería.
 */
import IntroAnimation from '../components/IntroAnimation';
import HeaderNav from '../components/HeaderNav';
import HeroSection from '../components/HeroSection';
import CitizenFlow from '../components/CitizenFlow';
import DataPrivacyCard from '../components/DataPrivacyCard';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';

/**
 * Componente HomePage (Pantalla Principal)
 * Ensambla la estructura limpia y profesional de Ronda Vive.
 */
export default function HomePage() {
  // Estado numérico para reiniciar la animación de inicio a solicitud del usuario
  const [replayKey, setReplayKey] = useState<number>(0);

  /**
   * Manejador para reiniciar la presentación introductoria.
   */
  const handleReplayIntro = () => {
    setReplayKey((prev) => prev + 1);
  };

  return (
    <div className="home-page-container">
      {/* 1. Presentación introductoria (Alcaldía de Montería -> La Ronda Vive) */}
      <IntroAnimation replayKey={replayKey} />

      {/* 2. Barra de navegación institucional */}
      <HeaderNav onReplayIntro={handleReplayIntro} />

      {/* 3. Estructura principal de contenidos */}
      <main className="main-content-flow">
        {/* Banner principal con acceso directo al registro por QR */}
        <HeroSection />

        <div className="page-content-wrapper">
          {/* Flujo claro de 4 pasos para registrar la asistencia */}
          <CitizenFlow />

          {/* Transparencia en el tratamiento de información y datos personales */}
          <DataPrivacyCard />

          {/* Tablero de métricas de participación para la Alcaldía de Montería */}
          <StatsSection />
        </div>
      </main>

      {/* 4. Pie de página institucional */}
      <Footer />
    </div>
  );
}
