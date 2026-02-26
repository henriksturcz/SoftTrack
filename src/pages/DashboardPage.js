import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/softtrack-logo.png";
import "./DashboardPage.css";

const T = {
  HU: {
    greeting: (name) => `Szia, ${name}! 👋`,
    greetingSub: "Készen állsz a mai edzésre?",
    profile: "Profil",
    settings: "Beállítások",
    user: "Felhasználó",
    logout: "Kijelentkezés",
    comingSoon: "Ez a funkció hamarosan elérhető lesz.",
    email: "E-mail cím",
    userId: "Felhasználó ID",
    created: "Fiók létrehozva",
    clickPhoto: "Kattints vagy húzz ide egy képet",
    changePhoto: "📷 Kép módosítása",
    appearance: "Megjelenés",
    darkMode: "Sötét mód",
    darkModeSub: "Sötét vagy világos téma",
    language: "Nyelv",
    langTitle: "Felület nyelve",
    langSub: "Magyar vagy angol",
    notifications: "Értesítések",
    notifTitle: "Push értesítések",
    notifSub: "Emlékeztetők és frissítések",
    account: "Fiók",
    deleteAccount: "Fiók törlése",
    deleteAccountSub: "Ez a művelet visszafordíthatatlan",
    delete: "Törlés",
    months: ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"],
    days: ["H","K","Sze","Cs","P","Szo","V"],
    nav: { dashboard: "Dashboard", workouts: "Workouts", goals: "Goals", stats: "Stats" },
  },
  EN: {
    greeting: (name) => `Hi, ${name}! 👋`,
    greetingSub: "Ready for today's workout?",
    profile: "Profile",
    settings: "Settings",
    user: "User",
    logout: "Logout",
    comingSoon: "This feature is coming soon.",
    email: "Email address",
    userId: "User ID",
    created: "Account created",
    clickPhoto: "Click or drag an image here",
    changePhoto: "📷 Change photo",
    appearance: "Appearance",
    darkMode: "Dark mode",
    darkModeSub: "Dark or light theme",
    language: "Language",
    langTitle: "Interface language",
    langSub: "Hungarian or English",
    notifications: "Notifications",
    notifTitle: "Push notifications",
    notifSub: "Reminders and updates",
    account: "Account",
    deleteAccount: "Delete account",
    deleteAccountSub: "This action is irreversible",
    delete: "Delete",
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    days: ["M","T","W","T","F","S","S"],
    nav: { dashboard: "Dashboard", workouts: "Workouts", goals: "Goals", stats: "Stats" },
  }
};

const NAV_ITEMS = [
  { id: "dashboard" },
  { id: "workouts" },
  { id: "goals" },
  { id: "stats" },
];

const BOTTOM_ITEMS = [
  { id: "profile" },
  { id: "settings" },
];

function MiniCalendar({ t }) {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const firstDay = new Date(current.year, current.month, 1);
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) =>
    d === today.getDate() &&
    current.month === today.getMonth() &&
    current.year === today.getFullYear();

  const prevMonth = () => setCurrent(c =>
    c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 }
  );
  const nextMonth = () => setCurrent(c =>
    c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 }
  );

  return (
    <div className="db-mini-cal">
      <div className="db-cal-header">
        <button className="db-cal-nav" onClick={prevMonth}>‹</button>
        <span className="db-cal-title">{t.months[current.month]} {current.year}</span>
        <button className="db-cal-nav" onClick={nextMonth}>›</button>
      </div>
      <div className="db-cal-grid">
        {t.days.map((d, i) => <div key={i} className="db-cal-dayname">{d}</div>)}
        {cells.map((d, i) => (
          <div key={i} className={"db-cal-day" + (d === null ? " empty" : "") + (isToday(d) ? " today" : "")}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

function ComingSoon({ page, t }) {
  return (
    <div className="db-coming-wrap">
      <div className="db-coming-orb" />
      <div className="db-coming-inner">
        <div className="db-coming-icon">✦</div>
        <h2 className="db-coming-title">{t.nav[page] || page}</h2>
        <p className="db-coming-sub">{t.comingSoon}</p>
        <div className="db-coming-badge">Coming soon</div>
      </div>
    </div>
  );
}

function ProfilePage({ currentUser, onPhotoUpdate, t }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => { setPreview(e.target.result); onPhotoUpdate(e.target.result); };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); };

  return (
    <div className="db-profile-wrap">
      <h2 className="db-section-title">{t.profile}</h2>
      <div className="db-profile-card">
        <div className={"db-avatar-zone" + (dragging ? " drag-over" : "")}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}>
          {preview || currentUser?.photoURL
            ? <img src={preview || currentUser.photoURL} alt="Profilkép" className="db-avatar-img" />
            : <div className="db-avatar-placeholder">
                <span className="db-avatar-icon">👤</span>
                <span className="db-avatar-hint">{t.clickPhoto}</span>
              </div>}
          <div className="db-avatar-overlay"><span>{t.changePhoto}</span></div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])} />
        <div className="db-profile-info">
          <div className="db-profile-field">
            <label>{t.email}</label>
            <div className="db-profile-value">{currentUser?.email || "—"}</div>
          </div>
          <div className="db-profile-field">
            <label>{t.userId}</label>
            <div className="db-profile-value db-uid">{currentUser?.uid || "—"}</div>
          </div>
          <div className="db-profile-field">
            <label>{t.created}</label>
            <div className="db-profile-value">
              {currentUser?.metadata?.creationTime
                ? new Date(currentUser.metadata.creationTime).toLocaleDateString("hu-HU") : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ t, lang, setLang }) {
  const [dark, setDark] = useState(true);
  const [notif, setNotif] = useState(true);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  return (
    <div className="db-settings-wrap">
      <h2 className="db-section-title">{t.settings}</h2>
      <div className="db-settings-group">
        <div className="db-settings-label">{t.appearance}</div>
        <div className="db-settings-row">
          <div className="db-settings-row-info">
            <span className="db-settings-row-title">{t.darkMode}</span>
            <span className="db-settings-row-sub">{t.darkModeSub}</span>
          </div>
          <button className={"db-toggle" + (dark ? " on" : "")} onClick={toggleTheme}>
            <div className="db-toggle-thumb" />
          </button>
        </div>
      </div>
      <div className="db-settings-group">
        <div className="db-settings-label">{t.language}</div>
        <div className="db-settings-row">
          <div className="db-settings-row-info">
            <span className="db-settings-row-title">{t.langTitle}</span>
            <span className="db-settings-row-sub">{t.langSub}</span>
          </div>
          <div className="db-lang-pills">
            {["HU", "EN"].map(l => (
              <button key={l} className={"db-lang-pill" + (lang === l ? " on" : "")}
                onClick={() => setLang(l)}>
                {l === "HU" ? "🇭🇺" : "🇬🇧"} {l}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="db-settings-group">
        <div className="db-settings-label">{t.notifications}</div>
        <div className="db-settings-row">
          <div className="db-settings-row-info">
            <span className="db-settings-row-title">{t.notifTitle}</span>
            <span className="db-settings-row-sub">{t.notifSub}</span>
          </div>
          <button className={"db-toggle" + (notif ? " on" : "")} onClick={() => setNotif(p => !p)}>
            <div className="db-toggle-thumb" />
          </button>
        </div>
      </div>
      <div className="db-settings-group">
        <div className="db-settings-label">{t.account}</div>
        <div className="db-settings-row db-settings-danger">
          <div className="db-settings-row-info">
            <span className="db-settings-row-title">{t.deleteAccount}</span>
            <span className="db-settings-row-sub">{t.deleteAccountSub}</span>
          </div>
          <button className="db-btn-danger">{t.delete}</button>
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
  const [lang, setLang] = useState("HU");

  const t = T[lang];

  const handleLogout = async () => { await logout(); navigate("/login"); };

  const firstName = currentUser?.displayName
    ? currentUser.displayName.split(" ")[0]
    : currentUser?.email?.split("@")[0] || "User";

  const initials = firstName.slice(0, 2).toUpperCase();

  const renderContent = () => {
    if (active === "profile") return <ProfilePage currentUser={currentUser} onPhotoUpdate={setPhoto} t={t} />;
    if (active === "settings") return <SettingsPage t={t} lang={lang} setLang={setLang} />;
    if (active === "dashboard") return (
      <div className="db-greeting-wrap">
        <div className="db-coming-orb" />
        <div className="db-greeting-inner">
          <h1 className="db-greeting-title">{t.greeting(firstName)}</h1>
          <p className="db-greeting-sub">{t.greetingSub}</p>
        </div>
      </div>
    );
    return <ComingSoon page={active} t={t} />;
  };

  return (
    <div className="db-root">
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
                <span className="db-nav-label">{t.nav[item.id]}</span>
                {active === item.id && <div className="db-nav-indicator" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="db-sidebar-bottom">
          <MiniCalendar t={t} />

          {BOTTOM_ITEMS.map(item => (
            <button key={item.id}
              className={"db-nav-item" + (active === item.id ? " on" : "")}
              onClick={() => setActive(item.id)}>
              <span className="db-nav-label">{t[item.id]}</span>
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
              <div className="db-sidebar-user-role">{t.user}</div>
            </div>
            <button className="db-logout-btn" onClick={(e) => { e.stopPropagation(); handleLogout(); }}
              title={t.logout}>→</button>
          </div>
        </div>
      </aside>

      <main className="db-main">
        <div className="db-main-inner">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}