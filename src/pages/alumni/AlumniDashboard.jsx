import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AlumniDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const navItems = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      ),
      gradient: "linear-gradient(135deg,#4f8ef5,#7eb3ff)",
      glow: "rgba(79,142,245,0.20)",
      bg: "#eff6ff",
      accent: "#4f8ef5",
      title: "Mon profil",
      desc: "Gérer vos informations personnelles et académiques",
      tag: "Identité",
      route: "/profile",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      gradient: "linear-gradient(135deg,#22d3a0,#6ee7b7)",
      glow: "rgba(34,211,160,0.18)",
      bg: "#ecfdf5",
      accent: "#059669",
      title: "Informations",
      desc: "Données personnelles",
      tag: "Données personnelles",
      route: "/documents",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>
        </svg>
      ),
      gradient: "linear-gradient(135deg,#9e7bf5,#c4aeff)",
      glow: "rgba(158,123,245,0.18)",
      bg: "#f5f3ff",
      accent: "#7c3aed",
      title: "Réseau Alumni",
      desc: "Anciens étudiants, connexions et opportunités",
      tag: "Communauté",
      route: "/network",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
      gradient: "linear-gradient(135deg,#f59e0b,#fbbf24)",
      glow: "rgba(245,158,11,0.18)",
      bg: "#fffbeb",
      accent: "#d97706",
      title: "À propos",
      desc: "La plateforme Alumni et son fonctionnement",
      tag: "Infos",
      route: "/about",
    },
  ];

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "AL";

  const roleConfig = {
    1: { label: "Administrateur", color: "#f59e0b", bg: "rgba(245,158,11,0.14)", dot: "#f59e0b" },
    2: { label: "Ancien étudiant",  color: "#22d3a0", bg: "rgba(34,211,160,0.13)", dot: "#22d3a0" },
    3: { label: "Responsable",      color: "#9e7bf5", bg: "rgba(158,123,245,0.13)", dot: "#9e7bf5" },
  };
  const currentRole = roleConfig[user?.role_id] || roleConfig[2];

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  });
  const todayStr = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --b:  #4f8ef5;
          --b2: #7eb3ff;
          --v:  #9e7bf5;
          --v2: #c4aeff;
          --em: #22d3a0;
          --ff: 'Lora', Georgia, serif;
          --fb: 'Inter', system-ui, sans-serif;
        }

        .ad-root {
          min-height: 100vh;
          background: #eef2f9;
          padding: 28px 32px 40px;
          font-family: var(--fb);
          -webkit-font-smoothing: antialiased;
        }

        /* ═══ HERO ═══ */
        .ad-hero {
          border-radius: 22px;
          overflow: hidden;
          margin-bottom: 22px;
          position: relative;
          background: linear-gradient(135deg, #07101f 0%, #0d1f3c 45%, #132d5e 100%);
          border: 1px solid rgba(79,142,245,0.18);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.04) inset,
            0 12px 50px rgba(7,16,31,0.30);
        }

        /* Orbes lumineux hero */
        .ad-hero-orb1 {
          position: absolute; pointer-events: none;
          width: 380px; height: 380px; border-radius: 50%;
          top: -160px; right: -80px;
          background: radial-gradient(circle, rgba(79,142,245,0.16) 0%, transparent 70%);
          filter: blur(40px);
        }
        .ad-hero-orb2 {
          position: absolute; pointer-events: none;
          width: 260px; height: 260px; border-radius: 50%;
          bottom: -100px; left: 10%;
          background: radial-gradient(circle, rgba(158,123,245,0.14) 0%, transparent 70%);
          filter: blur(35px);
        }
        /* Grille interne */
        .ad-hero-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: .3;
          background-image:
            linear-gradient(rgba(99,139,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,139,255,0.07) 1px, transparent 1px);
          background-size: 30px 30px;
          mask-image: radial-gradient(ellipse at 60% 0%, black 0%, transparent 70%);
        }
        /* Ligne lumineuse top */
        .ad-hero::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(79,142,245,0.55) 25%,
            rgba(158,123,245,0.45) 65%,
            transparent 100%
          );
        }

        .ad-hero-inner {
          position: relative; z-index: 2;
          padding: 32px 36px;
        }

        .ad-hero-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        /* Avatar animé */
        .ad-av-shell {
          position: relative;
          display: inline-flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ad-av-ring {
          position: absolute; inset: -6px;
          border-radius: 50%;
          border: 1.5px dashed rgba(99,139,255,0.22);
          animation: ad-spin 14s linear infinite;
        }
        @keyframes ad-spin { to { transform: rotate(360deg); } }
        .ad-av-dot {
          position: absolute; top: -4px; left: 50%; transform: translateX(-50%);
          width: 8px; height: 8px; border-radius: 50%;
          background: linear-gradient(135deg, var(--b2), var(--v2));
          box-shadow: 0 0 8px rgba(99,139,255,0.7);
        }
        .ad-av {
          width: 72px; height: 72px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--ff); font-size: 24px; font-weight: 600;
          font-style: italic; color: #fff;
          background: linear-gradient(145deg, #2563eb, #7c3aed);
          border: 2.5px solid rgba(255,255,255,0.10);
          box-shadow:
            0 0 0 4px rgba(59,130,246,0.14),
            0 8px 28px rgba(59,130,246,0.32);
          position: relative; z-index: 2;
        }
        .ad-av-status {
          position: absolute; bottom: 3px; right: 3px; z-index: 3;
          width: 14px; height: 14px; border-radius: 50%;
          background: var(--em);
          border: 2.5px solid #08111f;
          box-shadow: 0 0 8px rgba(34,211,160,0.55);
          animation: ad-pulse 2.5s ease-in-out infinite;
        }
        @keyframes ad-pulse {
          0%,100% { box-shadow: 0 0 8px rgba(34,211,160,0.55); }
          50%      { box-shadow: 0 0 14px rgba(34,211,160,0.85); }
        }

        .ad-hero-info { flex: 1; min-width: 0; }
        .ad-hero-greeting {
          font-size: 11px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase;
          color: rgba(127,183,255,0.55);
          margin-bottom: 8px;
        }
        .ad-hero-name {
          font-family: var(--ff);
          font-size: 30px; font-weight: 600; font-style: italic;
          color: #fff; line-height: 1.1;
          margin-bottom: 6px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          /* Dégradé léger sur le texte */
          background: linear-gradient(90deg, #fff 60%, rgba(196,181,253,0.8));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ad-hero-email {
          font-size: 13px;
          color: rgba(255,255,255,0.40);
          letter-spacing: -.1px;
        }

        /* Badge rôle */
        .ad-role-badge {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 16px;
          border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 12.5px; font-weight: 600;
          color: #fff;
          backdrop-filter: blur(10px);
          flex-shrink: 0;
        }
        .ad-role-dot {
          width: 8px; height: 8px; border-radius: 50%;
          animation: ad-pulse 2.5s ease-in-out infinite;
        }

        /* Chips */
        .ad-chips {
          display: flex; gap: 10px; flex-wrap: wrap;
        }
        .ad-chip {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 16px;
          border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.055);
          color: rgba(255,255,255,0.70);
          font-size: 12.5px; font-weight: 500;
          backdrop-filter: blur(8px);
          letter-spacing: -.1px;
        }
        .ad-chip-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--b2);
          flex-shrink: 0;
        }

        /* ═══ DATE BANNER ═══ */
        .ad-date-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .ad-date-lbl {
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: #94a3b8;
        }
        .ad-date-val {
          font-size: 12px; font-weight: 500; color: #64748b;
        }

        /* ═══ NAV GRID ═══ */
        .ad-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 680px) {
          .ad-grid { grid-template-columns: 1fr; }
        }

        .ad-nav-card {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid rgba(99,139,246,0.10);
          padding: 24px;
          cursor: pointer;
          transition: transform .20s cubic-bezier(.4,0,.2,1), box-shadow .20s, border-color .20s;
          display: flex; flex-direction: column; gap: 0;
          position: relative; overflow: hidden;
          box-shadow: 0 1px 4px rgba(99,139,246,0.04), 0 4px 16px rgba(99,139,246,0.04);
        }
        .ad-nav-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          border-radius: 18px 18px 0 0;
          opacity: 0;
          transition: opacity .22s;
        }
        .ad-nav-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(99,139,246,0.12);
          border-color: rgba(99,139,246,0.18);
        }
        .ad-nav-card:hover::before { opacity: 1; }

        /* Couleurs de barre par carte */
        .ad-nav-card.c0::before { background: linear-gradient(90deg,#4f8ef5,#7eb3ff); }
        .ad-nav-card.c1::before { background: linear-gradient(90deg,#22d3a0,#6ee7b7); }
        .ad-nav-card.c2::before { background: linear-gradient(90deg,#9e7bf5,#c4aeff); }
        .ad-nav-card.c3::before { background: linear-gradient(90deg,#f59e0b,#fbbf24); }

        .ad-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 18px;
        }
        .ad-card-icon {
          width: 50px; height: 50px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          transition: transform .18s;
        }
        .ad-nav-card:hover .ad-card-icon { transform: scale(1.06); }

        .ad-card-tag {
          font-size: 9.5px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          padding: 3px 9px; border-radius: 6px;
        }

        .ad-card-title {
          font-family: var(--ff);
          font-size: 17px; font-weight: 600;
          color: #0f172a;
          margin-bottom: 7px;
          letter-spacing: .1px;
        }
        .ad-card-desc {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.55;
          flex: 1;
        }
        .ad-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }
        .ad-card-action {
          font-size: 12px; font-weight: 600;
          display: flex; align-items: center; gap: 5px;
        }
        .ad-card-arr {
          display: flex;
          opacity: 0;
          transform: translateX(-4px);
          transition: all .18s;
        }
        .ad-nav-card:hover .ad-card-arr {
          opacity: 1; transform: translateX(0);
        }

        @media (max-width: 900px) {
          .ad-root { padding: 16px 16px 30px; }
          .ad-hero-inner { padding: 24px 22px; }
          .ad-hero-name { font-size: 24px; }
        }
      `}</style>

      <div className="ad-root">

        {/* ═══ HERO ═══ */}
        <motion.div
          className="ad-hero"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="ad-hero-orb1" />
          <div className="ad-hero-orb2" />
          <div className="ad-hero-grid" />

          <div className="ad-hero-inner">
            <div className="ad-hero-top">

              {/* Avatar + infos */}
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div className="ad-av-shell">
                  <div className="ad-av-ring">
                    <div className="ad-av-dot" />
                  </div>
                  <div className="ad-av">{initials}</div>
                  <div className="ad-av-status" />
                </div>

                <div className="ad-hero-info">
                  <div className="ad-hero-greeting">Bienvenue sur Alumni</div>
                  <div className="ad-hero-name">{user?.first_name} {user?.last_name}</div>
                  <div className="ad-hero-email">{user?.email}</div>
                </div>
              </div>

              {/* Badge rôle */}
              <div
                className="ad-role-badge"
                style={{ background: currentRole.bg }}
              >
                <div
                  className="ad-role-dot"
                  style={{ background: currentRole.dot, boxShadow: `0 0 8px ${currentRole.dot}` }}
                />
                {currentRole.label}
              </div>
            </div>

            {/* Chips */}
            <div className="ad-chips">
              {user?.profile?.promotion && (
                <div className="ad-chip">
                  <div className="ad-chip-dot" />
                  Promotion {user.profile.promotion}
                </div>
              )}
              <div className="ad-chip">
                <div className="ad-chip-dot" style={{ background: "#c4aeff" }} />
                Plateforme Alumni
              </div>
              <div className="ad-chip">
                <div className="ad-chip-dot" style={{ background: "#6ee7b7" }} />
                Réseau actif
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ DATE / SECTION LABEL ═══ */}
        <div className="ad-date-bar">
          <span className="ad-date-lbl">Mon espace</span>
          <span className="ad-date-val">{todayStr}</span>
        </div>

        {/* ═══ NAV GRID ═══ */}
        <div className="ad-grid">
          {navItems.map((item, i) => (
            <motion.div
              key={item.route}
              className={`ad-nav-card c${i}`}
              onClick={() => navigate(item.route)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
            >
              {/* Top : icône + tag */}
              <div className="ad-card-top">
                <div
                  className="ad-card-icon"
                  style={{ background: item.bg, color: item.accent }}
                >
                  {item.icon}
                </div>
                <span
                  className="ad-card-tag"
                  style={{
                    background: item.bg,
                    color: item.accent,
                  }}
                >
                  {item.tag}
                </span>
              </div>

              {/* Titre + desc */}
              <div className="ad-card-title">{item.title}</div>
              <div className="ad-card-desc">{item.desc}</div>

              {/* Footer */}
              <div className="ad-card-footer">
                <span
                  className="ad-card-action"
                  style={{ color: item.accent }}
                >
                  Accéder
                  <span className="ad-card-arr">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </span>
                </span>

                {/* Dot décoratif */}
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: item.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: item.accent, opacity: .7,
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </>
  );
}
