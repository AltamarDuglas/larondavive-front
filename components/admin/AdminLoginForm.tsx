"use client";

import { FormEvent } from "react";

interface AdminLoginFormProps {
  emailInput: string;
  passwordInput: string;
  loginError: string;
  isLoggingIn: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function AdminLoginForm({
  emailInput,
  passwordInput,
  loginError,
  isLoggingIn,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AdminLoginFormProps) {
  return (
    <div className="admin-login-wrapper">
      <section className="form-step-card admin-login-card">
        <div className="admin-login-header">
          <span className="eyebrow">
            Alcaldía de Montería • Secretaría de Cultura
          </span>
          <h2>Acceso Administrativo Institucional</h2>
          <p className="lede">
            Ingresa las credenciales autorizadas de funcionario para gestionar
            las jornadas y consultar la analítica en vivo de Supabase.
          </p>
        </div>

        {loginError && (
          <div className="form-error-alert" role="alert">
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="clean-form">
          <div className="form-group">
            <label className="form-label-text" htmlFor="admin-email">
              Correo Institucional / Usuario autorizable
            </label>
            <input
              id="admin-email"
              type="email"
              value={emailInput}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="admin@monteria.gov.co"
              className="clean-input"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label-text" htmlFor="admin-password">
              Contraseña de Seguridad
            </label>
            <input
              id="admin-password"
              type="password"
              value={passwordInput}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="••••••••••••"
              className="clean-input"
              required
            />
          </div>

          <div className="form-actions" style={{ marginTop: "12px" }}>
            <button
              type="submit"
              className="clean-btn clean-btn--primary clean-btn--lg"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Verificando..." : "Iniciar Sesión en el Panel"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
