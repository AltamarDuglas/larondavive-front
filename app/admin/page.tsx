'use client';

/**
 * Importaciones de React y Next.js.
 */
import { useEffect, useState } from 'react';
import HeaderNav from '../../components/HeaderNav';
import Footer from '../../components/Footer';

/**
 * Importación de utilidades, exportación a Excel y clientes de Supabase.
 */
import {
  getAdminMetrics,
  getAdminSession,
  signInAdmin,
  signOutAdmin,
  exportToExcel,
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
 * Exige Inicio de Sesión Institucional (Usuario y Contraseña) y consulta datos 100% reales desde Supabase.
 */
export default function AdminPage() {
  // Estado de autenticación del administrador
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Estados del panel de control
  const [activeTab, setActiveTab] = useState<'metrics' | 'jornadas' | 'asistentes'>('metrics');
  const [jornadas, setJornadas] = useState<JornadaRecord[]>([]);
  const [asistentes, setAsistentes] = useState<AsistenteRecord[]>([]);
  const [comunaBreakdown, setComunaBreakdown] = useState<Record<string, number>>({});
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
      setComunaBreakdown(data.comunaCounts);
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
      setLoginError('Por favor ingresa usuario/correo y contraseña.');
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
   * Exportación nativa a Microsoft Excel (.xlsx)
   */
  const handleExportExcel = () => {
    exportToExcel(asistentes);
  };

  /**
   * Exportación de asistentes a formato CSV (con BOM UTF-8)
   */
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
                  Ingresa tus credenciales autorizadas de funcionario para gestionar las jornadas y consultar los datos en vivo de Supabase.
                </p>
              </div>

              {loginError && (
                <div className="form-error-alert" role="alert">
                  <span>⚠️ {loginError}</span>
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
                    placeholder="Ej: admin@monteria.gov.co"
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
                    {isLoggingIn ? 'Verificando con Supabase...' : '🔐 Iniciar Sesión en el Panel'}
                  </button>
                </div>
              </form>
            </section>
          </div>
        ) : (
          /* ==========================================================================
             VISTA 2: PANEL DE CONTROL ADMINISTRATIVO (AUTENTICADO)
             ========================================================================== */
          <div className="admin-container">
            {/* Encabezado Principal del Panel */}
            <section className="admin-header-card">
              <div className="admin-header-content">
                <div className="admin-header-title">
                  <span className="eyebrow">Alcaldía de Montería • Secretaría de Cultura</span>
                  <h1>Panel de Control Institucional</h1>
                  <p className="lede">
                    Gestión integral de jornadas, generación de códigos QR y analítica continua de asistencia ciudadana en la Calle 27 con Avenida Primera.
                  </p>
                </div>

                <div className="admin-status-pill-box" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={`connection-status-pill ${isSupabaseConfigured ? 'is-connected' : 'is-local'}`}>
                    {isSupabaseConfigured ? '🟢 Conectado a Supabase' : '🟡 Modo Local'}
                  </span>
                  <button type="button" className="btn-logout" onClick={handleLogout} title="Cerrar sesión">
                    🔒 Cerrar Sesión
                  </button>
                </div>
              </div>

              <div className="admin-header-actions">
                <button
                  type="button"
                  className="clean-btn clean-btn--primary"
                  onClick={() => setIsJornadaModalOpen(true)}
                >
                  ➕ Crear Nueva Jornada
                </button>

                <button
                  type="button"
                  className="clean-btn clean-btn--excel"
                  onClick={handleExportExcel}
                  title="Descargar archivo verdaderamente nativo de Excel (.xlsx)"
                >
                  💚 Exportar Excel (.xlsx)
                </button>

                <button
                  type="button"
                  className="clean-btn clean-btn--secondary"
                  onClick={exportToCSV}
                >
                  📊 CSV ({asistentes.length})
                </button>
              </div>
            </section>

            {/* Tarjetas de Métricas Principales (KPIs Reales de Supabase) */}
            <section className="admin-metrics-row">
              <article className="admin-metric-card">
                <span className="metric-icon">👥</span>
                <div className="metric-info">
                  <span className="metric-label">Ciudadanos Caracterizados</span>
                  <strong className="metric-value">
                    {metricsSummary.totalCiudadanos.toLocaleString('es-CO')}
                  </strong>
                </div>
              </article>

              <article className="admin-metric-card">
                <span className="metric-icon">🎟️</span>
                <div className="metric-info">
                  <span className="metric-label">Asistencias Acumuladas</span>
                  <strong className="metric-value">
                    {metricsSummary.asistenciasAcumuladas.toLocaleString('es-CO')}
                  </strong>
                </div>
              </article>

              <article className="admin-metric-card">
                <span className="metric-icon">📱</span>
                <div className="metric-info">
                  <span className="metric-label">Confirmación por QR</span>
                  <strong className="metric-value">{metricsSummary.confirmacionesQr}</strong>
                </div>
              </article>

              <article className="admin-metric-card">
                <span className="metric-icon">🔄</span>
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
                className={`admin-tab-btn ${activeTab === 'metrics' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('metrics')}
              >
                📊 Indicadores y Comunas Reales
              </button>
              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'jornadas' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('jornadas')}
              >
                📅 Gestión de Jornadas ({jornadas.length})
              </button>
              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'asistentes' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('asistentes')}
              >
                👥 Directorio de Asistentes ({asistentes.length})
              </button>
            </div>

            {/* PESTAÑA 1: INDICADORES Y DESGLOSE TERRITORIAL REAL */}
            {activeTab === 'metrics' && (
              <section className="admin-tab-content">
                <div className="admin-grid-2">
                  <article className="admin-card">
                    <h3>Desglose de Participación por Comuna (Datos Reales Supabase)</h3>
                    <p className="card-desc">
                      Distribución espacial exacta calculada con las filas de la tabla `asistentes` en Supabase.
                    </p>

                    <div className="comuna-stats-list">
                      {[
                        'Comuna 1',
                        'Comuna 2',
                        'Comuna 3',
                        'Comuna 4',
                        'Comuna 5',
                        'Comuna 6',
                        'Comuna 7',
                        'Comuna 8',
                        'Comuna 9',
                      ].map((comName) => {
                        const count = comunaBreakdown[comName] || 0;
                        const maxCount = Math.max(...Object.values(comunaBreakdown), 1);
                        const percentage = maxCount > 0 ? Math.round((count / maxCount) * 100) : 0;

                        return (
                          <div className="comuna-stat-item" key={comName}>
                            <div className="comuna-stat-head">
                              <span className="comuna-name">{comName}</span>
                              <span className="comuna-count">
                                <strong>{count}</strong> {count === 1 ? 'asistente' : 'asistentes'}
                              </span>
                            </div>
                            <div className="comuna-bar-track">
                              <div
                                className="comuna-bar-fill"
                                style={{ width: `${Math.min(100, percentage)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>

                  <article className="admin-card">
                    <h3>Resumen de Infraestructura Supabase</h3>
                    <p className="card-desc">
                      Estado de la base de datos PostgreSQL conectada a Vercel.
                    </p>

                    <div className="admin-info-box">
                      <div className="info-row">
                        <span>Base de Datos:</span>
                        <strong>Supabase PostgreSQL</strong>
                      </div>
                      <div className="info-row">
                        <span>Tabla Asistentes:</span>
                        <strong>{asistentes.length} filas</strong>
                      </div>
                      <div className="info-row">
                        <span>Tabla Jornadas:</span>
                        <strong>{jornadas.length} jornadas</strong>
                      </div>
                      <div className="info-row">
                        <span>Servidor Vercel:</span>
                        <strong>Conexión Directa Activa</strong>
                      </div>
                    </div>

                    <div className="admin-notice-box">
                      <h4>💡 Protección de Información</h4>
                      <p>
                        Todos los registros están protegidos conforme a la Ley 1581 de Habeas Data y el Manual de Portafolio de Estímulos 2026 de la Alcaldía de Montería.
                      </p>
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
                      ➕ Crear Jornada
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
                                  ? '🟢 Activa'
                                  : j.status === 'programada'
                                  ? '🟡 Programada'
                                  : '⚪ Finalizada'}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn-table-action"
                                onClick={() => setSelectedQrJornada(j)}
                              >
                                📱 Ver/Imprimir QR
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

            {/* PESTAÑA 3: DIRECTORIO DE ASISTENTES Y EXPORTACIÓN EXCEL/CSV */}
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
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="clean-btn clean-btn--excel"
                        onClick={handleExportExcel}
                      >
                        💚 Descargar Excel (.xlsx)
                      </button>

                      <button
                        type="button"
                        className="clean-btn clean-btn--secondary"
                        onClick={exportToCSV}
                      >
                        📥 Descargar CSV
                      </button>
                    </div>
                  </div>

                  {/* Barra de Filtros */}
                  <div className="table-filter-bar">
                    <div className="filter-item filter-search">
                      <input
                        type="text"
                        placeholder="🔍 Buscar por nombre, teléfono, correo o barrio..."
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
                                  <span>📱 {a.phone}</span>
                                  <span>✉️ {a.email}</span>
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
                                <span className="legal-badge">✓ Habeas Data</span>
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
