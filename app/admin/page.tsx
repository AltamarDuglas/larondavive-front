"use client";

import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import AdminAnalyticsTab from "@/components/admin/AdminAnalyticsTab";
import AdminAsistentesTab from "@/components/admin/AdminAsistentesTab";
import AdminDashboardHeader from "@/components/admin/AdminDashboardHeader";
import AdminJornadaModal from "@/components/admin/AdminJornadaModal";
import AdminJornadasTab from "@/components/admin/AdminJornadasTab";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import AdminMetricsCards from "@/components/admin/AdminMetricsCards";
import AdminQrModal from "@/components/admin/AdminQrModal";
import AdminTabs from "@/components/admin/AdminTabs";
import { useAdminDashboard } from "@/components/admin/useAdminDashboard";

export default function AdminPage() {
  const admin = useAdminDashboard();

  return (
    <div className="home-page-container">
      <HeaderNav />

      <main className="main-content-flow page">
        {!admin.isAuthenticated ? (
          <AdminLoginForm
            emailInput={admin.emailInput}
            passwordInput={admin.passwordInput}
            loginError={admin.loginError}
            isLoggingIn={admin.isLoggingIn}
            onEmailChange={admin.setEmailInput}
            onPasswordChange={admin.setPasswordInput}
            onSubmit={admin.handleLogin}
          />
        ) : (
          <div className="admin-container">
            <AdminDashboardHeader
              onCreateJornada={() => admin.setIsJornadaModalOpen(true)}
              onLogout={admin.handleLogout}
            />

            <AdminMetricsCards metricsSummary={admin.metricsSummary} />

            <AdminTabs
              activeTab={admin.activeTab}
              asistentesCount={admin.asistentes.length}
              jornadasCount={admin.jornadas.length}
              onTabChange={admin.setActiveTab}
            />

            {admin.activeTab === "analytics" && (
              <AdminAnalyticsTab
                ageBreakdown={admin.ageBreakdown}
                asistentes={admin.asistentes}
                genderBreakdown={admin.genderBreakdown}
                onExportPDF={admin.handleExportPDF}
                socialGroupCounts={admin.socialGroupCounts}
                topBarrios={admin.topBarrios}
                zoneBreakdown={admin.zoneBreakdown}
              />
            )}

            {admin.activeTab === "jornadas" && (
              <AdminJornadasTab
                jornadas={admin.jornadas}
                onCreateJornada={() => admin.setIsJornadaModalOpen(true)}
                onSelectQrJornada={admin.setSelectedQrJornada}
              />
            )}

            {admin.activeTab === "asistentes" && (
              <AdminAsistentesTab
                filteredAsistentes={admin.filteredAsistentes}
                isLoading={admin.isLoading}
                onComunaFilterChange={admin.setSelectedComunaFilter}
                onExportCSV={admin.handleExportCSV}
                onExportExcel={admin.handleExportExcel}
                onSearchChange={admin.setSearchQuery}
                searchQuery={admin.searchQuery}
                selectedComunaFilter={admin.selectedComunaFilter}
              />
            )}

            <AdminJornadaModal
              isOpen={admin.isJornadaModalOpen}
              onClose={() => admin.setIsJornadaModalOpen(false)}
              onJornadaCreated={admin.handleJornadaCreated}
            />

            <AdminQrModal
              jornada={admin.selectedQrJornada}
              isOpen={Boolean(admin.selectedQrJornada)}
              onClose={() => admin.setSelectedQrJornada(null)}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
