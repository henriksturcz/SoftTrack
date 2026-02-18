import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "./AuthPages.css";

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, getErrorKey } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(t(getErrorKey(err.code)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-topbar">
        <div className="auth-topbar-brand">
          <span className="auth-logo-icon">💪</span>
          <span className="auth-logo-text">{t("common.appName")}</span>
        </div>
        <div className="auth-topbar-controls">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-card card">
          <div className="auth-header">
            <h1 className="auth-title">{t("auth.login")}</h1>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">{t("auth.email")}</label>
              <input
                type="email"
                className={`form-input${error ? " error" : ""}`}
                placeholder={t("auth.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t("auth.password")}</label>
              <input
                type="password"
                className={`form-input${error ? " error" : ""}`}
                placeholder={t("auth.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="auth-forgot">
              <Link to="/forgot-password">{t("auth.forgotPassword")}</Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  {t("common.loading")}
                </>
              ) : (
                t("auth.login")
              )}
            </button>
          </form>

          <p className="auth-switch">
            {t("auth.noAccount")}{" "}
            <Link to="/register">{t("auth.registerHere")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
