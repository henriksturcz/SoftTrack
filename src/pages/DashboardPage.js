import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/softtrack-logo.png";
import "./DashboardPage.css";

const NAV_ITEMS = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "workouts",  icon: "⚡", label: "Workouts" },
  { id: "goals",     icon: "🏆", label: "Goals" },
  { id: "stats",     icon: "📉", label: "Stats" },
];

const BOTTOM_ITEMS = [
  { id: "profile",  icon: "👤", label: "Profile" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

function ComingSoon({ page }) {
  return (
    <div className="db-coming-wrap">
      <div className="db-coming-orb" />
      <div className="db-coming-inner">
        <div className="db-coming-icon">
          {NAV_ITEMS.find(n => n.id === page)?.icon ||
           BOTTOM_ITEMS.find(n => n.id === page)?.icon || "✦"}
        </div>
        <h2 className="db-coming-title">{page.charAt(0).toUpperCase() + page.slice(1)}</h2>
        <p className="db-coming-sub">Ez a funkció hamarosan elérhető lesz.</p>
        <div className="db-coming-badge">Coming soon</div>
      </div>
    </div>
  );
}

function ProfilePage({ currentUser, onPhotoUpdate }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      onPhotoUpdate(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="db-profile-wrap">
      <h2 className="db-section-title">Profil</h2>

      <div className="db-profile-card">
        <div
          className={"db-avatar-zone" + (dragging ? " drag-over" : "")}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          {preview || currentUser?.photoURL ? (
            <img src={preview || currentUser.photoURL} alt="Profilkép" className="db-avatar-img" />
          ) : (
            <div className="db-avatar-placeholder">
              <span className="db-avatar-icon">👤</span>
              <span className="db-avatar-hint">Kattints vagy húzz ide egy képet</span>
            </div>
          )}
          <div className="db-avatar-overlay">
            <span>📷 Kép módosítása</span>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])} />

        <div className="db-profile-info">
          <div className="db-profile-field">
            <label>Email</label>
            <div className="db-profile-value">{currentUser?.email || "—"}</div>
          </div>
          <div className="db-profile-field">
            <label>Felhasználó ID</label>
            <div className="db-profile-value db-uid">{currentUser?.uid || "—"}</div>
          </div>
          <div className="db-profile-field">
            <label>Fiók létrehozva</label>
            <div className="db-profile-value">
              {currentUser?.metadata?.creationTime
                ? new Date(currentUser.metadata.creationTime).toLocaleDateString("hu-HU")
                : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  const [dark, setDark] = useState(
    document.documentElement.getAttribute("data-theme") === "dark" ||
    !document.documentElement.getAttribute("data-theme")
  );
  const [lang, setLang] = useState(localStorage.getItem("i18nextLng") || "HU");
  const [notif, setNotif] = useState(true);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  return (
    <div className="db-settings-wrap">
      <h2 className="db-section-title">Beállítások</h2>

      <div className="db-settings-group">
        <div className="db-settings-label">Megjelenés</div>
        <div className="db-settings-row">
          <div className="db-settings-row-info">
            <span className="db-settings-row-title">Sötét mód</span>
            <span className="db-settings-row-sub">Sötét vagy világos téma</span>
          </div>
          <button className={"db-toggle" + (dark ? " on" : "")} onClick={toggleTheme}>
            <div className="db-toggle-thumb" />
          </button>
        </div>
      </div>

      <div className="db-settings-group">
        <div className="db-settings-label">Nyelv</div>
        <div className="db-settings-row">
          <div className="db-settings-row-info">
            <span className="db-settings-row-title">Felület nyelve</span>
            <span className="db-settings-row-sub">Magyar vagy angol</span>
          </div>
          <div className="db-lang-pills">
            {["HU", "EN"].map(l => (
              <button key={l} className={"db-lang-pill" + (lang === l ? " on" : "")}
                onClick={() => { setLang(l); localStorage.setItem("i18nextLng", l); }}>
                {l === "HU" ? "🇭🇺" : "🇬🇧"} {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="db-settings-group">
        <div className="db-settings-label">Értesítések</div>
        <div className="db-settings-row">
          <div className="db-settings-row-info">
            <span className="db-settings-row-title">Push értesítések</span>
            <span className="db-settings-row-sub">Emlékeztetők és frissítések</span>
          </div>
          <button className={"db-toggle" + (notif ? " on" : "")} onClick={() => setNotif(p => !p)}>
            <div className="db-toggle-thumb" />
          </button>
        </div>
      </div>

      <div className="db-settings-group">
        <div className="db-settings-label">Fiók</div>
        <div className="db-settings-row db-settings-danger">
          <div className="db-settings-row-info">
            <span className="db-settings-row-title">Fiók törlése</span>
            <span className="db-settings-row-sub">Ez a művelet visszafordíthatatlan</span>
          </div>
          <button className="db-btn-danger">Törlés</button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [photo, setPhoto] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = currentUser?.email
    ? currentUser.email.slice(0, 2).toUpperCase()
    : "U";

  const renderContent = () => {
    if (active === "profile") return <ProfilePage currentUser={currentUser} onPhotoUpdate={setPhoto} />;
    if (active === "settings") return <SettingsPage />;
    return <ComingSoon page={active} />;
  };

  return (
    <div className="db-root">
      {/* Sidebar */}
      <aside className="db-sidebar">
        <div className="db-sidebar-top">
          <div className="db-sidebar-brand">
            <img src={logo} alt="SoftTrack" className="db-sidebar-logo" />
            <span className="db-sidebar-name">SoftTrack</span>
          </div>

          <nav className="db-nav">
            {NAV_ITEMS.map(item => (
              <button key={item.id}
                className={"db-nav-item" + (active === item.id ? " on" : "")}
                onClick={() => setActive(item.id)}>
                <span className="db-nav-icon">{item.icon}</span>
                <span className="db-nav-label">{item.label}</span>
                {active === item.id && <div className="db-nav-indicator" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="db-sidebar-bottom">
          {BOTTOM_ITEMS.map(item => (
            <button key={item.id}
              className={"db-nav-item" + (active === item.id ? " on" : "")}
              onClick={() => setActive(item.id)}>
              <span className="db-nav-icon">{item.icon}</span>
              <span className="db-nav-label">{item.label}</span>
              {active === item.id && <div className="db-nav-indicator" />}
            </button>
          ))}

          <div className="db-sidebar-user" onClick={() => setActive("profile")}>
            <div className="db-sidebar-avatar">
              {photo || currentUser?.photoURL
                ? <img src={photo || currentUser.photoURL} alt="" />
                : <span>{initials}</span>}
            </div>
            <div className="db-sidebar-user-info">
              <div className="db-sidebar-user-email">{currentUser?.email}</div>
              <div className="db-sidebar-user-role">Felhasználó</div>
            </div>
            <button className="db-logout-btn" onClick={(e) => { e.stopPropagation(); handleLogout(); }}
              title="Kijelentkezés">→</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="db-main">
        <div className="db-main-inner">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}