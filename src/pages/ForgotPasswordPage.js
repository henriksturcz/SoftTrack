import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "./AuthPages.css";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { resetPassword, getErrorKey } = useAuth();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage(`✅ E-mail elküldve: ${email}`);
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
            <h1 className="auth-title">{t("auth.resetPassword")}</h1>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          {!message && (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">{t("auth.email")}</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder={t("auth.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? <><span className="spinner" /> {t("common.loading")}</> : t("auth.sendResetEmail")}
              </button>
            </form>
          )}

          <p className="auth-switch">
            <Link to="/login">← {t("auth.loginHere")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
