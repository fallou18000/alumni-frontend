import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const prenom   = user?.first_name || "";
  const nom      = user?.last_name  || "";
  const fullName = `${prenom} ${nom}`.trim() || "Utilisateur";
  const initials = `${prenom[0] || ""}${nom[0] || ""}`.toUpperCase() || "AL";

  const roleMap  = { 1: "Administrateur", 2: "Alumni", 3: "Responsable" };
  const roleLabel = user?.role?.name || roleMap[user?.role_id] || user?.role || "Alumni";

  return (
    <div className="ml-layout">

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside className="ml-sb">
        <div className="ml-sb-noise" />
        <div className="ml-sb-aurora" />

        {/* ── Logo ── */}
        <div className="ml-logo">
          <div className="ml-logo-gem">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <span className="ml-logo-title">Alumni</span>
            <span className="ml-logo-sub">Réseau · Anciens Élèves</span>
          </div>
        </div>

        {/* ── Carte profil (sans stats) ── */}
        <div className="ml-profile">
          <div className="ml-profile-inner">
            <div className="ml-profile-grid" />
            <div className="ml-profile-shine" />

            <div className="ml-av-wrap">
              <div className="ml-av-ring">
                <div className="ml-av-dot" />
              </div>
              <div className="ml-av">{initials}</div>
              <div className="ml-av-status" />
            </div>

            <div className="ml-profile-name">{fullName}</div>
            <div className="ml-profile-role-wrap">
              <span className="ml-profile-role">{roleLabel}</span>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="ml-nav">
          <p className="ml-nav-sect">Navigation</p>

          {[
            {
              to: "/alumni",
              label: "Dashboard",
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              ),
            },
            {
              to: "/profile",
              label: "Mon profil",
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              ),
            },
            {
              to: "/documents",
              label: "Informations",
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
                </svg>
              ),
            },
            {
              to: "/network",
              label: "Réseau Alumni",
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>
                </svg>
              ),
            },
            {
              to: "/about",
              label: "À propos",
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              ),
            },
          ].map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `ml-link${isActive ? " ml-link-on" : ""}`}
            >
              <span className="ml-link-ico">{icon}</span>
              <span className="ml-link-label">{label}</span>
              <span className="ml-link-arr">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </span>
            </NavLink>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* ── Logout ── */}
        <button className="ml-logout" onClick={logout}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </button>
      </aside>

      {/* ═══════════════ CONTENT ═══════════════ */}
      <main className="ml-content">
        <Outlet />
      </main>

      {/* ═══════════════ STYLES ═══════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          /* Accent colors */
          --ml-b:   #4f8ef5;
          --ml-b2:  #7eb3ff;
          --ml-b3:  rgba(79,142,245,0.13);
          --ml-v:   #9e7bf5;
          --ml-v2:  #c4aeff;
          --ml-v3:  rgba(158,123,245,0.11);
          --ml-em:  #22d3a0;
          --ml-re:  #f43f5e;

          /* Dark bg layers */
          --ml-n:   #06101f;
          --ml-n2:  #090f1e;
          --ml-n3:  #0a1320;
          --ml-n4:  #071018;

          /* Text alphas */
          --ml-t0:  rgba(255,255,255,0.04);
          --ml-t1:  rgba(255,255,255,0.12);
          --ml-t2:  rgba(255,255,255,0.38);
          --ml-t3:  rgba(255,255,255,0.68);
          --ml-t4:  #ffffff;

          /* Borders */
          --ml-brd:  rgba(255,255,255,0.05);
          --ml-brd2: rgba(79,142,245,0.15);

          /* Fonts */
          --ml-ff: 'Lora', Georgia, serif;
          --ml-fb: 'Inter', system-ui, sans-serif;
          --ml-fm: 'JetBrains Mono', monospace;

          /* Layout */
          --ml-sb-w: 272px;
          --ml-r1: 14px;
          --ml-r2: 9px;
          --ml-r3: 18px;
        }

        html, body {
          height: 100%;
          font-family: var(--ml-fb);
          -webkit-font-smoothing: antialiased;
          background: #eef2f9;
        }

        .ml-layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        /* ═══════════════ SIDEBAR ═══════════════ */
        .ml-sb {
          width: var(--ml-sb-w);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          background: linear-gradient(175deg,
            #06101f 0%,
            #090f1e 40%,
            #0a1320 70%,
            #071018 100%
          );
          border-right: 1px solid rgba(79,142,245,0.10);
          box-shadow: 12px 0 48px rgba(0,0,0,0.4);
        }

        /* Bruit de fond */
        .ml-sb-noise {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          opacity: .025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        /* Aurora lumineuse */
        .ml-sb-aurora {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 45% at -10% 10%, rgba(79,142,245,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 110% 85%, rgba(158,123,245,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 50% 30% at 50% 50%, rgba(34,211,160,0.03) 0%, transparent 70%);
        }

        /* ── Logo ── */
        .ml-logo {
          position: relative; z-index: 2;
          display: flex; align-items: center; gap: 12px;
          padding: 24px 20px 20px;
          border-bottom: 1px solid var(--ml-brd);
          flex-shrink: 0;
        }
        .ml-logo::after {
          content: '';
          position: absolute; bottom: 0; left: 18px; right: 18px; height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(79,142,245,0.30),
            rgba(158,123,245,0.22),
            transparent
          );
        }

        .ml-logo-gem {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg, #3a7cf0, #7c5ce8);
          display: flex; align-items: center; justify-content: center; color: #fff;
          position: relative;
          box-shadow:
            0 0 0 1px rgba(158,123,245,0.4),
            0 4px 16px rgba(79,142,245,0.30),
            inset 0 1px 0 rgba(255,255,255,0.20);
        }
        .ml-logo-gem::after {
          content: '';
          position: absolute; inset: 0; border-radius: 10px;
          background: linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%);
        }
        .ml-logo-gem svg { position: relative; z-index: 1; }

        .ml-logo-title {
          display: block;
          font-family: var(--ml-ff); font-size: 20px; font-weight: 600;
          letter-spacing: 0.2px; line-height: 1;
          background: linear-gradient(110deg, #ffffff 30%, #93c5fd 60%, #c4b5fd);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .ml-logo-sub {
          display: block;
          font-family: var(--ml-fb); font-size: 7.5px; font-weight: 600;
          letter-spacing: 3px; text-transform: uppercase;
          color: rgba(147,197,253,0.38);
          margin-top: 4px;
        }

        /* ── Carte profil ── */
        .ml-profile {
          position: relative; z-index: 2;
          margin: 16px 13px 0;
          flex-shrink: 0;
        }

        .ml-profile-inner {
          border-radius: var(--ml-r3);
          padding: 22px 16px 18px;
          text-align: center;
          position: relative; overflow: hidden;
          background: linear-gradient(160deg,
            rgba(79,142,245,0.09) 0%,
            rgba(158,123,245,0.07) 50%,
            rgba(255,255,255,0.025) 100%
          );
          border: 1px solid rgba(99,139,255,0.16);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.06),
            inset 0 -1px 0 rgba(0,0,0,0.15),
            0 8px 32px rgba(0,0,0,0.30);
        }

        /* Grille interne */
        .ml-profile-grid {
          position: absolute; inset: 0; pointer-events: none; opacity: .38;
          background-image:
            linear-gradient(rgba(99,139,255,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,139,255,0.055) 1px, transparent 1px);
          background-size: 22px 22px;
          mask-image: radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%);
        }

        /* Reflet haut */
        .ml-profile-shine {
          position: absolute; top: 0; left: 14%; right: 14%; height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(99,139,255,0.70) 30%,
            rgba(196,181,253,0.50) 65%,
            transparent
          );
        }

        /* Avatar */
        .ml-av-wrap {
          position: relative;
          display: inline-flex; align-items: center; justify-content: center;
          margin-bottom: 14px;
        }
        .ml-av-ring {
          position: absolute; inset: -5px;
          border-radius: 50%;
          border: 1.5px dashed rgba(99,139,255,0.20);
          animation: ml-orbit 14s linear infinite;
        }
        @keyframes ml-orbit { to { transform: rotate(360deg); } }

        .ml-av-dot {
          position: absolute; top: -3.5px; left: 50%; transform: translateX(-50%);
          width: 7px; height: 7px; border-radius: 50%;
          background: linear-gradient(135deg, var(--ml-b2), var(--ml-v2));
          box-shadow: 0 0 6px rgba(99,139,255,0.7), 0 0 2px var(--ml-b2);
        }

        .ml-av {
          width: 58px; height: 58px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--ml-ff); font-size: 20px; font-weight: 600;
          font-style: italic; color: #fff;
          position: relative; z-index: 2;
          background: linear-gradient(145deg, #2563eb, #7c3aed);
          border: 2.5px solid rgba(255,255,255,0.08);
          box-shadow:
            0 0 0 3px rgba(59,130,246,0.12),
            0 6px 22px rgba(59,130,246,0.26),
            inset 0 1px 0 rgba(255,255,255,0.18);
        }

        .ml-av-status {
          position: absolute; bottom: 2px; right: 2px; z-index: 3;
          width: 13px; height: 13px; border-radius: 50%;
          background: var(--ml-em);
          border: 2.5px solid #08111f;
          box-shadow: 0 0 8px rgba(34,211,160,0.55);
          animation: ml-pulse 2.5s ease-in-out infinite;
        }
        @keyframes ml-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(34,211,160,0.55); }
          50%       { box-shadow: 0 0 14px rgba(34,211,160,0.85); }
        }

        .ml-profile-name {
          font-family: var(--ml-ff); font-size: 16px; font-weight: 600;
          color: var(--ml-t4); line-height: 1.25; margin-bottom: 7px;
          position: relative; z-index: 1; letter-spacing: 0.1px;
        }

        .ml-profile-role-wrap {
          display: flex; justify-content: center;
          position: relative; z-index: 1;
        }
        .ml-profile-role {
          display: inline-flex; align-items: center;
          font-size: 8.5px; font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase;
          padding: 3px 10px;
          border: 1px solid rgba(99,139,255,0.18);
          border-radius: 20px;
          background: rgba(99,139,255,0.07);
          background-image: linear-gradient(90deg, var(--ml-b2), var(--ml-v2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* ── Navigation ── */
        .ml-nav {
          position: relative; z-index: 2;
          flex: 1; overflow-y: auto;
          padding: 18px 10px 6px;
          display: flex; flex-direction: column; gap: 1px;
        }
        .ml-nav::-webkit-scrollbar { width: 0; }

        .ml-nav-sect {
          font-size: 7px; font-weight: 700; letter-spacing: 3.5px;
          text-transform: uppercase; color: rgba(255,255,255,0.10);
          padding: 2px 13px 10px; margin: 0;
        }

        .ml-link {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: var(--ml-r2);
          text-decoration: none; font-size: 12.5px; font-weight: 500;
          color: var(--ml-t2);
          transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative; overflow: hidden;
          border: 1px solid transparent;
          letter-spacing: -0.1px;
        }
        .ml-link:hover {
          color: var(--ml-t3);
          background: rgba(79,142,245,0.06);
        }
        .ml-link-on {
          color: #fff !important;
          font-weight: 600;
          background: linear-gradient(135deg,
            rgba(79,142,245,0.12) 0%,
            rgba(158,123,245,0.09) 100%
          ) !important;
          border-color: rgba(99,139,255,0.20) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.05),
            0 2px 12px rgba(0,0,0,0.18);
        }
        .ml-link-on::after {
          content: '';
          position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 2.5px; border-radius: 0 3px 3px 0;
          background: linear-gradient(to bottom, var(--ml-b2), var(--ml-v2));
          box-shadow: 0 0 6px rgba(96,165,250,0.5);
        }

        .ml-link-ico {
          width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.03);
          transition: all 0.18s;
          color: rgba(255,255,255,0.28);
        }
        .ml-link-on .ml-link-ico {
          background: linear-gradient(135deg, rgba(79,142,245,0.18), rgba(158,123,245,0.13));
          color: var(--ml-b2);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .ml-link:hover .ml-link-ico { color: rgba(255,255,255,0.55); }

        .ml-link-label { flex: 1; }

        .ml-link-arr {
          color: var(--ml-b2); opacity: 0;
          transform: translateX(-4px);
          transition: all 0.18s; flex-shrink: 0;
        }
        .ml-link:hover .ml-link-arr,
        .ml-link-on   .ml-link-arr { opacity: 1; transform: translateX(0); }

        /* ── Logout ── */
        .ml-logout {
          position: relative; z-index: 2;
          display: flex; align-items: center; gap: 9px; justify-content: center;
          margin: 4px 12px 18px;
          padding: 10px 16px; border-radius: var(--ml-r2);
          border: 1px solid rgba(244,63,94,0.12);
          background: rgba(244,63,94,0.04);
          color: rgba(252,165,165,0.45);
          font-size: 12px; font-weight: 500; cursor: pointer;
          font-family: var(--ml-fb); letter-spacing: -0.1px;
          transition: all 0.20s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ml-logout:hover {
          background: rgba(244,63,94,0.12);
          border-color: rgba(244,63,94,0.30);
          color: #fca5a5;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(244,63,94,0.16);
        }
        .ml-logout:active { transform: translateY(0); }

        /* ═══════════════ CONTENT ═══════════════ */
        .ml-content {
          flex: 1; overflow-y: auto;
          background: #eef2f9;
          position: relative;
        }
        .ml-content::-webkit-scrollbar { width: 4px; }
        .ml-content::-webkit-scrollbar-thumb {
          background: rgba(99,139,246,0.18);
          border-radius: 4px;
        }
        .ml-content::-webkit-scrollbar-thumb:hover {
          background: rgba(99,139,246,0.32);
        }
      `}</style>
    </div>
  );
}