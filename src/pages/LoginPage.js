import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/softtrack-logo.png";
import fortaFont from "../assets/Forta.ttf";
import "./LoginPage.css";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const sanitize = (str) => str.replace(/[<>"'`]/g, "").trim();
const BAD_WORDS = ["fuck","shit","asshole","bitch","cunt","dick","nigger","faggot","kurva","fasz","szar","bazmeg","picsa","rohadék","segg","geci","admin","root","script","select","drop","insert","delete","alert"];
const hasBadWord = (str) => BAD_WORDS.some(w => str.toLowerCase().replace(/\s+/g,"").includes(w));

const T = {
  HU: {
    slogan: ["Kövesd az utadat,", "égj a céljaidért."],
    sub: "Az egyetlen edzésnapló, ami lépést tart veled.",
    tabLogin: "Bejelentkezés", tabRegister: "Regisztráció",
    email: "E-mail cím", password: "Jelszó", confirmPw: "Jelszó megerősítése",
    lastName: "Vezetéknév", firstName: "Keresztnév",
    forgot: "Elfelejtett jelszó?", backToLogin: "← Vissza",
    noAccount: "Még nincs fiókod?", hasAccount: "Már van fiókod?",
    registerLink: "Regisztrálj", loginLink: "Jelentkezz be",
    google: "Folytatás Google-lal", or: "vagy",
    emailPh: "pelda@email.com", passPh: "Jelszavad", confirmPh: "Jelszó újra",
    lastPh: "Kovács", firstPh: "Anna",
    sendReset: "Visszaállító e-mail küldése",
    resetSent: (e) => "✅ E-mail elküldve: " + e,
    submitLogin: "Bejelentkezés", submitRegister: "Fiók létrehozása",
    forgotTitle: "Jelszó visszaállítása",
    forgotSub: "Add meg az e-mail címed és küldünk egy visszaállító linket.",
    weakPw: "Min. 8 kar., nagy- és kisbetű, szám és spec. karakter.",
    pwMismatch: "A két jelszó nem egyezik.",
    lastMin: "Legalább 2 karakter.", firstMin: "Legalább 2 karakter.",
    badContent: "Nem megfelelő tartalom.", badEmail: "Érvénytelen e-mail cím.",
    badEmailContent: "Nem megfelelő tartalom.", badPwContent: "Nem megfelelő tartalom.",
    strength: ["","Gyenge","Közepes","Jó","Erős"],
    features: [
      { icon: "⚡", label: "Edzéskövetés", desc: "Rögzítsd minden szettjed és ismétlésed" },
      { icon: "〽️", label: "Fejlődés", desc: "Lásd hogyan erősödsz hétről hétre" },
      { icon: "🏆", label: "Célok", desc: "Tűzz ki célokat és haladj feléjük" },
    ],
    errMap: {
      "auth/invalid-credential":"Hibás e-mail vagy jelszó.",
      "auth/user-not-found":"Nem található ilyen fiók.",
      "auth/wrong-password":"Hibás jelszó.",
      "auth/too-many-requests":"Túl sok kísérlet. Próbáld később.",
      "auth/invalid-email":"Érvénytelen e-mail cím.",
      "auth/email-already-in-use":"Ez az e-mail már foglalt.",
      "auth/weak-password":"A jelszó túl gyenge.",
      "default":"Hiba történt. Próbáld újra.",
    },
  },
  EN: {
    slogan: ["Track your path,", "burn for your goals."],
    sub: "The only workout journal that keeps up with you.",
    tabLogin: "Sign in", tabRegister: "Create account",
    email: "Email address", password: "Password", confirmPw: "Confirm password",
    lastName: "Last name", firstName: "First name",
    forgot: "Forgot password?", backToLogin: "← Back",
    noAccount: "Don't have an account?", hasAccount: "Already have an account?",
    registerLink: "Register", loginLink: "Sign in",
    google: "Continue with Google", or: "or",
    emailPh: "example@email.com", passPh: "Your password", confirmPh: "Repeat password",
    lastPh: "Smith", firstPh: "Anna",
    sendReset: "Send reset email",
    resetSent: (e) => "✅ Email sent to: " + e,
    submitLogin: "Sign in", submitRegister: "Create account",
    forgotTitle: "Reset password",
    forgotSub: "Enter your email and we'll send you a reset link.",
    weakPw: "Min. 8 chars, upper & lowercase, number and special char.",
    pwMismatch: "Passwords do not match.",
    lastMin: "At least 2 characters.", firstMin: "At least 2 characters.",
    badContent: "Inappropriate content.", badEmail: "Invalid email address.",
    badEmailContent: "Inappropriate content.", badPwContent: "Inappropriate content.",
    strength: ["","Weak","Fair","Good","Strong"],
    features: [
      { icon: "⚡", label: "Workout Tracking", desc: "Log every set and rep in detail" },
      { icon: "〽️", label: "Progress", desc: "See how you grow week by week" },
      { icon: "🏆", label: "Goals", desc: "Set targets and work towards them" },
    ],
    errMap: {
      "auth/invalid-credential":"Incorrect email or password.",
      "auth/user-not-found":"No account found.",
      "auth/wrong-password":"Incorrect password.",
      "auth/too-many-requests":"Too many attempts. Try later.",
      "auth/invalid-email":"Invalid email address.",
      "auth/email-already-in-use":"This email is already in use.",
      "auth/weak-password":"Password is too weak.",
      "default":"An error occurred. Try again.",
    },
  }
};

const GIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" style={{flexShrink:0}}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

function FeatureTicker({ features }) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animating, setAnimating] = useState(false);
  const timer = useRef(null);

  const go = (i) => {
    if (animating || i === active) return;
    setPrev(active);
    setAnimating(true);
    setActive(i);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 400);
    clearInterval(timer.current);
    timer.current = setInterval(() => advance(), 6000);
  };

  const advance = () => {
    setActive(p => {
      const next = (p + 1) % features.length;
      setPrev(p);
      setAnimating(true);
      setTimeout(() => { setPrev(null); setAnimating(false); }, 400);
      return next;
    });
  };

  useEffect(() => {
    timer.current = setInterval(advance, 6000);
    return () => clearInterval(timer.current);
  }, [features.length]);

  const f = features[active];

  return (
    <div className="lp-ticker">
      <div className="lp-ticker-tabs">
        {features.map((ft, i) => (
          <button key={i} className={"lp-ttab" + (i === active ? " on" : "")} onClick={() => go(i)}>
            {ft.icon === '〽️' ? <span style={{display:'inline-block', transform:'scaleX(-1) rotate(180deg)'}}>〽️</span> : <span>{ft.icon}</span>} {ft.label}
          </button>
        ))}
      </div>
      <div className="lp-ticker-body">
        <div className={"lp-ticker-content" + (animating ? " entering" : "")}>
          <div className="lp-ticker-icon">{f.icon === '〽️' ? <span style={{display:'inline-block', transform:'scaleX(-1) rotate(180deg)'}}>〽️</span> : f.icon}</div>
          <div className="lp-ticker-info">
            <div className="lp-ticker-title">{f.label}</div>
            <div className="lp-ticker-desc">{f.desc}</div>
          </div>
        </div>
        <div className="lp-ticker-track">
          <div className="lp-ticker-fill" key={active} />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { login, loginWithGoogle, register, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [lang, setLang] = useState("HU");
  const [tab, setTab] = useState("login");
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState("");
  const [lEmail, setLEmail] = useState("");
  const [lPw, setLPw] = useState("");
  const [lLoading, setLLoading] = useState(false);
  const [rForm, setRForm] = useState({lastName:"",firstName:"",email:"",password:"",confirm:""});
  const [rErrors, setRErrors] = useState({});
  const [rLoading, setRLoading] = useState(false);
  const [fEmail, setFEmail] = useState("");
  const [fLoading, setFLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const leftRef = useRef(null);
  const cardRef = useRef(null);
  const orbRefs = useRef([]);
  const t = T[lang];
  const getErr = (code) => t.errMap[code] || t.errMap["default"];

  useEffect(() => {
    if (!document.getElementById("forta-font")) {
      const style = document.createElement("style");
      style.id = "forta-font";
      style.textContent = `@font-face { font-family: 'Forta'; src: url('${fortaFont}') format('truetype'); font-weight: normal; font-style: normal; }`;
      document.head.appendChild(style);
    }

    const boot = () => {
      if (!window.anime) return;
      const a = window.anime;
      a({ targets: leftRef.current, opacity:[0,1], translateX:[-30,0], duration:700, easing:"easeOutExpo", delay:100 });
      a({ targets: cardRef.current, opacity:[0,1], translateY:[24,0], duration:650, easing:"easeOutExpo", delay:250 });
      a({ targets:".lp-char", opacity:[0,1], translateY:[16,0], delay:a.stagger(45,{start:500}), duration:380, easing:"easeOutExpo" });
      a({ targets:".lp-li", opacity:[0,1], translateY:[10,0], delay:a.stagger(90,{start:650}), duration:360, easing:"easeOutExpo" });
      orbRefs.current.forEach((o,i) => {
        if (!o) return;
        a({ targets:o, translateX:()=>a.random(-18,18), translateY:()=>a.random(-18,18), duration:()=>a.random(4000,6500), loop:true, direction:"alternate", easing:"easeInOutSine", delay:i*400 });
      });
    };
    if (window.anime) { boot(); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js";
    s.onload = boot;
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch(_) {} };
  }, []);

  const goTab = (next) => { setTab(next); setError(""); setResetSent(""); };

  const shakeCard = () => {
    if (!window.anime) return;
    window.anime({ targets: cardRef.current, translateX:[-6,6,-4,4,-2,2,0], duration:340, easing:"easeInOutQuad" });
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setError(""); setLLoading(true);
    try { await login(lEmail, lPw); navigate("/dashboard"); }
    catch (err) { setError(getErr(err.code)); shakeCard(); }
    finally { setLLoading(false); }
  };

  const validateReg = () => {
    const e = {};
    const last=sanitize(rForm.lastName), first=sanitize(rForm.firstName);
    const email=sanitize(rForm.email), pw=rForm.password, pw2=rForm.confirm;
    if (!last||last.length<2) e.lastName=t.lastMin; else if(hasBadWord(last)) e.lastName=t.badContent;
    if (!first||first.length<2) e.firstName=t.firstMin; else if(hasBadWord(first)) e.firstName=t.badContent;
    if (!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email=t.badEmail; else if(hasBadWord(email)) e.email=t.badEmailContent;
    if (!PASSWORD_REGEX.test(pw)) e.password=t.weakPw; else if(hasBadWord(pw)) e.password=t.badPwContent;
    if (pw!==pw2) e.confirm=t.pwMismatch;
    setRErrors(e); return Object.keys(e).length===0;
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setError("");
    if (!validateReg()) return;
    setRLoading(true);
    try { await register(sanitize(rForm.email), rForm.password, sanitize(rForm.firstName), sanitize(rForm.lastName)); navigate("/dashboard"); }
    catch (err) { setError(getErr(err.code)); shakeCard(); }
    finally { setRLoading(false); }
  };

  const handleForgot = async (e) => {
    e.preventDefault(); setError(""); setFLoading(true);
    try { await resetPassword(fEmail); setResetSent(t.resetSent(fEmail)); }
    catch (err) { setError(getErr(err.code)); }
    finally { setFLoading(false); }
  };

  const handleGoogle = async () => {
    setError(""); setGLoading(true);
    try { await loginWithGoogle(); navigate("/dashboard"); }
    catch (err) {
      if (err.code!=="auth/popup-closed-by-user"&&err.code!=="auth/cancelled-popup-request") setError(getErr(err.code));
    }
    finally { setGLoading(false); }
  };

  const pwStr = (() => {
    const pw=rForm.password; if(!pw) return 0;
    let s=0;
    if(pw.length>=8)s++; if(/[A-Z]/.test(pw))s++; if(/\d/.test(pw))s++; if(/[^A-Za-z0-9]/.test(pw))s++;
    return s;
  })();
  const sC = ["","#e05c5c","#e0a85c","#5cb8e0","#4caf82"];

  return (
    <div className="lp-root">
      <div className="lp-bg" aria-hidden="true">
        {[0,1,2,3,4].map(i=>(
          <div key={i} className="lp-orb" ref={el=>orbRefs.current[i]=el}
            style={{width:`${150+i*50}px`,height:`${150+i*50}px`,
              left:`${[8,62,18,78,42][i]}%`,top:`${[12,52,78,18,48][i]}%`,
              opacity:0.05+i*0.006}}/>
        ))}
        <div className="lp-grid"/>
      </div>

      <div className="lp-lang">
        {["HU","EN"].map(l=>(
          <button key={l} className={"lp-lb"+(lang===l?" on":"")} onClick={()=>setLang(l)}>
            {l==="HU"?"🇭🇺":"🇬🇧"} {l}
          </button>
        ))}
      </div>

      <div className="lp-layout">
        <div className="lp-left" ref={leftRef}>

          <div className="lp-brand lp-li">
            <div className="lp-logo-wrap">
              <img src={logo} alt="SoftTrack" className="lp-logo-img"/>
            </div>
            <span className="lp-bname">
              {"SoftTrack".split("").map((c,i)=><span key={i} className="lp-char">{c}</span>)}
            </span>
          </div>

          <div className="lp-slogan lp-li">
            {t.slogan.map((l,i)=><div key={i}>{l}</div>)}
          </div>

          <p className="lp-sub2 lp-li">{t.sub}</p>

          <div className="lp-li">
            <FeatureTicker features={t.features}/>
          </div>

        </div>

        <div className="lp-right">
          <div className="lp-card" ref={cardRef}>

            {tab==="login" && (
              <div className="lp-fw">
                <div className="lp-tabs">
                  <button className="lp-tab on">{t.tabLogin}</button>
                  <button className="lp-tab" onClick={()=>goTab("register")}>{t.tabRegister}</button>
                  <div className="lp-ti" style={{transform:"translateX(0%)"}}/>
                </div>
                <button className="lp-goog" onClick={handleGoogle} disabled={gLoading} type="button">
                  {gLoading?<span className="lp-sp"/>:<GIcon/>}{t.google}
                </button>
                <div className="lp-or"><span>{t.or}</span></div>
                {error&&<div className="lp-err">⚠ {error}</div>}
                <form onSubmit={handleLogin}>
                  <div className="lp-f">
                    <label>{t.email}</label>
                    <input type="email" placeholder={t.emailPh} value={lEmail} onChange={e=>setLEmail(e.target.value)} required autoComplete="email"/>
                  </div>
                  <div className="lp-f">
                    <div className="lp-fh">
                      <label>{t.password}</label>
                      <button type="button" className="lp-fl" onClick={()=>goTab("forgot")}>{t.forgot}</button>
                    </div>
                    <input type="password" placeholder={t.passPh} value={lPw} onChange={e=>setLPw(e.target.value)} required autoComplete="current-password"/>
                  </div>
                  <button type="submit" className="lp-sub" disabled={lLoading}>
                    {lLoading?<span className="lp-sp"/>:t.submitLogin}
                  </button>
                </form>
                <p className="lp-sw">{t.noAccount} <button type="button" className="lp-sl" onClick={()=>goTab("register")}>{t.registerLink}</button></p>
              </div>
            )}

            {tab==="register" && (
              <div className="lp-fw">
                <div className="lp-tabs">
                  <button className="lp-tab" onClick={()=>goTab("login")}>{t.tabLogin}</button>
                  <button className="lp-tab on">{t.tabRegister}</button>
                  <div className="lp-ti" style={{transform:"translateX(100%)"}}/>
                </div>
                <button className="lp-goog" onClick={handleGoogle} disabled={gLoading} type="button">
                  {gLoading?<span className="lp-sp"/>:<GIcon/>}{t.google}
                </button>
                <div className="lp-or"><span>{t.or}</span></div>
                {error&&<div className="lp-err">⚠ {error}</div>}
                <form onSubmit={handleRegister} noValidate>
                  <div className="lp-row">
                    <div className="lp-f">
                      <label>{t.lastName} <span className="lp-req">*</span></label>
                      <input type="text" placeholder={t.lastPh} value={rForm.lastName}
                        onChange={e=>setRForm(p=>({...p,lastName:e.target.value}))}
                        className={rErrors.lastName?"ie":""} autoComplete="family-name" required/>
                      {rErrors.lastName&&<span className="lp-fe">{rErrors.lastName}</span>}
                    </div>
                    <div className="lp-f">
                      <label>{t.firstName} <span className="lp-req">*</span></label>
                      <input type="text" placeholder={t.firstPh} value={rForm.firstName}
                        onChange={e=>setRForm(p=>({...p,firstName:e.target.value}))}
                        className={rErrors.firstName?"ie":""} autoComplete="given-name" required/>
                      {rErrors.firstName&&<span className="lp-fe">{rErrors.firstName}</span>}
                    </div>
                  </div>
                  <div className="lp-f">
                    <label>{t.email} <span className="lp-req">*</span></label>
                    <input type="email" placeholder={t.emailPh} value={rForm.email}
                      onChange={e=>setRForm(p=>({...p,email:e.target.value}))}
                      className={rErrors.email?"ie":""} autoComplete="email" required/>
                    {rErrors.email&&<span className="lp-fe">{rErrors.email}</span>}
                  </div>
                  <div className="lp-f">
                    <label>{t.password} <span className="lp-req">*</span></label>
                    <input type="password" placeholder="Min. 8 kar., nagy/kisbetű, szám, spec." value={rForm.password}
                      onChange={e=>setRForm(p=>({...p,password:e.target.value}))}
                      className={rErrors.password?"ie":""} autoComplete="new-password" required/>
                    {rForm.password&&(
                      <div className="lp-str">
                        <div className="lp-stb">
                          {[1,2,3,4].map(i=><div key={i} className="lp-sb" style={{background:i<=pwStr?sC[pwStr]:"#e0e0e0"}}/>)}
                        </div>
                        <span style={{fontSize:"11px",color:sC[pwStr],fontWeight:500,whiteSpace:"nowrap"}}>{t.strength[pwStr]}</span>
                      </div>
                    )}
                    {rErrors.password&&<span className="lp-fe">{rErrors.password}</span>}
                  </div>
                  <div className="lp-f">
                    <label>{t.confirmPw} <span className="lp-req">*</span></label>
                    <input type="password" placeholder={t.confirmPh} value={rForm.confirm}
                      onChange={e=>setRForm(p=>({...p,confirm:e.target.value}))}
                      className={rErrors.confirm?"ie":""} autoComplete="new-password" required/>
                    {rErrors.confirm&&<span className="lp-fe">{rErrors.confirm}</span>}
                  </div>
                  <button type="submit" className="lp-sub" disabled={rLoading}>
                    {rLoading?<span className="lp-sp"/>:t.submitRegister}
                  </button>
                </form>
                <p className="lp-sw">{t.hasAccount} <button type="button" className="lp-sl" onClick={()=>goTab("login")}>{t.loginLink}</button></p>
              </div>
            )}

            {tab==="forgot" && (
              <div className="lp-fw">
                <div className="lp-ftop">
                  <div className="lp-fico">🔑</div>
                  <h2 className="lp-fttl">{t.forgotTitle}</h2>
                  <p className="lp-fsub">{t.forgotSub}</p>
                </div>
                {error&&<div className="lp-err">⚠ {error}</div>}
                {resetSent&&<div className="lp-ok">{resetSent}</div>}
                {!resetSent&&(
                  <form onSubmit={handleForgot}>
                    <div className="lp-f">
                      <label>{t.email}</label>
                      <input type="email" placeholder={t.emailPh} value={fEmail} onChange={e=>setFEmail(e.target.value)} required autoComplete="email"/>
                    </div>
                    <button type="submit" className="lp-sub" disabled={fLoading}>
                      {fLoading?<span className="lp-sp"/>:t.sendReset}
                    </button>
                  </form>
                )}
                <button type="button" className="lp-back" onClick={()=>goTab("login")}>{t.backToLogin}</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}