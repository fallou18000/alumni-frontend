import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import bg from "../assets/universite.jpeg";

/* ─────────────────────────────────────────────
   CSS — THÈME CLAIR LUXUEUX
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow: auto;
}

.rg-wrap {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.rg-left {
  flex: 1.25;
  position: relative;
  overflow: hidden;
}

.rg-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.82) saturate(1.08) contrast(1.03);
  transform: scale(1.03);
  transition: transform 18s ease;
}

.rg-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(2, 5, 14, 0.42) 0%,
    rgba(3, 8, 22, 0.18) 48%,
    rgba(2, 5, 14, 0.38) 100%
  );
}

.rg-fade-bottom {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 62%;
  background: linear-gradient(
    to top,
    rgba(2, 5, 14, 0.82) 0%,
    rgba(2, 5, 14, 0.45) 40%,
    transparent 100%
  );
  pointer-events: none;
}

.rg-seam {
  position: absolute;
  top: 0; right: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(99, 102, 241, 0.30) 22%,
    rgba(139, 92, 246, 0.50) 52%,
    rgba(99, 102, 241, 0.28) 80%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 10;
}

.rg-left-logo {
  position: absolute;
  top: 38px; left: 48px;
  z-index: 8;
  display: flex;
  align-items: center;
  gap: 14px;
}
.rg-logo-img {
  width: 68px; height: 68px; border-radius: 18px; object-fit: cover;
  border: 2.5px solid rgba(255,255,255,0.35);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.12), 0 10px 36px rgba(0,0,0,0.52), 0 0 24px rgba(99,102,241,0.20);
  filter: brightness(1.08) contrast(1.04);
}
.rg-logo-fb {
  width: 68px; height: 68px; border-radius: 18px;
  background: linear-gradient(135deg,#1e3a8a,#5b21b6);
  display: flex; align-items: center; justify-content: center;
  border: 2.5px solid rgba(255,255,255,0.22);
  box-shadow: 0 10px 36px rgba(0,0,0,0.52);
}
.rg-logo-name {
  font-family: 'Lora', Georgia, serif;
  font-size: 23px; font-weight: 600;
  color: #fff; letter-spacing: 0.2px; line-height: 1;
  text-shadow: 0 2px 14px rgba(0,0,0,0.45);
}
.rg-logo-sub {
  display: block; font-size: 8.5px; font-weight: 600;
  letter-spacing: 3px; text-transform: uppercase;
  color: rgba(196,181,253,0.65); margin-top: 5px;
}

.rg-left-body {
  position: absolute;
  inset: 0; z-index: 5;
  display: flex; flex-direction: column;
  justify-content: flex-end;
  padding: 0 56px 52px;
}
.rg-eyebrow {
  display: flex; align-items: center; gap: 9px;
  font-size: 9px; font-weight: 700; letter-spacing: 3.5px;
  text-transform: uppercase; color: rgba(196,181,253,0.65);
  margin-bottom: 16px;
}
.rg-eyebrow::before {
  content: ''; width: 22px; height: 1.5px;
  background: linear-gradient(90deg,rgba(196,181,253,0.7),transparent);
  border-radius: 2px; display: block;
}
.rg-title {
  font-family: 'Lora', Georgia, serif;
  font-size: 50px; font-weight: 600;
  color: rgba(255,255,255,0.97); letter-spacing: -1.1px;
  line-height: 1.07; margin-bottom: 16px;
  text-shadow: 0 4px 28px rgba(0,0,0,0.38);
}
.rg-title-accent {
  display: block;
  background: linear-gradient(110deg,#93c5fd 15%,#c4b5fd 85%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.rg-desc {
  font-size: 14px; color: rgba(255,255,255,0.50);
  line-height: 1.78; max-width: 400px; margin-bottom: 36px;
}

.rg-steps {
  display: flex; flex-direction: column;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 16px; overflow: hidden;
  backdrop-filter: blur(16px); max-width: 440px;
}
.rg-step {
  display: flex; align-items: center; gap: 16px;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.rg-step:last-child { border-bottom: none; }
.rg-step-num {
  width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
  background: rgba(99,102,241,0.22);
  border: 1px solid rgba(99,102,241,0.36);
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono',monospace; font-size: 11px;
  font-weight: 500; color: #a5b4fc;
}
.rg-step-title { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.78); }
.rg-step-sub   { font-size: 11px; color: rgba(255,255,255,0.32); margin-top: 2px; }

.rg-right {
  width: 510px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  padding: 24px 32px;
  background: linear-gradient(160deg, #f8faff 0%, #f1f4fd 100%);
  position: relative; overflow: hidden;
}

.rg-right::before {
  content: '';
  position: absolute;
  width: 500px; height: 500px; border-radius: 50%;
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  background: radial-gradient(circle,rgba(99,102,241,0.06),transparent 65%);
  filter: blur(60px); pointer-events: none;
}
.rg-right::after {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 300px; height: 300px; border-radius: 50%;
  background: radial-gradient(circle,rgba(139,92,246,0.05),transparent 65%);
  filter: blur(50px); pointer-events: none;
}

.rg-card {
  width: 100%;
  max-width: 440px;
  max-height: calc(100vh - 48px);
  overflow-y: auto; overflow-x: hidden;
  position: relative; z-index: 2;
  background: #ffffff;
  border: 1px solid rgba(15,23,42,0.07);
  border-radius: 24px;
  padding: 32px 30px 28px;
  box-shadow:
    0 4px 6px rgba(15,23,42,0.03),
    0 20px 60px rgba(15,23,42,0.09),
    0 0 0 1px rgba(99,102,241,0.04);
  scrollbar-width: thin;
  scrollbar-color: rgba(99,102,241,0.18) transparent;
}
.rg-card::-webkit-scrollbar { width: 2px; }
.rg-card::-webkit-scrollbar-thumb {
  background: rgba(99,102,241,0.18); border-radius: 2px;
}

.rg-card-top-bar {
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  border-radius: 24px 24px 0 0;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4);
}

.rg-card-header {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 22px; padding-bottom: 20px;
  border-bottom: 1px solid rgba(15,23,42,0.06);
}
.rg-card-logo-img {
  width: 54px; height: 54px; border-radius: 14px;
  object-fit: cover; flex-shrink: 0;
  border: 2px solid rgba(99,102,241,0.15);
  box-shadow: 0 4px 16px rgba(15,23,42,0.12), 0 0 0 1px rgba(99,102,241,0.08);
  filter: brightness(1.05) contrast(1.02);
}
.rg-card-logo-fb {
  width: 54px; height: 54px; border-radius: 14px; flex-shrink: 0;
  background: linear-gradient(135deg,#4f46e5,#7c3aed);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(79,70,229,0.3);
}
.rg-card-name {
  font-family: 'Lora', Georgia, serif;
  font-size: 17px; font-weight: 600;
  color: #0f172a; letter-spacing: -0.2px; line-height: 1.2;
}
.rg-card-sub {
  display: block; font-size: 9px; font-weight: 600;
  letter-spacing: 2.2px; text-transform: uppercase;
  color: #6366f1; opacity: 0.6; margin-top: 4px;
}

.rg-form-h {
  font-family: 'Lora', Georgia, serif;
  font-size: 22px; font-weight: 600;
  color: #0f172a; letter-spacing: -0.4px;
  margin-bottom: 4px; line-height: 1.2;
}
.rg-form-sub { font-size: 12px; color: #94a3b8; margin-bottom: 18px; line-height: 1.5; }

.rg-section {
  display: flex; align-items: center; gap: 8px;
  font-size: 8px; font-weight: 700; letter-spacing: 2.5px;
  text-transform: uppercase; color: #94a3b8;
  margin: 14px 0 10px;
}
.rg-section::after {
  content: ''; flex: 1; height: 1px; background: #e2e8f0;
}

.rg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.rg-fld { display: flex; flex-direction: column; gap: 5px; }
.rg-lbl {
  font-size: 8.5px; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; color: #64748b;
}
.rg-inp-wrap { position: relative; }
.rg-ico {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  color: #94a3b8; display: flex; pointer-events: none; transition: color .18s;
}
.rg-ico.on { color: #6366f1; }
.rg-inp, .rg-sel {
  width: 100%;
  padding: 10px 13px 10px 37px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #f8faff;
  color: #0f172a;
  font-size: 12.5px; font-family: 'Inter', system-ui, sans-serif;
  outline: none; caret-color: #6366f1;
  transition: all .2s; letter-spacing: -0.1px;
}
.rg-inp::placeholder { color: #c8d3e0; }
.rg-inp:focus, .rg-sel:focus {
  border-color: #6366f1;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.10);
}
.rg-sel { appearance: none; cursor: pointer; }
.rg-sel option { background: #fff; color: #0f172a; }
.rg-sel:disabled { opacity: 0.40; cursor: not-allowed; }
.rg-sel-arr {
  position: absolute; right: 11px; top: 50%; transform: translateY(-50%);
  color: #94a3b8; pointer-events: none;
}

/* ── Skeleton loader UFR ── */
.rg-skeleton {
  height: 38px; border-radius: 10px;
  background: linear-gradient(90deg, #f1f4fd 25%, #e8ecf8 50%, #f1f4fd 75%);
  background-size: 200% 100%;
  animation: rg-shimmer 1.4s infinite;
  border: 1.5px solid #e2e8f0;
}
@keyframes rg-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Bannière erreur chargement ── */
.rg-load-err {
  display: flex; align-items: center; justify-content: space-between;
  gap: 10px; padding: 9px 13px; border-radius: 10px; margin-bottom: 10px;
  background: #fff7ed; border: 1px solid #fed7aa;
  font-size: 11.5px; color: #92400e; font-weight: 500;
}
.rg-load-err button {
  background: none; border: none; cursor: pointer;
  color: #ea580c; font-size: 11px; font-weight: 700;
  padding: 3px 8px; border-radius: 6px;
  border: 1px solid rgba(234,88,12,0.30);
  white-space: nowrap; transition: all .15s;
}
.rg-load-err button:hover { background: rgba(234,88,12,0.08); }

.rg-upload {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 18px 14px; border-radius: 12px;
  border: 1.5px dashed rgba(99,102,241,0.30);
  background: rgba(99,102,241,0.03);
  cursor: pointer; transition: all .22s; text-align: center;
}
.rg-upload:hover {
  border-color: rgba(99,102,241,0.55);
  background: rgba(99,102,241,0.06);
}
.rg-upload.done {
  border-color: rgba(16,185,129,0.40);
  background: rgba(16,185,129,0.04);
}
.rg-upload-ico {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(99,102,241,0.10);
  border: 1px solid rgba(99,102,241,0.22);
  color: #6366f1; transition: all .2s;
}
.rg-upload.done .rg-upload-ico {
  background: rgba(16,185,129,0.10);
  border-color: rgba(16,185,129,0.28);
  color: #10b981;
}
.rg-upload-title { font-size: 12.5px; font-weight: 600; color: #475569; }
.rg-upload-sub   { font-size: 10.5px; color: #94a3b8; }
.rg-preview {
  width: 100%; max-height: 110px; object-fit: cover;
  border-radius: 10px; border: 1px solid #e2e8f0; margin-top: 6px;
}

.rg-toast {
  display: flex; align-items: center; gap: 9px;
  padding: 11px 14px; border-radius: 10px; margin-bottom: 12px;
  font-size: 12px; font-weight: 500; line-height: 1.5;
}
.rg-toast.success {
  background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;
}
.rg-toast.error {
  background: #fff1f2; border: 1px solid #fecdd3; color: #9f1239;
}
.rg-toast-dot {
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
}
.rg-toast.success .rg-toast-dot { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.5); }
.rg-toast.error   .rg-toast-dot { background: #f43f5e; box-shadow: 0 0 6px rgba(244,63,94,0.5); }

.rg-btn {
  width: 100%; padding: 13px 18px; border-radius: 11px; border: none;
  cursor: pointer;
  background: linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);
  color: #fff; font-size: 13px; font-weight: 600;
  font-family: 'Inter', system-ui, sans-serif; letter-spacing: -0.1px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  position: relative; overflow: hidden;
  box-shadow: 0 4px 16px rgba(79,70,229,0.28), 0 2px 6px rgba(0,0,0,0.08);
  transition: all .2s; margin-top: 16px;
}
.rg-btn::after {
  content: ''; position: absolute;
  top: 0; left: 0; right: 0; height: 50%;
  background: linear-gradient(rgba(255,255,255,0.12), transparent);
  pointer-events: none;
}
.rg-btn:hover:not(:disabled) {
  opacity: 0.90; transform: translateY(-1.5px);
  box-shadow: 0 8px 28px rgba(79,70,229,0.36), 0 3px 8px rgba(0,0,0,0.10);
}
.rg-btn:active:not(:disabled) { transform: scale(0.985); }
.rg-btn:disabled { opacity: 0.42; cursor: not-allowed; }

.rg-spin {
  width: 14px; height: 14px; border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff;
  animation: rg-spin .7s linear infinite; flex-shrink: 0;
}
@keyframes rg-spin { to { transform: rotate(360deg); } }

.rg-login-link {
  text-align: center; margin-top: 14px;
  font-size: 12px; color: #64748b;
}
.rg-login-link a {
  color: #6366f1; font-weight: 600; cursor: pointer;
  transition: color .15s; text-decoration: none;
}
.rg-login-link a:hover { color: #4f46e5; }

.rg-secure {
  display: flex; align-items: center; justify-content: center; gap: 5px;
  margin-top: 12px; font-size: 10px; color: #cbd5e1; letter-spacing: 0.2px;
}

@media (max-width: 860px) {
  .rg-left  { display: none; }
  .rg-right { width: 100%; background: #f8faff; }
}
`;

if (typeof document !== "undefined" && !document.getElementById("rg-css")) {
  const s = document.createElement("style");
  s.id = "rg-css"; s.textContent = CSS;
  document.head.appendChild(s);
}

/* ─── Icônes ─── */
const IcoUser    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const IcoMail    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IcoFile    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const IcoGrad    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const IcoChevron = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="6 9 12 15 18 9"/></svg>;
const IcoUpload  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IcoCheck   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 6L9 17l-5-5"/></svg>;
const IcoArrow   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IcoLock    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IcoRefresh = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;

/* ── Utilitaire fetch avec retry ── */
const fetchWithRetry = async (fn, retries = 3, delayMs = 1500) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(res => setTimeout(res, delayMs * (i + 1)));
    }
  }
};

/* ─────────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────────── */
export default function RegisterAlumni() {
  const [first_name,     setFirstName]     = useState("");
  const [last_name,      setLastName]      = useState("");
  const [email,          setEmail]         = useState("");
  const [numero_dossier, setNumeroDossier] = useState("");
  const [ufr_id,         setUfrId]         = useState("");
  const [departement_id, setDepartementId] = useState("");
  const [filiere_id,     setFiliereId]     = useState("");
  const [file,           setFile]          = useState(null);
  const [preview,        setPreview]       = useState(null);

  const [ufrs,         setUfrs]         = useState([]);
  const [departements, setDepartements] = useState([]);
  const [filieres,     setFilieres]     = useState([]);
  const [focused,      setFocused]      = useState("");
  const [loading,      setLoading]      = useState(false);
  const [toast,        setToast]        = useState(null);

  // États de chargement des selects
  const [ufrsLoading,   setUfrsLoading]   = useState(true);
  const [ufrsError,     setUfrsError]     = useState(false);
  const [deptLoading,   setDeptLoading]   = useState(false);
  const [filLoading,    setFilLoading]    = useState(false);

  const fileRef  = useRef(null);
  const navigate = useNavigate();

  /* ── Chargement UFRs avec retry ── */
  const loadUfrs = () => {
    setUfrsLoading(true);
    setUfrsError(false);
    fetchWithRetry(() => api.get("/ufrs").then(r => r.data))
      .then(data => { setUfrs(data); setUfrsLoading(false); })
      .catch(() => { setUfrsError(true); setUfrsLoading(false); });
  };

  useEffect(() => { loadUfrs(); }, []);

  useEffect(() => {
    if (!ufr_id) { setDepartements([]); setDepartementId(""); return; }
    setDeptLoading(true);
    fetchWithRetry(() => api.get(`/departements-by-ufr/${ufr_id}`).then(r => r.data))
      .then(data => { setDepartements(data); setDeptLoading(false); })
      .catch(() => { setDeptLoading(false); });
    setDepartementId(""); setFiliereId(""); setFilieres([]);
  }, [ufr_id]);

  useEffect(() => {
    if (!departement_id) { setFilieres([]); setFiliereId(""); return; }
    setFilLoading(true);
    fetchWithRetry(() => api.get(`/filieres-by-departement/${departement_id}`).then(r => r.data))
      .then(data => { setFilieres(data); setFilLoading(false); })
      .catch(() => { setFilLoading(false); });
    setFiliereId("");
  }, [departement_id]);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    if (f.type.startsWith("image/")) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("first_name",     first_name);
      fd.append("last_name",      last_name);
      fd.append("email",          email);
      fd.append("numero_dossier", numero_dossier);
      fd.append("ufr_id",         ufr_id);
      fd.append("departement_id", departement_id);
      fd.append("filiere_id",     filiere_id);
      if (file) fd.append("photo_diplome", file);
      await api.post("/register-alumni", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("success", "Demande envoyée ! Vous serez notifié après validation.");
      setTimeout(() => navigate("/login"), 2600);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const isValid = first_name && last_name && email && numero_dossier
    && ufr_id && departement_id && filiere_id;

  return (
    <>
      <style>{CSS}</style>
      <div className="rg-wrap">

        {/* ══ GAUCHE ══ */}
        <div className="rg-left">
          <img src={bg} alt="" className="rg-bg" />
          <div className="rg-veil" />
          <div className="rg-fade-bottom" />
          <div className="rg-seam" />

          <div className="rg-left-logo">
            {logo ? (
              <img src={logo} alt="Alumni" className="rg-logo-img" />
            ) : (
              <div className="rg-logo-fb">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
            )}
            <div>
              <div className="rg-logo-name">Alumni</div>
              <span className="rg-logo-sub">Réseau · Anciens Élèves</span>
            </div>
          </div>

          <div className="rg-left-body">
            <div>
              <div className="rg-eyebrow">Inscription officielle</div>
              <h1 className="rg-title">
                Rejoignez<br />
                <span className="rg-title-accent">la communauté.</span>
              </h1>
              <p className="rg-desc">
                Complétez votre dossier pour intégrer le réseau des anciens
                étudiants et accéder à toutes vos ressources.
              </p>
              <div className="rg-steps">
                {[
                  { n:"01", title:"Identité & coordonnées",  sub:"Prénom, nom et adresse email" },
                  { n:"02", title:"Parcours académique",      sub:"UFR, département et filière" },
                  { n:"03", title:"Justificatif de diplôme", sub:"Téléversez votre document officiel" },
                ].map(s => (
                  <div className="rg-step" key={s.n}>
                    <div className="rg-step-num">{s.n}</div>
                    <div>
                      <div className="rg-step-title">{s.title}</div>
                      <div className="rg-step-sub">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ DROITE ══ */}
        <div className="rg-right">
          <div className="rg-card">
            <div className="rg-card-top-bar" />

            <div className="rg-card-header">
              {logo ? (
                <img src={logo} alt="Logo" className="rg-card-logo-img" />
              ) : (
                <div className="rg-card-logo-fb">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e0e7ff" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
              )}
              <div>
                <div className="rg-card-name">Inscription Alumni</div>
                <span className="rg-card-sub">Plateforme officielle</span>
              </div>
            </div>

            <div className="rg-form-h">Créer votre dossier</div>
            <div className="rg-form-sub">Tous les champs sont requis</div>

            {toast && (
              <div className={`rg-toast ${toast.type}`}>
                <div className="rg-toast-dot" />
                {toast.msg}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Identité */}
              <div className="rg-section">Identité</div>
              <div className="rg-row" style={{ marginBottom: 9 }}>
                <div className="rg-fld">
                  <div className="rg-lbl">Prénom</div>
                  <div className="rg-inp-wrap">
                    <span className={`rg-ico${focused==="fn"?" on":""}`}><IcoUser /></span>
                    <input className="rg-inp" placeholder="Amina"
                      value={first_name} onChange={e => setFirstName(e.target.value)}
                      onFocus={() => setFocused("fn")} onBlur={() => setFocused("")} />
                  </div>
                </div>
                <div className="rg-fld">
                  <div className="rg-lbl">Nom</div>
                  <div className="rg-inp-wrap">
                    <span className={`rg-ico${focused==="ln"?" on":""}`}><IcoUser /></span>
                    <input className="rg-inp" placeholder="Diallo"
                      value={last_name} onChange={e => setLastName(e.target.value)}
                      onFocus={() => setFocused("ln")} onBlur={() => setFocused("")} />
                  </div>
                </div>
              </div>

              <div className="rg-fld" style={{ marginBottom: 9 }}>
                <div className="rg-lbl">Adresse email</div>
                <div className="rg-inp-wrap">
                  <span className={`rg-ico${focused==="em"?" on":""}`}><IcoMail /></span>
                  <input className="rg-inp" type="email" placeholder="amina@exemple.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused("em")} onBlur={() => setFocused("")} />
                </div>
              </div>

              <div className="rg-fld">
                <div className="rg-lbl">Numéro de dossier</div>
                <div className="rg-inp-wrap">
                  <span className={`rg-ico${focused==="nd"?" on":""}`}><IcoFile /></span>
                  <input className="rg-inp" placeholder=""
                    value={numero_dossier} onChange={e => setNumeroDossier(e.target.value)}
                    onFocus={() => setFocused("nd")} onBlur={() => setFocused("")} />
                </div>
              </div>

              {/* Parcours */}
              <div className="rg-section" style={{ marginTop: 14 }}>Parcours académique</div>

              {/* Erreur chargement UFR */}
              {ufrsError && (
                <div className="rg-load-err">
                  <span>⚠️ Impossible de charger les UFR. Serveur en démarrage…</span>
                  <button type="button" onClick={loadUfrs}>
                    <IcoRefresh /> Réessayer
                  </button>
                </div>
              )}

              <div className="rg-fld" style={{ marginBottom: 9 }}>
                <div className="rg-lbl">UFR</div>
                <div className="rg-inp-wrap">
                  {ufrsLoading ? (
                    <div className="rg-skeleton" />
                  ) : (
                    <>
                      <span className="rg-ico"><IcoGrad /></span>
                      <select className="rg-sel" value={ufr_id}
                        disabled={ufrsError}
                        onChange={e => setUfrId(e.target.value)}>
                        <option value="">
                          {ufrsError ? "Erreur de chargement" : "Sélectionner une UFR"}
                        </option>
                        {ufrs.map(u => <option key={u.id} value={u.id}>{u.nom}</option>)}
                      </select>
                      <span className="rg-sel-arr"><IcoChevron /></span>
                    </>
                  )}
                </div>
              </div>

              <div className="rg-row">
                <div className="rg-fld">
                  <div className="rg-lbl">Département</div>
                  <div className="rg-inp-wrap">
                    {deptLoading ? (
                      <div className="rg-skeleton" />
                    ) : (
                      <>
                        <span className="rg-ico"><IcoGrad /></span>
                        <select className="rg-sel" value={departement_id}
                          disabled={!ufr_id || deptLoading}
                          onChange={e => setDepartementId(e.target.value)}>
                          <option value="">Département</option>
                          {departements.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}
                        </select>
                        <span className="rg-sel-arr"><IcoChevron /></span>
                      </>
                    )}
                  </div>
                </div>
                <div className="rg-fld">
                  <div className="rg-lbl">Filière</div>
                  <div className="rg-inp-wrap">
                    {filLoading ? (
                      <div className="rg-skeleton" />
                    ) : (
                      <>
                        <span className="rg-ico"><IcoGrad /></span>
                        <select className="rg-sel" value={filiere_id}
                          disabled={!departement_id || filLoading}
                          onChange={e => setFiliereId(e.target.value)}>
                          <option value="">Filière</option>
                          {filieres.map(f => <option key={f.id} value={f.id}>{f.name||f.nom}</option>)}
                        </select>
                        <span className="rg-sel-arr"><IcoChevron /></span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Diplôme */}
              <div className="rg-section" style={{ marginTop: 14 }}>Justificatif de diplôme</div>
              <input ref={fileRef} type="file" hidden accept="image/*,.pdf" onChange={handleFile} />
              <div className={`rg-upload${file?" done":""}`}
                onClick={() => fileRef.current?.click()}>
                <div className="rg-upload-ico">
                  {file ? <IcoCheck /> : <IcoUpload />}
                </div>
                <div className="rg-upload-title">
                  {file ? file.name : "Ajouter votre diplôme"}
                </div>
                <div className="rg-upload-sub">
                  {file ? "Cliquez pour changer le fichier" : "JPG, PNG ou PDF · Max 5 Mo (facultatif)"}
                </div>
              </div>
              {preview && <img src={preview} alt="Aperçu" className="rg-preview" />}

              <button type="submit" className="rg-btn" disabled={loading || !isValid}>
                {loading
                  ? <><div className="rg-spin" /> Envoi en cours…</>
                  : <>Soumettre la demande <IcoArrow /></>
                }
              </button>
            </form>

            <div className="rg-login-link">
              Déjà inscrit ?{" "}
              <a onClick={() => navigate("/login")}>Se connecter</a>
            </div>
            <div className="rg-secure">
              <IcoLock /> Connexion chiffrée SSL · Données sécurisées
            </div>
          </div>
        </div>

      </div>
    </>
  );
}