"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteJornada,
  exportToExcel,
  exportToPDF,
  getAdminMetrics,
  getAdminSession,
  signInAdmin,
  signOutAdmin,
  updateJornadaStatus,
  updateJornadaTitle,
} from "@/lib/supabaseClient";
import {
  AdminTab,
  AsistenteRecord,
  FullAnalyticsData,
  JornadaRecord,
  MetricsSummary,
  TopBarrio,
} from "./adminTypes";
import { exportAsistentesToCSV } from "./adminCsvExport";

const INITIAL_METRICS_SUMMARY: MetricsSummary = {
  totalCiudadanos: 0,
  asistenciasAcumuladas: 0,
  confirmacionesQr: "100%",
  tasaRetorno: "0%",
  totalNiñosAcompañantes: 0,
  porcentajeNacidosMonteria: "0%",
  porcentajeTerminos: "100%",
};

const INITIAL_FULL_ANALYTICS: FullAnalyticsData = {
  metricsSummary: INITIAL_METRICS_SUMMARY,
  ageBreakdown: {},
  genderBreakdown: {},
  zoneBreakdown: {},
  bornInMonteriaBreakdown: {},
  topOriginLocations: [],
  attendedWithChildrenBreakdown: {},
  childrenCountDistribution: {},
  comunaBreakdown: {},
  topBarrios: [],
  populationGroupBreakdown: {},
  socialGroupCounts: {},
  otherSocialGroupSpecs: [],
  termsAcceptanceBreakdown: {},
  jornadaAttendanceCounts: {},
};

/**
 * Hook personalizado para la gestión del estado global del Panel Administrador.
 * Principio SOLID - SRP: Separación estricta entre lógica de estado y componentes de UI.
 */
export function useAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");
  const [jornadas, setJornadas] = useState<JornadaRecord[]>([]);
  const [asistentes, setAsistentes] = useState<AsistenteRecord[]>([]);

  // Filtro activo por código de jornada para analítica
  const [selectedJornadaFilter, setSelectedJornadaFilter] =
    useState<string>("TODAS");

  // Estado unificado con todas las métricas analíticas del 100% de los datos
  const [fullAnalytics, setFullAnalytics] = useState<FullAnalyticsData>(
    INITIAL_FULL_ANALYTICS
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isJornadaModalOpen, setIsJornadaModalOpen] = useState<boolean>(false);
  const [selectedQrJornada, setSelectedQrJornada] =
    useState<JornadaRecord | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedComunaFilter, setSelectedComunaFilter] =
    useState<string>("TODAS");

  /**
   * Carga métricas en vivo desde Supabase filtradas opcionalmente por la jornada seleccionada
   */
  const loadRealSupabaseData = useCallback(async (jornadaCode: string = "TODAS") => {
    setIsLoading(true);
    try {
      const data = await getAdminMetrics(jornadaCode);
      setJornadas(data.jornadas);
      setAsistentes(data.asistentes);
      setFullAnalytics({
        metricsSummary: {
          totalCiudadanos: data.totalCiudadanos,
          asistenciasAcumuladas: data.asistenciasAcumuladas,
          confirmacionesQr: data.confirmacionesQr,
          tasaRetorno: data.tasaRetorno,
          totalNiñosAcompañantes: data.totalNiñosAcompañantes,
          porcentajeNacidosMonteria: data.porcentajeNacidosMonteria,
          porcentajeTerminos: data.porcentajeTerminos,
        },
        ageBreakdown: data.ageBreakdown,
        genderBreakdown: data.genderBreakdown,
        zoneBreakdown: data.zoneBreakdown,
        bornInMonteriaBreakdown: data.bornInMonteriaBreakdown,
        topOriginLocations: data.topOriginLocations,
        attendedWithChildrenBreakdown: data.attendedWithChildrenBreakdown,
        childrenCountDistribution: data.childrenCountDistribution,
        comunaBreakdown: data.comunaBreakdown,
        topBarrios: data.topBarrios,
        populationGroupBreakdown: data.populationGroupBreakdown,
        socialGroupCounts: data.socialGroupCounts,
        otherSocialGroupSpecs: data.otherSocialGroupSpecs,
        termsAcceptanceBreakdown: data.termsAcceptanceBreakdown,
        jornadaAttendanceCounts: data.jornadaAttendanceCounts,
      });
    } catch {
      // El panel conserva su estado previo si falla la consulta remota.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const hasSession = getAdminSession();
    if (hasSession) {
      setIsAuthenticated(true);
      loadRealSupabaseData(selectedJornadaFilter);
    }
  }, [loadRealSupabaseData, selectedJornadaFilter]);

  const handleJornadaFilterChange = (newCode: string) => {
    setSelectedJornadaFilter(newCode);
    loadRealSupabaseData(newCode);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!emailInput.trim() || !passwordInput.trim()) {
      setLoginError("Por favor ingresa correo institucional y contraseña.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await signInAdmin(emailInput, passwordInput);
      if (res.success) {
        setIsAuthenticated(true);
        loadRealSupabaseData(selectedJornadaFilter);
      } else {
        setLoginError(res.error || "Credenciales no autorizadas.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setIsAuthenticated(false);
  };

  const handleJornadaCreated = (newJornada: JornadaRecord) => {
    setJornadas((prev) => [newJornada, ...prev]);
    loadRealSupabaseData(selectedJornadaFilter);
  };

  const handleUpdateJornadaStatus = async (
    code: string,
    newStatus: "activa" | "programada" | "finalizada"
  ) => {
    setJornadas((prev) =>
      prev.map((j) => (j.code === code ? { ...j, status: newStatus } : j))
    );
    await updateJornadaStatus(code, newStatus);
    loadRealSupabaseData(selectedJornadaFilter);
  };

  const handleUpdateJornadaTitle = async (code: string, newTitle: string) => {
    setJornadas((prev) =>
      prev.map((j) => (j.code === code ? { ...j, title: newTitle } : j))
    );
    await updateJornadaTitle(code, newTitle);
    loadRealSupabaseData(selectedJornadaFilter);
  };

  const handleDeleteJornada = async (code: string) => {
    // 1. Eliminación visual inmediata (optimistic update)
    setJornadas((prev) => prev.filter((j) => j.code.toUpperCase() !== code.toUpperCase()));

    // Si la jornada eliminada estaba activa en el filtro, reiniciar a 'TODAS'
    const nextFilter = selectedJornadaFilter.toUpperCase() === code.toUpperCase() ? "TODAS" : selectedJornadaFilter;
    if (selectedJornadaFilter.toUpperCase() === code.toUpperCase()) {
      setSelectedJornadaFilter("TODAS");
    }

    // 2. Ejecutar borrado permanente en backend y almacenamiento local
    await deleteJornada(code);

    // 3. Sincronizar datos y analíticas
    await loadRealSupabaseData(nextFilter);
  };

  const filteredAsistentes = useMemo(
    () =>
      asistentes.filter((item) => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        const matchesQuery =
          !normalizedQuery ||
          item.full_name.toLowerCase().includes(normalizedQuery) ||
          item.phone.includes(searchQuery) ||
          item.email.toLowerCase().includes(normalizedQuery) ||
          item.barrio.toLowerCase().includes(normalizedQuery);

        const matchesComuna =
          selectedComunaFilter === "TODAS" ||
          item.comuna === selectedComunaFilter;

        return matchesQuery && matchesComuna;
      }),
    [asistentes, searchQuery, selectedComunaFilter]
  );

  const handleExportPDF = () => {
    exportToPDF(asistentes, fullAnalytics.metricsSummary);
  };

  const handleExportExcel = () => {
    exportToExcel(asistentes);
  };

  const handleExportCSV = () => {
    exportAsistentesToCSV(asistentes);
  };

  return {
    activeTab,
    ageBreakdown: fullAnalytics.ageBreakdown,
    asistentes,
    emailInput,
    filteredAsistentes,
    fullAnalytics,
    genderBreakdown: fullAnalytics.genderBreakdown,
    handleDeleteJornada,
    handleExportCSV,
    handleExportExcel,
    handleExportPDF,
    handleJornadaCreated,
    handleJornadaFilterChange,
    handleUpdateJornadaStatus,
    handleUpdateJornadaTitle,
    handleLogin,
    handleLogout,
    isAuthenticated,
    isJornadaModalOpen,
    isLoading,
    isLoggingIn,
    jornadaAttendanceCounts: fullAnalytics.jornadaAttendanceCounts,
    jornadas,
    loginError,
    metricsSummary: fullAnalytics.metricsSummary,
    passwordInput,
    searchQuery,
    selectedComunaFilter,
    selectedJornadaFilter,
    selectedQrJornada,
    setActiveTab,
    setEmailInput,
    setIsJornadaModalOpen,
    setPasswordInput,
    setSearchQuery,
    setSelectedComunaFilter,
    setSelectedQrJornada,
    socialGroupCounts: fullAnalytics.socialGroupCounts,
    topBarrios: fullAnalytics.topBarrios,
    zoneBreakdown: fullAnalytics.zoneBreakdown,
  };
}
