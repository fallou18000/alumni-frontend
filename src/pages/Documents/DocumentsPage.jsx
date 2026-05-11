import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Icônes ─── */
const Ico = ({ d, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const IcoChev = () => <Ico d="M9 18l6-6-6-6" />;
const IcoUser = () => <Ico d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"]} />;
const IcoMail = () => <Ico d={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"]} />;
const IcoHash = () => <Ico d={["M4 9h16","M4 15h16","M10 3l-2 18","M16 3l-2 18"]} />;
const IcoShield = () => <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const IcoBook = () => <Ico d={["M4 19.5A2.5 2.5 0 016.5 17H20","M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"]} />;
const IcoBuilding = () => <Ico d={["M3 3h18v18H3z","M3 9h18","M9 21V9"]} />;
const IcoStar = () => <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
const IcoCalendar = () => <Ico d={["M3 4h18v18H3z","M3 9h18","M8 2v4","M16 2v4"]} />;
const IcoBriefcase = () => <Ico d={["M2 7h20v14a2 2 0 01-2 2H4a2 2 0 01-2-2V7z","M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"]} />;
const IcoSettings = () => <Ico d={["M12 15a3 3 0 100-6 3 3 0 000 6z","M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"]} />;
const IcoKey = () => <Ico d={["M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"]} />;
const IcoRefresh = () => <Ico d={["M23 4v6h-6","M20.49 15a9 9 0 11-2.12-9.36L23 10"]} />;
const IcoGrad = () => <Ico d={["M22 10v6M2 10l10-5 10 5-10 5z","M6 12v5c3 3 9 3 12 0v-5"]} />;
const IcoMapPin = () => <Ico d={["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z","M12 7a3 3 0 100 6 3 3 0 000-6z"]} />;
const IcoCheckCircle = () => <Ico d={["M22 11.08V12a10 10 0 11-5.93-9.14","M22 4L12 14.01l-3-3"]} />;

const getRole = (id) => {
  if (id === 1) return "Administrateur";
  if (id === 2) return "Alumni";
  if (id === 3) return "Responsable";
  return "—";
};

/* ─── Row item ─── */
const Row = ({ icon: Icon, label, value, accent, bg }) => (
  <div className="dp-row">
    <div className="dp-row-ico" style={{ background: bg || "rgba(59,130,246,0.09)" }}>
      {Icon && <Icon />}
    </div>
    <div className="dp-row-body">
      <span className="dp-row-lbl">{label}</span>
      <span className={`dp-row-val${accent ? " accent" : ""}`}>{value || "—"}</span>
    </div>
  </div>
);

/* ─── Accordion Card ─── */
const Section = ({ emoji, title, color, bg, count, children, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen || false);

  return (
    <motion.div
      className={`dp-card${open ? " dp-open" : ""}`}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26 }}
    >
      <div className="dp-card-hd" onClick={() => setOpen(o => !o)}>
        <div className="dp-card-ico" style={{ background: bg }}>
          {emoji}
        </div>
        <span className="dp-card-ttl">{title}</span>
        <span className="dp-card-count" style={{ background: bg, color }}>{count} champs</span>
        <motion.span
          className="dp-card-arr"
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.22 }}>
          <IcoChev />
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="dp-card-body"
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}>
            <div className="dp-sep" />
            <div className="dp-rows">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ════════════════════════════════ */
export default function DocumentsPage() {
  const [profile, setProfile] = useState(null);
  const [user,    setUser]    = useState(null);

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile", { headers });
      setUser(res.data);
      setProfile(res.data.profile);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (token) fetchProfile(); }, []);

  if (!user) return (
    <div className="dp-loading">
      <div className="dp-spin" />
      <span>Chargement de la fiche…</span>
    </div>
  );

  const p = profile || {};

  return (
    <div className="dp-root">

      {/* ── HEADER ── */}
      <motion.div className="dp-header"
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}>
        <div className="dp-header-bar" />
        <div className="dp-header-body">
          <div className="dp-header-left">
            <div className="dp-header-icon">📄</div>
            <div>
              <h1 className="dp-header-title">Fiche Officielle Alumni</h1>
              <p className="dp-header-sub">
                Consultez vos informations officielles — parcours académique,
                situation professionnelle et données administratives.
              </p>
            </div>
          </div>
          <div className="dp-header-badge">
            <span className="dp-header-dot" />
            Données vérifiées
          </div>
        </div>
      </motion.div>

      {/* ── CARDS GRID ── */}
      <div className="dp-grid">

        <Section emoji="👤" title="Identité" color="#2563eb"
          bg="#eff6ff" count={4} defaultOpen>
          <Row icon={IcoUser}     label="Nom complet" value={`${user.first_name} ${user.last_name}`} bg="#eff6ff" />
          <Row icon={IcoMail}     label="Email"        value={user.email} bg="#eff6ff" accent />
          <Row icon={IcoHash}     label="N° dossier"   value={user.numero_dossier} bg="#eff6ff" />
          <Row icon={IcoShield}   label="Rôle"         value={getRole(user.role_id)} bg="#eff6ff" />
        </Section>

        <Section emoji="🎓" title="Académique" color="#7c3aed"
          bg="#f5f3ff" count={6}>
          <Row icon={IcoBook}     label="UFR"          value={user.ufr?.nom} bg="#f5f3ff" />
          <Row icon={IcoBuilding} label="Département"  value={user.departement?.nom} bg="#f5f3ff" />
          <Row icon={IcoStar}     label="Filière"      value={user.filiere?.name} bg="#f5f3ff" />
          <Row icon={IcoCalendar} label="Année diplôme" value={p.graduation_year} bg="#f5f3ff" />
          <Row icon={IcoGrad}     label="Niveau"       value={p.degree_level} bg="#f5f3ff" />
          <Row icon={IcoStar}     label="Promotion"    value={p.promotion} bg="#f5f3ff" />
        </Section>

        <Section emoji="💼" title="Professionnel" color="#15803d"
          bg="#f0fdf4" count={4}>
          <Row icon={IcoCheckCircle} label="Statut"    value={p.status} bg="#f0fdf4" />
          <Row icon={IcoBriefcase}   label="Poste"     value={p.job_title} bg="#f0fdf4" accent />
          <Row icon={IcoMapPin}      label="Secteur"   value={p.entreprise?.secteur} bg="#f0fdf4" />
          <Row icon={IcoBuilding}    label="Entreprise" value={p.entreprise?.nom} bg="#f0fdf4" />
        </Section>

        <Section emoji="⚙️" title="Système" color="#c2410c"
          bg="#fff7ed" count={3}>
          <Row icon={IcoKey}     label="ID utilisateur" value={user.id} bg="#fff7ed" />
          <Row icon={IcoCalendar} label="Créé le"       value={user.created_at?.split("T")[0]} bg="#fff7ed" />
          <Row icon={IcoRefresh}  label="Modifié le"    value={user.updated_at?.split("T")[0]} bg="#fff7ed" />
        </Section>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dp-root {
          min-height: 100vh;
          background: #eef1f9;
          padding: 24px 26px 40px;
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          display: flex; flex-direction: column; gap: 16px;
        }

        /* ── Loading ── */
        .dp-loading {
          height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 14px; font-size: 13px; color: #64748b;
          background: #eef1f9; font-family: 'Inter', system-ui, sans-serif;
        }
        .dp-spin {
          width: 36px; height: 36px; border-radius: 50%;
          border: 3px solid rgba(59,130,246,0.14);
          border-top-color: #3b82f6;
          animation: dpSpin .8s linear infinite;
        }
        @keyframes dpSpin { to { transform: rotate(360deg); } }

        /* ══════════════════════════════
           HEADER
        ══════════════════════════════ */
        .dp-header {
          background: #0c0f1a;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
        }
        .dp-header-bar {
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6, #a78bfa);
        }
        .dp-header-body {
          position: relative; z-index: 2;
          padding: 28px 30px;
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
        }
        .dp-header-body::before {
          content: '';
          position: absolute; top: -80px; left: -60px;
          width: 340px; height: 340px; border-radius: 50%;
          background: radial-gradient(ellipse,
            rgba(59,130,246,0.14) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .dp-header-left {
          display: flex; align-items: center; gap: 18px;
          position: relative; z-index: 1;
        }
        .dp-header-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: rgba(59,130,246,0.15);
          border: 1px solid rgba(59,130,246,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; flex-shrink: 0;
        }
        .dp-header-title {
          font-size: 20px; font-weight: 700; color: #f8fafc;
          letter-spacing: -0.4px; margin-bottom: 5px;
        }
        .dp-header-sub {
          font-size: 12.5px; color: rgba(148,163,184,0.8);
          line-height: 1.65; max-width: 500px;
        }
        .dp-header-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(34,197,94,0.12);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 99px; padding: 6px 14px;
          font-size: 11px; font-weight: 700; color: #4ade80;
          white-space: nowrap; flex-shrink: 0;
          position: relative; z-index: 1;
        }
        .dp-header-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px rgba(74,222,128,0.6);
        }

        /* ══════════════════════════════
           GRID
        ══════════════════════════════ */
        .dp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
          align-items: start;
        }
        @media (max-width: 780px) { .dp-grid { grid-template-columns: 1fr; } }

        /* ══════════════════════════════
           ACCORDION CARD
        ══════════════════════════════ */
        .dp-card {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid #e2e8f5;
          overflow: hidden;
          transition: border-color .2s, box-shadow .2s;
        }
        .dp-card:hover { border-color: #b3cff5; }
        .dp-open {
          box-shadow: 0 6px 24px rgba(59,130,246,0.08);
          border-color: #c7d9f5;
        }

        .dp-card-hd {
          display: flex; align-items: center; gap: 12px;
          padding: 18px 20px;
          cursor: pointer; user-select: none;
          transition: background .16s;
        }
        .dp-card-hd:hover { background: #fafbfe; }

        .dp-card-ico {
          width: 38px; height: 38px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .dp-card-ttl {
          flex: 1; font-size: 14px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.1px;
        }
        .dp-card-count {
          font-size: 10.5px; font-weight: 700;
          padding: 3px 9px; border-radius: 99px; flex-shrink: 0;
        }
        .dp-card-arr {
          color: #94a3b8; display: flex; flex-shrink: 0;
        }

        /* ── Body ── */
        .dp-card-body { overflow: hidden; }
        .dp-sep { height: 1px; background: #f0f4fc; margin: 0 20px; }
        .dp-rows {
          padding: 13px 16px 16px;
          display: flex; flex-direction: column; gap: 7px;
        }

        /* ── Row ── */
        .dp-row {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 12px; border-radius: 11px;
          background: #f8fafd;
          border: 1px solid rgba(99,130,246,0.07);
          transition: all .16s;
        }
        .dp-row:hover { background: #f0f5ff; border-color: #c7d9f5; }
        .dp-row-ico {
          width: 28px; height: 28px; border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          color: #3b82f6; flex-shrink: 0;
        }
        .dp-row-body { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
        .dp-row-lbl {
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase; color: #94a3b8;
        }
        .dp-row-val {
          font-size: 13px; font-weight: 600; color: #1e293b;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .dp-row-val.accent { color: #2563eb; }
      `}</style>
    </div>
  );
}