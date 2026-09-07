import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ronda Vive Pass | Jornada, fotos y comunidad',
  description: 'Plataforma digital para registro por QR, album colectivo, progreso y panel administrativo.'
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
