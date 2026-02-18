import React from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.split("-")[0] || "hu";

  const toggle = () => {
    const next = currentLang === "hu" ? "en" : "hu";
    i18n.changeLanguage(next);
  };

  return (
    <button className="lang-switcher" onClick={toggle} aria-label="Switch language">
      <span className="lang-flag">{currentLang === "hu" ? "🇭🇺" : "🇬🇧"}</span>
      <span className="lang-label">{currentLang === "hu" ? "HU" : "EN"}</span>
    </button>
  );
}
