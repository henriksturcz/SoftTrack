import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      <header className="dash-header">
        <div className="dash-header-brand">
          <span>💪</span>
          <span className="dash-brand-name">{t("common.appName")}</span>
        </div>
        <nav className="dash-nav">
          <a href="/dashboard" className="dash-nav-link active">{t("nav.dashboard")}</a>
          <a href="/workouts" className="dash-nav-link">{t("nav.workouts")}</a>
          <a href="/goals" className="dash-nav-link">{t("nav.goals")}</a>
          <a href="/statistics" className="dash-nav-link">{t("nav.statistics")}</a>
        </nav>
        <div className="dash-header-controls">
          <LanguageSwitcher />
          <ThemeToggle />
          <button className="btn btn-secondary" onClick={handleLogout} style={{ fontSize: "0.85rem" }}>
            {t("auth.logout")}
          </button>
        </div>
      </header>

      <main className="dash-main container">
        <div className="dash-welcome card">
          <h2>{t("dashboard.welcome")}, {currentUser?.email}! 👋</h2>
          <p style={{ color: "var(--color-text-secondary)", marginTop: "0.5rem" }}>
            {t("dashboard.noWorkouts")} {t("dashboard.startFirst")}
          </p>
        </div>

        <div className="dash-stats-grid">
          <div className="card dash-stat-card">
            <div className="dash-stat-icon">🏋️</div>
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">{t("dashboard.totalWorkouts")}</div>
          </div>
          <div className="card dash-stat-card">
            <div className="dash-stat-icon">🎯</div>
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">{t("nav.goals")}</div>
          </div>
          <div className="card dash-stat-card">
            <div className="dash-stat-icon">📊</div>
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">{t("nav.statistics")}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
