'use client';

/**
 * Importaciones de React y Next.js.
 */
import { useEffect, useState } from 'react';
import HeaderNav from '../../components/HeaderNav';
import Footer from '../../components/Footer';

/**
 * Importación de utilidades, exportación a PDF/Excel y clientes de Supabase.
 */
import {
  getAdminMetrics,
  getAdminSession,
  signInAdmin,
  signOutAdmin,
  exportToExcel,
  exportToPDF,
  isSupabaseConfigured,
  JornadaRecord,
  AsistenteRecord,
} from '../../lib/supabaseClient';

/**
 * Importación de modales administrativos.
 */
import AdminJornadaModal from '../../components/admin/AdminJornadaModal';
import AdminQrModal from '../../components/admin/AdminQrModal';

/**
 * Componente principal del Panel de Administración (/admin)
 * Estética institucional sobria (Sin emojis, usando íconos vectoriales SVG)
 * Analítica rica: Edad, Género, Zona, Grupos Sociales, Ranking Top Barrios y Exportación a PDF/Excel.
 */
export default function AdminPage() {
  // Estado de autenticación del administrador
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Estados del panel de control
  const [activeTab, setActiveTab] = useState<'analytics' | 'jornadas' | 'asistentes'>('analytics');
  const [jornadas, setJornadas] = useState<JornadaRecord[]>([]);
  const [asistentes, setAsistentes] = useState<AsistenteRecord[]>([]);
  const [ageBreakdown, setAgeBreakdown] = useState<Record<string, number>>({});
  const [genderBreakdown, setGenderBreakdown] = useState<Record<string, number>>({});
  const [zoneBreakdown, setZoneBreakdown] = useState<Record<string, number>>({});
  const [socialGroupCounts, setSocialGroupCounts] = useState<Record<string, number>>({});
  const [topBarrios, setTopBarrios] = useState<{ name: string; count: number }[]>([]);

  const [metricsSummary, setMetricsSummary] = useState({
    totalCiudadanos: 0,
    asistenciasAcumuladas: 0,
    confirmacionesQr: '100%',
    tasaRetorno: '0%',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Estados de modales
  const [isJornadaModalOpen, setIsJornadaModalOpen] = useState<boolean>(false);
  const [selectedQrJornada, setSelectedQrJornada] = useState<JornadaRecord | null>(null);

  // Estados de búsqueda y filtrado
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedComunaFilter, setSelectedComunaFilter] = useState<string>('TODAS');

  /**
   * Carga de sesión inicial y datos de Supabase
   */
  useEffect(() => {
    const hasSession = getAdminSession();
    if (hasSession) {
      setIsAuthenticated(true);
      loadRealSupabaseData();
    }
  }, []);

  /**
   * Carga exclusiva de datos 100% reales desde Supabase PostgreSQL
   */
  const loadRealSupabaseData = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminMetrics();
      setJornadas(data.jornadas);
      setAsistentes(data.asistentes);
      setAgeBreakdown(data.ageBreakdown);
      setGenderBreakdown(data.genderBreakdown);
      setZoneBreakdown(data.zoneBreakdown);
      setTopBarrios(data.topBarrios);
      setSocialGroupCounts(data.socialGroupCounts);

      setMetricsSummary({
        totalCiudadanos: data.totalCiudadanos,
        asistenciasAcumuladas: data.asistenciasAcumuladas,
        confirmacionesQr: data.confirmacionesQr,
        tasaRetorno: data.tasaRetorno,
      });
    } catch {
      // Ignorar errores
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejador del inicio de sesión institucional
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!emailInput.trim() || !passwordInput.trim()) {
      setLoginError('Por favor ingresa correo institucional y contraseña.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await signInAdmin(emailInput, passwordInput);
      if (res.success) {
        setIsAuthenticated(true);
        loadRealSupabaseData();
      } else {
        setLoginError(res.error || 'Credenciales no autorizadas.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  /**
   * Manejador del cierre de sesión
   */
  const handleLogout = async () => {
    await signOutAdmin();
    setIsAuthenticated(false);
  };

  /**
   * Manejador de creación de jornada
   */
  const handleJornadaCreated = (newJornada: JornadaRecord) => {
    setJornadas((prev) => [newJornada, ...prev]);
    loadRealSupabaseData();
  };

  /**
   * Filtrado dinámico de asistentes
   */
  const filteredAsistentes = asistentes.filter((item) => {
    const matchesQuery =
      !searchQuery.trim() ||
      item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barrio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesComuna =
      selectedComunaFilter === 'TODAS' || item.comuna === selectedComunaFilter;

    return matchesQuery && matchesComuna;
  });

  /**
   * Exportaciones a PDF, Excel y CSV
   */
  const handleExportPDF = () => {
    exportToPDF(asistentes, metricsSummary);
  };

  const handleExportExcel = () => {
    exportToExcel(asistentes);
  };

  const exportToCSV = () => {
    if (asistentes.length === 0) return;

    const headers = [
      'ID',
      'Nombre Completo',
      'Telefono',
      'Correo Electronico',
      'Rango de Edad',
      'Identidad de Genero',
      'Nacio en Monteria',
      'Lugar de Nacimiento',
      'Acompanamiento Infantil',
      'Cantidad Ninos',
      'Comuna',
      'Barrio',
      'Zona',
      'Grupo Poblacional',
      'Grupo Social',
      'Especificacion Grupo Social',
      'Acepto Habeas Data',
      'Acepto Terminos Seccion 16',
      'Fecha de Registro',
    ];

    const rows = asistentes.map((a) => [
      `"${a.id || ''}"`,
      `"${a.full_name}"`,
      `"${a.phone}"`,
      `"${a.email}"`,
      `"${a.age_range}"`,
      `"${a.gender_identity}"`,
      `"${a.born_in_monteria ? 'SI' : 'NO'}"`,
      `"${a.birth_location}"`,
      `"${a.attended_with_children ? 'SI' : 'NO'}"`,
      `"${a.children_count}"`,
      `"${a.comuna}"`,
      `"${a.barrio}"`,
      `"${a.zone}"`,
      `"${a.population_group}"`,
      `"${a.social_group}"`,
      `"${a.other_social_group_spec || ''}"`,
      `"${a.accepted_habeas_data ? 'SI' : 'NO'}"`,
      `"${a.accepted_terms}"`,
      `"${a.created_at || ''}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Reporte_Asistentes_RondaVive_Monteria_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="home-page-container">
      <HeaderNav />

      <main className="main-content-flow page">
        {!isAuthenticated ? (
          /* ==========================================================================
             VISTA 1: INICIO DE SESIÓN INSTITUCIONAL (REQUERIDO)
             ========================================================================== */
          <div className="admin-login-wrapper">
            <section className="form-step-card admin-login-card">
              <div className="admin-login-header">
                <span className="eyebrow">Alcaldía de Montería • Secretaría de Cultura</span>
                <h2>Acceso Administrativo Institucional</h2>
                <p className="lede">
                  Ingresa las credenciales autorizadas de funcionario para gestionar las jornadas y consultar la analítica en vivo de Supabase.
                </p>
              </div>

              {loginError && (
                <div className="form-error-alert" role="alert">
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="clean-form">
                <div className="form-group">
                  <label className="form-label-text" htmlFor="admin-email">
                    Correo Institucional / Usuario autorizable
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
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
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="clean-input"
                    required
                  />
                </div>

                <div className="form-actions" style={{ marginTop: '12px' }}>
                  <button
                    type="submit"
                    className="clean-btn clean-btn--primary clean-btn--lg"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? 'Verificando...' : 'Iniciar Sesión en el Panel'}
                  </button>
                </div>
              </form>
            </section>
          </div>
        ) : (
          /* ==========================================================================
             VISTA 2: PANEL DE CONTROL ADMINISTRATIVO (AUTENTICADO Y SOBRIO)
             ========================================================================== */
          <div className="admin-container">
            {/* Encabezado Principal del Panel */}
            <section className="admin-header-card">
              <div className="admin-header-content">
                <div className="admin-header-title">
                  <span className="eyebrow">Alcaldía de Montería • Secretaría de Cultura</span>
                  <h1>Panel de Control Institucional</h1>
                  <p className="lede">
                    Gestión de jornadas, caracterización ciudadana y analítica continua en la Calle 27 con Avenida Primera.
                  </p>
                </div>

                <div className="admin-status-pill-box" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={`connection-status-pill ${isSupabaseConfigured ? 'is-connected' : 'is-local'}`}>
                    {isSupabaseConfigured ? 'Conectado a Supabase' : 'Modo Local'}
                  </span>
                  <button type="button" className="btn-logout" onClick={handleLogout} title="Cerrar sesión">
                    Cerrar Sesión
                  </button>
                </div>
              </div>

              <div className="admin-header-actions">
                <button
                  type="button"
                  className="clean-btn clean-btn--primary"
                  onClick={() => setIsJornadaModalOpen(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Crear Nueva Jornada
                </button>
              </div>
            </section>

            {/* Tarjetas de Métricas Principales (KPIs Reales de Supabase) */}
            <section className="admin-metrics-row">
              <article className="admin-metric-card">
                <div className="metric-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <div className="metric-info">
                  <span className="metric-label">Ciudadanos Caracterizados</span>
                  <strong className="metric-value">
                    {metricsSummary.totalCiudadanos.toLocaleString('es-CO')}
                  </strong>
                </div>
              </article>

              <article className="admin-metric-card">
                <div className="metric-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                </div>
                <div className="metric-info">
                  <span className="metric-label">Asistencias Acumuladas</span>
                  <strong className="metric-value">
                    {metricsSummary.asistenciasAcumuladas.toLocaleString('es-CO')}
                  </strong>
                </div>
              </article>

              <article className="admin-metric-card">
                <div className="metric-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <div className="metric-info">
                  <span className="metric-label">Confirmación por QR</span>
                  <strong className="metric-value">{metricsSummary.confirmacionesQr}</strong>
                </div>
              </article>

              <article className="admin-metric-card">
                <div className="metric-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                  </svg>
                </div>
                <div className="metric-info">
                  <span className="metric-label">Tasa de Retorno Recurrente</span>
                  <strong className="metric-value">{metricsSummary.tasaRetorno}</strong>
                </div>
              </article>
            </section>

            {/* Navegación por Pestañas del Panel */}
            <div className="admin-tabs-bar">
              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'analytics' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analítica y Caracterización
              </button>
              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'jornadas' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('jornadas')}
              >
                Gestión de Jornadas ({jornadas.length})
              </button>
              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'asistentes' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('asistentes')}
              >
                Directorio de Asistentes ({asistentes.length})
              </button>
            </div>

            {/* PESTAÑA 1: ANALÍTICA AVANZADA Y CARACTERIZACIÓN DEMOGRÁFICA */}
            {activeTab === 'analytics' && (
              <section className="admin-tab-content">
                <div className="admin-card" style={{ marginBottom: '20px' }}>
                  <div className="card-header-flex">
                    <div>
                      <h3>Analítica y Caracterización Demográfica</h3>
                      <p className="card-desc">
                        Reporte institucional de indicadores, rangos de edad, género y sectores de Montería.
                      </p>
                    </div>
                    <div className="admin-header-actions">
                      <button
                        type="button"
                        className="clean-btn clean-btn--pdf"
                        onClick={handleExportPDF}
                        title="Generar y descargar Informe Ejecutivo de Analítica en PDF"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                        </svg>
                        Exportar PDF de Analítica
                      </button>
                    </div>
                  </div>
                </div>

                <div className="admin-grid-2">
                  {/* 1. RANGOS DE EDAD */}
                  <article className="admin-card">
                    <h3>Distribución por Rango de Edad</h3>
                    <p className="card-desc">Caracterización etaria de los asistentes caracterizados.</p>
                    <div className="chart-bar-group">
                      {Object.entries(ageBreakdown).map(([range, count]) => {
                        const total = asistentes.length || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div className="chart-bar-item" key={range}>
                            <div className="chart-bar-label">
                              <span>{range}</span>
                              <strong>{count} ({pct}%)</strong>
                            </div>
                            <div className="chart-bar-track">
                              <div className="chart-bar-fill fill-blue" style={{ width: `${Math.max(4, pct)}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>

                  {/* 2. GÉNERO Y ZONA */}
                  <article className="admin-card">
                    <h3>Identidad de Género y Zona Territorial</h3>
                    <p className="card-desc">Proporción por género y cobertura urbana vs rural.</p>

                    <div className="analytics-subblock">
                      <h4>Identidad de Género</h4>
                      <div className="chart-bar-group">
                        {Object.entries(genderBreakdown).map(([g, count]) => {
                          const total = asistentes.length || 1;
                          const pct = Math.round((count / total) * 100);
                          return (
                            <div className="chart-bar-item" key={g}>
                              <div className="chart-bar-label">
                                <span>{g}</span>
                                <strong>{count} ({pct}%)</strong>
                              </div>
                              <div className="chart-bar-track">
                                <div className="chart-bar-fill fill-red" style={{ width: `${Math.max(4, pct)}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="analytics-subblock" style={{ marginTop: '16px' }}>
                      <h4>Zona Territorial</h4>
                      <div className="chart-bar-group">
                        {Object.entries(zoneBreakdown).map(([z, count]) => {
                          const total = asistentes.length || 1;
                          const pct = Math.round((count / total) * 100);
                          return (
                            <div className="chart-bar-item" key={z}>
                              <div className="chart-bar-label">
                                <span>Zona {z}</span>
                                <strong>{count} ({pct}%)</strong>
                              </div>
                              <div className="chart-bar-track">
                                <div className="chart-bar-fill fill-dark" style={{ width: `${Math.max(4, pct)}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </article>
                </div>

                <div className="admin-grid-2" style={{ marginTop: '20px' }}>
                  {/* 3. TOP BARRIOS DE MONTERÍA */}
                  <article className="admin-card">
                    <h3>Top Barrios de Mayor Participación en Montería</h3>
                    <p className="card-desc">Ranking real de sectores urbanos con mayor concentración.</p>
                    <div className="chart-bar-group">
                      {topBarrios.length === 0 ? (
                        <div className="empty-state">No hay registros de barrios suficientes.</div>
                      ) : (
                        topBarrios.map((b, idx) => {
                          const max = topBarrios[0]?.count || 1;
                          const pct = Math.round((b.count / max) * 100);
                          return (
                            <div className="chart-bar-item" key={b.name}>
                              <div className="chart-bar-label">
                                <span>{idx + 1}. {b.name}</span>
                                <strong>{b.count} registros</strong>
                              </div>
                              <div className="chart-bar-track">
                                <div className="chart-bar-fill fill-blue" style={{ width: `${Math.max(4, pct)}%` }} />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </article>

                  {/* 4. GRUPOS DE PROTECCIÓN ESPECIAL */}
                  <article className="admin-card">
                    <h3>Grupos Sociales y Protección Especial</h3>
                    <p className="card-desc">Autorreconocimiento e inclusión de sectores priorizados.</p>
                    <div className="chart-bar-group">
                      {Object.entries(socialGroupCounts).length === 0 ? (
                        <div className="empty-state">No hay registros poblacionales.</div>
                      ) : (
                        Object.entries(socialGroupCounts).map(([sg, count]) => {
                          const total = asistentes.length || 1;
                          const pct = Math.round((count / total) * 100);
                          return (
                            <div className="chart-bar-item" key={sg}>
                              <div className="chart-bar-label">
                                <span>{sg}</span>
                                <strong>{count} ({pct}%)</strong>
                              </div>
                              <div className="chart-bar-track">
                                <div className="chart-bar-fill fill-red" style={{ width: `${Math.max(4, pct)}%` }} />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </article>
                </div>
              </section>
            )}

            {/* PESTAÑA 2: GESTIÓN DE JORNADAS Y GENERACIÓN QR */}
            {activeTab === 'jornadas' && (
              <section className="admin-tab-content">
                <div className="admin-card">
                  <div className="card-header-flex">
                    <div>
                      <h3>Jornadas de Ronda Vive Registradas</h3>
                      <p className="card-desc">
                        Códigos QR oficiales, fechas de ejecución y estado de actividad.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="clean-btn clean-btn--primary"
                      onClick={() => setIsJornadaModalOpen(true)}
                    >
                      Crear Jornada
                    </button>
                  </div>

                  <div className="table-wrapper">
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>Código QR</th>
                          <th>Título de la Jornada</th>
                          <th>Fecha</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jornadas.map((j) => (
                          <tr key={j.code}>
                            <td>
                              <strong className="code-tag">{j.code}</strong>
                            </td>
                            <td>{j.title}</td>
                            <td>{j.event_date}</td>
                            <td>
                              <span className={`status-badge status-${j.status}`}>
                                {j.status === 'activa'
                                  ? 'Activa'
                                  : j.status === 'programada'
                                  ? 'Programada'
                                  : 'Finalizada'}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn-table-action"
                                onClick={() => setSelectedQrJornada(j)}
                              >
                                Ver/Imprimir QR
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* PESTAÑA 3: DIRECTORIO DE ASISTENTES Y EXPORTACIÓN */}
            {activeTab === 'asistentes' && (
              <section className="admin-tab-content">
                <div className="admin-card">
                  <div className="card-header-flex">
                    <div>
                      <h3>Directorio General de Ciudadanos (Supabase)</h3>
                      <p className="card-desc">
                        Filtra y exporta los asistentes caracterizados en las jornadas de Ronda Vive.
                      </p>
                    </div>
                    <div className="admin-header-actions">
                      <button
                        type="button"
                        className="clean-btn clean-btn--excel"
                        onClick={handleExportExcel}
                      >
                        Descargar Excel (.xlsx)
                      </button>

                      <button
                        type="button"
                        className="clean-btn clean-btn--secondary"
                        onClick={exportToCSV}
                      >
                        Descargar CSV
                      </button>
                    </div>
                  </div>

                  {/* Barra de Filtros */}
                  <div className="table-filter-bar">
                    <div className="filter-item filter-search">
                      <input
                        type="text"
                        placeholder="Buscar por nombre, teléfono, correo o barrio..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="clean-input"
                      />
                    </div>

                    <div className="filter-item">
                      <select
                        value={selectedComunaFilter}
                        onChange={(e) => setSelectedComunaFilter(e.target.value)}
                        className="clean-input"
                      >
                        <option value="TODAS">Todas las Comunas</option>
                        <option value="Comuna 1">Comuna 1</option>
                        <option value="Comuna 2">Comuna 2</option>
                        <option value="Comuna 3">Comuna 3</option>
                        <option value="Comuna 4">Comuna 4</option>
                        <option value="Comuna 5">Comuna 5</option>
                        <option value="Comuna 6">Comuna 6</option>
                        <option value="Comuna 7">Comuna 7</option>
                        <option value="Comuna 8">Comuna 8</option>
                        <option value="Comuna 9">Comuna 9</option>
                      </select>
                    </div>
                  </div>

                  {/* Tabla de Resultados Reales */}
                  <div className="table-wrapper">
                    {isLoading ? (
                      <div className="loading-state">Cargando directorio de Supabase...</div>
                    ) : filteredAsistentes.length === 0 ? (
                      <div className="empty-state">
                        No hay asistentes registrados en Supabase que coincidan con la búsqueda.
                      </div>
                    ) : (
                      <table className="admin-data-table">
                        <thead>
                          <tr>
                            <th>Ciudadano / Nombre</th>
                            <th>Contacto</th>
                            <th>Ubicación</th>
                            <th>Edad / Género</th>
                            <th>Población</th>
                            <th>Términos</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAsistentes.map((a, i) => (
                            <tr key={a.id || i}>
                              <td>
                                <div className="cell-user">
                                  <strong>{a.full_name}</strong>
                                  <small>{a.born_in_monteria ? 'Nacido en Montería' : a.birth_location}</small>
                                </div>
                              </td>
                              <td>
                                <div className="cell-contact">
                                  <span>{a.phone}</span>
                                  <span>{a.email}</span>
                                </div>
                              </td>
                              <td>
                                <div className="cell-location">
                                  <strong>{a.barrio}</strong>
                                  <small>{a.comuna} ({a.zone})</small>
                                </div>
                              </td>
                              <td>
                                <div className="cell-demo">
                                  <span>{a.age_range}</span>
                                  <small>{a.gender_identity}</small>
                                </div>
                              </td>
                              <td>
                                <div className="cell-population">
                                  <span>{a.population_group}</span>
                                  <small>{a.social_group}</small>
                                </div>
                              </td>
                              <td>
                                <span className="legal-badge">Habeas Data</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* MODAL DE CREACIÓN DE JORNADA */}
            <AdminJornadaModal
              isOpen={isJornadaModalOpen}
              onClose={() => setIsJornadaModalOpen(false)}
              onJornadaCreated={handleJornadaCreated}
            />

            {/* MODAL GENERADOR Y DE IMPRESIÓN DE QR PENDÓN */}
            <AdminQrModal
              jornada={selectedQrJornada}
              isOpen={Boolean(selectedQrJornada)}
              onClose={() => setSelectedQrJornada(null)}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
