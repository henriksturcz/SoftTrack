import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={isDark ? t("settings.lightTheme") : t("settings.darkTheme")}
      aria-label={isDark ? t("settings.lightTheme") : t("settings.darkTheme")}
    >
      <span className="theme-toggle-icon">{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
}
