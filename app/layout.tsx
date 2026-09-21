import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ronda Vive | Jornada, fotos y comunidad',
  description: 'Plataforma digital para registro por QR, album colectivo, progreso y panel administrativo.'
};

/**
 * Configuración de Viewport Mobile-First para bloquear zoom por pellizco (pinch-to-zoom)
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
