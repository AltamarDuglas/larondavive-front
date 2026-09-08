"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  exportToExcel,
  exportToPDF,
  getAdminMetrics,
  getAdminSession,
  signInAdmin,
  signOutAdmin,
} from "@/lib/supabaseClient";
import {
  AdminTab,
  AsistenteRecord,
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
};

export function useAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");
  const [jornadas, setJornadas] = useState<JornadaRecord[]>([]);
  const [asistentes, setAsistentes] = useState<AsistenteRecord[]>([]);
  const [ageBreakdown, setAgeBreakdown] = useState<Record<string, number>>({});
  const [genderBreakdown, setGenderBreakdown] = useState<
    Record<string, number>
  >({});
  const [zoneBreakdown, setZoneBreakdown] = useState<Record<string, number>>(
    {},
  );
  const [socialGroupCounts, setSocialGroupCounts] = useState<
    Record<string, number>
  >({});
  const [topBarrios, setTopBarrios] = useState<TopBarrio[]>([]);
  const [metricsSummary, setMetricsSummary] = useState<MetricsSummary>(
    INITIAL_METRICS_SUMMARY,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isJornadaModalOpen, setIsJornadaModalOpen] = useState<boolean>(false);
  const [selectedQrJornada, setSelectedQrJornada] =
    useState<JornadaRecord | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedComunaFilter, setSelectedComunaFilter] =
    useState<string>("TODAS");

  const loadRealSupabaseData = useCallback(async () => {
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
      // El panel conserva su estado previo si falla la consulta remota.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const hasSession = getAdminSession();
    if (hasSession) {
      setIsAuthenticated(true);
      loadRealSupabaseData();
    }
  }, [loadRealSupabaseData]);

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
        loadRealSupabaseData();
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
    loadRealSupabaseData();
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
    [asistentes, searchQuery, selectedComunaFilter],
  );

  const handleExportPDF = () => {
    exportToPDF(asistentes, metricsSummary);
  };

  const handleExportExcel = () => {
    exportToExcel(asistentes);
  };

  const handleExportCSV = () => {
    exportAsistentesToCSV(asistentes);
  };

  return {
    activeTab,
    ageBreakdown,
    asistentes,
    emailInput,
    filteredAsistentes,
    genderBreakdown,
    handleExportCSV,
    handleExportExcel,
    handleExportPDF,
    handleJornadaCreated,
    handleLogin,
    handleLogout,
    isAuthenticated,
    isJornadaModalOpen,
    isLoading,
    isLoggingIn,
    jornadas,
    loginError,
    metricsSummary,
    passwordInput,
    searchQuery,
    selectedComunaFilter,
    selectedQrJornada,
    setActiveTab,
    setEmailInput,
    setIsJornadaModalOpen,
    setPasswordInput,
    setSearchQuery,
    setSelectedComunaFilter,
    setSelectedQrJornada,
    socialGroupCounts,
    topBarrios,
    zoneBreakdown,
  };
}
