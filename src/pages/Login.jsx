import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import logo from "../assets/logo.jpeg";
import bg from "../assets/image2.jpeg";

const Eye = ({ open }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    )}
  </svg>
);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --blue:   #1d4ed8;
  --blue2:  #3b82f6;
  --blue3:  #93c5fd;
  --indigo: #4f46e5;

  --text-primary:   #0f172a;
  --text-secondary: #475569;
  --text-muted:     #94a3b8;
  --text-hint:      #cbd5e1;

  --bg-page:    #f1f5f9;
  --bg-white:   #ffffff;
  --bg-input:   #f8fafc;
  --border:     #e2e8f0;
  --border-md:  #cbd5e1;

  --ff: 'Lora', Georgia, serif;
  --fb: 'Inter', system-ui, sans-serif;
}

html, body {
  height: 100%;
  font-family: var(--fb);
  -webkit-font-smoothing: antialiased;
  background: var(--bg-page);
  overflow: auto;
}

/* ── LAYOUT ── */
.lg-wrap {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* ─────────────────────────────────────────
   PANNEAU GAUCHE
───────────────────────────────────────── */
.lg-left {
  flex: 1.2;
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #1e3a8a 0%, #1e40af 40%, #1d4ed8 100%);
}

/* Image de fond */
.lg-bg {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  filter: brightness(0.72) saturate(1.05);
  transform: scale(1.04);
}

/* Calque couleur */
.lg-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    150deg,
    rgba(30,58,138,0.55) 0%,
    rgba(29,78,216,0.40) 55%,
    rgba(67,56,202,0.52) 100%
  );
}

/* Cercles décoratifs subtils */
.lg-circle-a {
  position: absolute; top: -100px; right: -60px;
  width: 320px; height: 320px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.07);
  pointer-events: none;
}
.lg-circle-b {
  position: absolute; bottom: -80px; left: -40px;
  width: 260px; height: 260px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.05);
  pointer-events: none;
}
.lg-circle-c {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  width: 500px; height: 500px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.04);
  pointer-events: none;
}

/* Contenu panneau gauche */
.lg-left-body {
  position: absolute; inset: 0; z-index: 5;
  display: flex; flex-direction: column; justify-content: center;
  padding: 64px 60px;
}

/* ── Logo ── */
.lg-logo {
  display: flex; align-items: center; gap: 13px;
  margin-bottom: 56px;
}
.lg-logo-gem {
  width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.18);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
}
.lg-logo-name {
  font-family: var(--ff); font-size: 20px; font-weight: 600;
  color: #fff; letter-spacing: 0.2px; line-height: 1;
}
.lg-logo-sub {
  font-size: 9px; font-weight: 600; letter-spacing: 3px;
  text-transform: uppercase; color: rgba(255,255,255,0.40);
  margin-top: 4px; display: block;
}

/* ── Héros texte ── */
.lg-eyebrow {
  display: flex; align-items: center; gap: 9px;
  font-size: 9px; font-weight: 700; letter-spacing: 3.5px;
  text-transform: uppercase; color: rgba(255,255,255,0.38);
  margin-bottom: 14px;
}
.lg-eyebrow::before {
  content: ''; display: block;
  width: 20px; height: 1px;
  background: rgba(255,255,255,0.30);
  border-radius: 2px;
}

.lg-title {
  font-family: var(--ff); font-size: 48px; font-weight: 600;
  color: #fff; letter-spacing: -1.2px;
  line-height: 1.07; margin-bottom: 18px;
}
.lg-title-accent {
  display: block;
  color: var(--blue3);
}

.lg-desc {
  font-size: 13.5px; color: rgba(255,255,255,0.50);
  line-height: 1.80; max-width: 360px; font-weight: 400;
}

/* Citation */
.lg-quote-wrap {
  margin-top: 48px;
  padding: 16px 18px;
  border-left: 2px solid rgba(147,197,253,0.35);
  background: rgba(255,255,255,0.06);
  border-radius: 0 10px 10px 0;
  max-width: 370px;
  backdrop-filter: blur(4px);
}
.lg-quote-text {
  font-family: var(--ff); font-size: 13px; font-style: italic;
  color: rgba(255,255,255,0.45); line-height: 1.70;
}
.lg-quote-author {
  font-size: 10px; font-weight: 600;
  letter-spacing: 1.5px; text-transform: uppercase;
  color: rgba(147,197,253,0.40); margin-top: 9px; display: block;
}

/* ─────────────────────────────────────────
   PANNEAU DROIT
───────────────────────────────────────── */
.lg-right {
  width: 460px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  padding: 32px;
  background: var(--bg-page);
  position: relative;
}

/* ── Card formulaire ── */
.lg-card {
  width: 100%; max-width: 390px;
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 36px 34px 32px;
  box-shadow:
    0 1px 3px rgba(0,0,0,0.05),
    0 8px 32px rgba(0,0,0,0.07),
    0 24px 64px rgba(0,0,0,0.05);
}

/* Header card */
.lg-card-header {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 28px; padding-bottom: 22px;
  border-bottom: 1px solid var(--border);
}
.lg-card-logo {
  width: 42px; height: 42px; border-radius: 11px;
  object-fit: cover;
  border: 1px solid var(--border);
  flex-shrink: 0;
}
.lg-card-logo-fb {
  width: 42px; height: 42px; border-radius: 11px; flex-shrink: 0;
  background: linear-gradient(135deg, #1e3a8a, #4f46e5);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(0,0,0,0.08);
}
.lg-card-name {
  font-family: var(--ff); font-size: 16px; font-weight: 600;
  color: var(--text-primary); letter-spacing: -0.2px; line-height: 1.2;
}
.lg-card-sub {
  font-size: 10px; font-weight: 600; letter-spacing: 2px;
  text-transform: uppercase; color: var(--text-muted);
  margin-top: 3px; display: block;
}

/* Titre formulaire */
.lg-form-h {
  font-family: var(--ff); font-size: 24px; font-weight: 600;
  color: var(--text-primary); letter-spacing: -0.4px;
  margin-bottom: 4px; line-height: 1.2;
}
.lg-form-sub {
  font-size: 12.5px; color: var(--text-muted);
  margin-bottom: 24px; line-height: 1.5;
}

/* ── Champs ── */
.lg-fld { margin-bottom: 12px; }
.lg-fld-lbl {
  display: block; font-size: 11px; font-weight: 600;
  letter-spacing: 0.4px;
  color: var(--text-secondary); margin-bottom: 6px;
}
.lg-iw { position: relative; }
.lg-ico {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  color: var(--text-hint); display: flex; pointer-events: none;
  transition: color .18s;
}
.lg-ico.on { color: var(--blue2); }
.lg-inp {
  width: 100%; padding: 10px 13px 10px 38px;
  border-radius: 9px;
  border: 1.5px solid var(--border);
  background: var(--bg-input);
  color: var(--text-primary);
  font-size: 13px; font-family: var(--fb);
  outline: none; caret-color: var(--blue2);
  transition: all .18s;
}
.lg-inp::placeholder { color: var(--text-hint); }
.lg-inp:focus {
  border-color: var(--blue2);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
}
.lg-inp.err {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.10) !important;
}
.lg-eye-btn {
  position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
  cursor: pointer; color: var(--text-hint); display: flex;
  transition: color .18s; background: none; border: none; padding: 3px;
}
.lg-eye-btn:hover { color: var(--blue2); }

/* Mot de passe oublié */
.lg-forgot {
  text-align: right; margin: -2px 0 16px;
  font-size: 11.5px; font-weight: 600;
  color: var(--blue2); cursor: pointer;
  transition: opacity .15s; opacity: 0.75;
}
.lg-forgot:hover { opacity: 1; }

/* Message d'erreur */
.lg-err-box {
  display: flex; align-items: center; gap: 9px;
  padding: 10px 13px; border-radius: 9px; margin-bottom: 13px;
  background: #fef2f2;
  border: 1.5px solid #fecaca;
  font-size: 12px; color: #dc2626; font-weight: 500; line-height: 1.5;
}
.lg-err-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #ef4444; flex-shrink: 0;
}

/* Bouton principal */
.lg-btn {
  width: 100%; padding: 12px 16px;
  border-radius: 9px; border: none; cursor: pointer;
  background: linear-gradient(135deg, var(--blue) 0%, var(--indigo) 100%);
  color: #fff; font-size: 13.5px; font-weight: 600;
  font-family: var(--fb); letter-spacing: -0.1px;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  box-shadow: 0 4px 14px rgba(29,78,216,0.28), 0 1px 3px rgba(0,0,0,0.12);
  transition: all .2s;
}
.lg-btn:hover:not(:disabled) {
  opacity: 0.90; transform: translateY(-1.5px);
  box-shadow: 0 8px 22px rgba(29,78,216,0.34);
}
.lg-btn:active:not(:disabled) { transform: scale(0.985); }
.lg-btn:disabled { opacity: 0.40; cursor: not-allowed; }

/* Spinner */
.lg-spin {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.30);
  border-top-color: #fff;
  animation: spinAnim .7s linear infinite;
}
@keyframes spinAnim { to { transform: rotate(360deg); } }

/* Divider */
.lg-divider {
  display: flex; align-items: center; gap: 10px;
  margin: 16px 0;
}
.lg-divider-line { flex: 1; height: 1px; background: var(--border); }
.lg-divider-txt {
  font-size: 11px; color: var(--text-muted);
  font-weight: 500; white-space: nowrap;
}

/* Bouton secondaire */
.lg-btn2 {
  width: 100%; padding: 11px 16px;
  border-radius: 9px;
  border: 1.5px solid var(--border);
  background: var(--bg-input);
  color: var(--text-secondary);
  font-size: 13px; font-weight: 500;
  font-family: var(--fb);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all .18s;
}
.lg-btn2:hover {
  background: #f1f5f9;
  border-color: var(--border-md);
  color: var(--text-primary);
  transform: translateY(-1px);
}

/* Badge bas */
.lg-badge-secure {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  margin-top: 16px; font-size: 10.5px;
  color: var(--text-hint);
}

/* Responsive */
@media (max-width: 860px) {
  .lg-left  { display: none; }
  .lg-right { width: 100%; padding: 20px; background: var(--bg-page); }
}
`;

if (typeof document !== "undefined" && !document.getElementById("lg-css")) {
  const s = document.createElement("style");
  s.id = "lg-css"; s.textContent = CSS;
  document.head.appendChild(s);
}

export default function Login() {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [userState,    setUserState]    = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focused,      setFocused]      = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await api.post("/login", { email, password });
      const { user, token } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUserState(user);
      if      (user.role_id === 1) navigate("/admin");
      else if (user.role_id === 3) navigate("/responsable");
      else                         navigate("/alumni");
    } catch (err) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect");
    } finally { setLoading(false); }
  };

  const showForgot = userState ? !userState.must_change_password : true;

  return (
    <>
      <style>{CSS}</style>
      <div className="lg-wrap">

        {/* ══ PANNEAU GAUCHE ══ */}
        <div className="lg-left">
          <img src={bg} alt="" className="lg-bg" />
          <div className="lg-overlay" />
          <div className="lg-circle-a" />
          <div className="lg-circle-b" />
          <div className="lg-circle-c" />

          <div className="lg-left-body">

            {/* Logo */}
            <motion.div className="lg-logo"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}>
              <div className="lg-logo-gem">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.1">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <div>
                <div className="lg-logo-name">Alumni</div>
                <span className="lg-logo-sub">Réseau · Anciens Élèves</span>
              </div>
            </motion.div>

            {/* Héros */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.55, ease: "easeOut" }}>
              <div className="lg-eyebrow">Plateforme officielle</div>
              <h1 className="lg-title">
                Votre réseau,<br />
                <span className="lg-title-accent">votre avenir.</span>
              </h1>
              <p className="lg-desc">
                Accédez à votre espace alumni, retrouvez d'anciens camarades
                et construisez des connexions professionnelles durables.
              </p>
            </motion.div>

            {/* Citation */}
            <motion.div className="lg-quote-wrap"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.52, ease: "easeOut" }}>
              <p className="lg-quote-text">
                Le réseau alumni, c'est la mémoire vivante de l'institution
                et le tremplin vers demain.
              </p>
              <span className="lg-quote-author">Direction Académique</span>
            </motion.div>

          </div>
        </div>

        {/* ══ PANNEAU DROIT ══ */}
        <div className="lg-right">
          <motion.div className="lg-card"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}>

            {/* Header */}
            <div className="lg-card-header">
              {logo ? (
                <img src={logo} alt="Logo" className="lg-card-logo" />
              ) : (
                <div className="lg-card-logo-fb">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="#fff" strokeWidth="2.1">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
              )}
              <div>
                <div className="lg-card-name">Alumni</div>
                <span className="lg-card-sub">Connexion sécurisée</span>
              </div>
            </div>

            {/* Titre */}
            <div className="lg-form-h">Bon retour</div>
            <div className="lg-form-sub">Connectez-vous à votre espace personnel</div>

            <form onSubmit={handleLogin} noValidate>

              {/* Email */}
              <div className="lg-fld">
                <label className="lg-fld-lbl">Adresse email</label>
                <div className="lg-iw">
                  <span className={`lg-ico${focused === "email" ? " on" : ""}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input className={`lg-inp${error ? " err" : ""}`}
                    type="email" placeholder="nom@exemple.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    autoComplete="email" />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="lg-fld">
                <label className="lg-fld-lbl">Mot de passe</label>
                <div className="lg-iw">
                  <span className={`lg-ico${focused === "pwd" ? " on" : ""}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input className={`lg-inp${error ? " err" : ""}`}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password} onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("pwd")}
                    onBlur={() => setFocused("")}
                    autoComplete="current-password"
                    style={{ paddingRight: 44 }} />
                  <button type="button" className="lg-eye-btn"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={0} aria-label="Afficher le mot de passe">
                    <Eye open={showPassword} />
                  </button>
                </div>
              </div>

              {/* Lien oublié */}
              {showForgot && (
                <div className="lg-forgot"
                  onClick={() => navigate("/forgot-password")}
                  role="button" tabIndex={0}>
                  Mot de passe oublié ?
                </div>
              )}

              {/* Erreur */}
              <AnimatePresence>
                {error && (
                  <motion.div className="lg-err-box"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}>
                    <div className="lg-err-dot" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button type="submit" className="lg-btn"
                disabled={loading || !email || !password}
                whileTap={{ scale: 0.975 }}>
                {loading ? (
                  <><div className="lg-spin" /> Connexion en cours…</>
                ) : (
                  <>
                    Se connecter
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="lg-divider">
              <div className="lg-divider-line" />
              <span className="lg-divider-txt">Nouveau sur la plateforme ?</span>
              <div className="lg-divider-line" />
            </div>

            {/* Créer compte */}
            <motion.button className="lg-btn2"
              onClick={() => navigate("/")}
              whileTap={{ scale: 0.975 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.9">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              Créer un compte Alumni
            </motion.button>

            {/* Sécurité */}
            <div className="lg-badge-secure">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Connexion chiffrée SSL · Données protégées
            </div>

          </motion.div>
        </div>

      </div>
    </>
  );
}
