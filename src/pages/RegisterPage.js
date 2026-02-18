import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "./AuthPages.css";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const sanitize = (str) => str.replace(/[<>"'`]/g, "").trim();

const BAD_WORDS = [
  "fuck","shit","asshole","bitch","cunt","dick","nigger","faggot",
  "kurva","fasz","szar","bazmeg","picsa","rohadék","segg","geci",
  "admin","root","script","select","drop","insert","delete","alert"
];
const containsBadWord = (str) => {
  const lower = str.toLowerCase().replace(/\s+/g, "");
  return BAD_WORDS.some((w) => lower.includes(w));
};

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register, loginWithGoogle, getErrorKey } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const getPasswordStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strengthInfo = [
    { label: "", color: "var(--color-border)" },
    { label: "Gyenge", color: "#e05c5c" },
    { label: "Közepes", color: "#e0a85c" },
    { label: "Jó", color: "#5cb8e0" },
    { label: "Erős", color: "#4caf82" }
  ];

  const pwStrength = form.password ? getPasswordStrength(form.password) : 0;

  const validate = () => {
    const newErrors = {};
    const last  = sanitize(form.lastName);
    const first = sanitize(form.firstName);
    const email = sanitize(form.email);
    const pw    = form.password;
    const pw2   = form.confirmPassword;

    if (!last || last.length < 2)
      newErrors.lastName = "A vezetéknév legalább 2 karakter legyen.";
    else if (containsBadWord(last))
      newErrors.lastName = "Nem megfelelő tartalom.";

    if (!first || first.length < 2)
      newErrors.firstName = "A keresztnév legalább 2 karakter legyen.";
    else if (containsBadWord(first))
      newErrors.firstName = "Nem megfelelő tartalom.";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Érvénytelen e-mail cím.";
    else if (containsBadWord(email))
      newErrors.email = "Nem megfelelő tartalom az e-mail címben.";

    if (!PASSWORD_REGEX.test(pw))
      newErrors.password = t("auth.errors.weakPassword");
    else if (containsBadWord(pw))
      newErrors.password = "Nem megfelelő tartalom a jelszóban.";

    if (pw !== pw2)
      newErrors.confirmPassword = t("auth.errors.passwordMismatch");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await register(
        sanitize(form.email),
        form.password,
        sanitize(form.firstName),
        sanitize(form.lastName)
      );
      navigate("/dashboard");
    } catch (err) {
      setServerError(t(getErrorKey(err.code)));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setServerError("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      if (
        err.code !== "auth/popup-closed-by-user" &&
        err.code !== "auth/cancelled-popup-request"
      ) {
        setServerError(t(getErrorKey(err.code)));
      }
    } finally {
      setGoogleLoading(false);
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
            <h1 className="auth-title">{t("auth.register")}</h1>
            <p className="auth-subtitle">Hozd létre a fiókodat az induláshoz</p>
          </div>

          <button
            type="button"
            className="btn btn-google btn-full"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <span className="spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Regisztráció Google-fiókkal
          </button>

          <div className="auth-divider">
            <span>vagy e-mail-lel</span>
          </div>

          {serverError && <div className="alert alert-error">{serverError}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>

            {/* Sor: Vezetéknév + Keresztnév */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Vezetéknév <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  className={`form-input${errors.lastName ? " error" : ""}`}
                  placeholder="Kovács"
                  value={form.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />
                {errors.lastName && (
                  <span className="form-error">{errors.lastName}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Keresztnév <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-input${errors.firstName ? " error" : ""}`}
                  placeholder="Anna"
                  value={form.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />
                {errors.firstName && (
                  <span className="form-error">{errors.firstName}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                {t("auth.email")} <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`form-input${errors.email ? " error" : ""}`}
                placeholder={t("auth.emailPlaceholder")}
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                {t("auth.password")} <span className="required">*</span>
              </label>
              <input
                type="password"
                name="password"
                className={`form-input${errors.password ? " error" : ""}`}
                placeholder="Min. 8 kar., nagy/kisbetű, szám, spec. kar."
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              {form.password && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="strength-bar"
                        style={{
                          background: i <= pwStrength
                            ? strengthInfo[pwStrength].color
                            : "var(--color-border)"
                        }}
                      />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: strengthInfo[pwStrength].color }}>
                    {strengthInfo[pwStrength].label}
                  </span>
                </div>
              )}
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                {t("auth.confirmPassword")} <span className="required">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                className={`form-input${errors.confirmPassword ? " error" : ""}`}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              {errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner" /> {t("common.loading")}</>
              ) : (
                t("auth.register")
              )}
            </button>
          </form>

          <p className="auth-switch">
            {t("auth.hasAccount")}{" "}
            <Link to="/login">{t("auth.loginHere")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}