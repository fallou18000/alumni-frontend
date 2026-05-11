import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

/* ─── Helpers ─── */
const PALETTE = [
  ["#1e3a8a","#2563eb"], ["#5b21b6","#7c3aed"],
  ["#065f46","#059669"], ["#9a3412","#dc2626"],
  ["#0c4a6e","#0284c7"], ["#713f12","#d97706"],
  ["#831843","#db2777"], ["#1e3a5f","#1d4ed8"],
];
const gradOf   = id => PALETTE[(id || 0) % PALETTE.length];
const initials = u =>
  ((u?.first_name?.[0] || "") + (u?.last_name?.[0] || "")).toUpperCase() || "AL";

/* ─── Skeleton ─── */
function Skeleton() {
  return (
    <div className="an-skel-card">
      <div className="an-skel-banner an-skel" />
      <div className="an-skel-body">
        <div className="an-skel-line an-skel" style={{ width: "55%" }} />
        <div className="an-skel-line an-skel" style={{ width: "78%" }} />
        <div style={{ display: "flex", gap: 6 }}>
          <div className="an-skel-line an-skel" style={{ width: 60 }} />
          <div className="an-skel-line an-skel" style={{ width: 72 }} />
        </div>
        <div className="an-skel-line an-skel" style={{ width: "38%", marginTop: 8 }} />
      </div>
    </div>
  );
}

/* ─── Card ─── */
function AlumniCard({ user, onView }) {
  const [c1, c2] = gradOf(user.id);
  const approved  = user.status === "approved";
  const roleMap   = { 1: "Admin", 2: "Alumni", 3: "Responsable" };
  const role      = roleMap[user.role_id] || "Alumni";

  return (
    <div className="an-card">

      {/* Bandeau */}
      <div className="an-card-banner"
        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
        <div className="an-card-banner-mesh" />
        <div className="an-card-banner-shine" />

        {/* Statut flottant */}
        <div className="an-card-status"
          style={approved ? {} : {
            background: "rgba(245,158,11,0.18)",
            borderColor: "rgba(245,158,11,0.3)",
          }}>
          <span className="an-card-status-dot"
            style={{ background: approved ? "#4ade80" : "#f59e0b" }} />
          {approved ? "Vérifié" : "En attente"}
        </div>

        {/* Avatar */}
        <div className="an-card-av-shell">
          <div className="an-card-av"
            style={{ background: `linear-gradient(145deg, ${c1}, ${c2})` }}>
            {initials(user)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="an-card-body">
        <div className="an-card-name">{user.first_name} {user.last_name}</div>
        <div className="an-card-email">{user.email}</div>

        {/* Chips */}
        <div className="an-card-chips">
          <span className="an-chip an-chip-role">{role}</span>
          {user.profile?.promotion && (
            <span className="an-chip an-chip-promo">Promo {user.profile.promotion}</span>
          )}
          {user.profile?.job_title && (
            <span className="an-chip an-chip-job">{user.profile.job_title}</span>
          )}
        </div>

        <div className="an-card-sep" />

        {/* Méta */}
        <div className="an-card-meta">
          {user.profile?.entreprise?.nom && (
            <div className="an-meta-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
              {user.profile.entreprise.nom}
            </div>
          )}
          {(user.filiere?.name || user.ufr?.nom) && (
            <div className="an-meta-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              {[user.filiere?.name, user.ufr?.nom].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="an-card-foot">
          <button className="an-card-btn" onClick={() => onView(user.id)}>
            Voir le profil
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function AlumniNetwork() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState("");
  const [sort,    setSort]    = useState("name");
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      setLoading(true); setError(null);
      const res  = await api.get("/alumni/users");
      const data = res.data;
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch { setError("Impossible de charger les membres du réseau."); }
    finally  { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = q
      ? users.filter(u =>
          `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.profile?.job_title?.toLowerCase().includes(q) ||
          u.profile?.promotion?.toString().includes(q))
      : users;
    return [...list].sort((a, b) =>
      sort === "name"
        ? `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
        : (b.profile?.promotion || 0) - (a.profile?.promotion || 0)
    );
  }, [users, search, sort]);

  const approved = users.filter(u => u.status === "approved").length;

  return (
    <div className="an-page">

      {/* ── Header ── */}
      <div className="an-header">
        <div className="an-header-bar" />
        <div className="an-header-body">
          <div className="an-header-left">
            <div className="an-eyebrow">
              <span className="an-eyebrow-line" />
              Réseau Alumni
            </div>
            <h1 className="an-title">Notre communauté</h1>
            <p className="an-sub">Connectez-vous avec les anciens étudiants de la plateforme</p>
          </div>
          {!loading && !error && (
            <div className="an-stats">
              <div className="an-stat">
                <div className="an-stat-val" style={{ color: "#2563eb" }}>{users.length}</div>
                <div className="an-stat-lbl">Membres</div>
              </div>
              <div className="an-stat">
                <div className="an-stat-val" style={{ color: "#059669" }}>{approved}</div>
                <div className="an-stat-lbl">Vérifiés</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Filtres ── */}
      {!loading && !error && (
        <div className="an-filters">
          <div className="an-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" style={{ color: "#94a3b8", flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input className="an-search-inp"
              placeholder="Nom, email, promotion…"
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <span className="an-search-clear" onClick={() => setSearch("")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </span>
            )}
          </div>

          <div className="an-sort">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" style={{ color: "#94a3b8" }}>
              <path d="M3 6h18M7 12h10M11 18h2"/>
            </svg>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="name">Nom A→Z</option>
              <option value="promo">Promotion récente</option>
            </select>
          </div>

          {search && (
            <span className="an-count">
              {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* ── Grille ── */}
      <div className="an-grid">

        {loading && Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}

        {error && !loading && (
          <div className="an-state">
            <div className="an-state-ico">⚠️</div>
            <div className="an-state-title">Erreur de chargement</div>
            <div className="an-state-sub">{error}</div>
            <button className="an-card-btn" onClick={loadUsers}>Réessayer</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="an-state">
            <div className="an-state-ico">🔍</div>
            <div className="an-state-title">Aucun membre trouvé</div>
            <div className="an-state-sub">
              {search ? `Aucun résultat pour « ${search} »` : "Le réseau est vide pour l'instant."}
            </div>
            {search && (
              <button className="an-card-btn" onClick={() => setSearch("")}>
                Effacer la recherche
              </button>
            )}
          </div>
        )}

        {!loading && !error && filtered.map((u, i) => (
          <div key={u.id} style={{
            animation: "anFadeUp .3s ease both",
            animationDelay: `${Math.min(i, 12) * 0.04}s`,
          }}>
            <AlumniCard user={u} onView={id => navigate(`/alumni/profile/${id}`)} />
          </div>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

        /* ── Page ── */
        .an-page {
          min-height: 100vh;
          background: #eef1f9;
          padding: 26px 28px 52px;
          display: flex; flex-direction: column; gap: 18px;
        }

        /* ══════════════════════════════
           HEADER
        ══════════════════════════════ */
        .an-header {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #e2e8f5;
          overflow: hidden;
        }
        .an-header-bar {
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6, #a78bfa);
        }
        .an-header-body {
          display: flex; align-items: center; justify-content: space-between;
          gap: 20px; padding: 24px 28px; flex-wrap: wrap;
        }
        .an-eyebrow {
          font-size: 9px; font-weight: 700; letter-spacing: 3px;
          text-transform: uppercase; color: #3b82f6;
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 8px;
        }
        .an-eyebrow-line {
          display: block; width: 18px; height: 1.5px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 2px;
        }
        .an-title {
          font-size: 22px; font-weight: 700; color: #0f172a;
          letter-spacing: -0.4px; margin-bottom: 4px;
        }
        .an-sub { font-size: 12.5px; color: #64748b; }

        .an-stats { display: flex; gap: 10px; flex-wrap: wrap; }
        .an-stat {
          background: #f8fafd; border: 1px solid #e2e8f5;
          border-radius: 14px; padding: 14px 20px;
          text-align: center; min-width: 84px;
        }
        .an-stat-val {
          font-size: 22px; font-weight: 700; letter-spacing: -1px;
          line-height: 1; margin-bottom: 3px;
        }
        .an-stat-lbl {
          font-size: 9px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: #94a3b8;
        }

        /* ══════════════════════════════
           FILTRES
        ══════════════════════════════ */
        .an-filters { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .an-search {
          flex: 1; min-width: 200px; max-width: 340px;
          display: flex; align-items: center; gap: 8px;
          background: #fff; border: 1px solid #e2e8f5;
          border-radius: 10px; padding: 9px 13px; transition: all .2s;
        }
        .an-search:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
        }
        .an-search-inp {
          background: none; border: none; outline: none;
          font-size: 13px; font-family: 'Inter', system-ui, sans-serif;
          color: #0f172a; width: 100%;
        }
        .an-search-inp::placeholder { color: #cbd5e1; }
        .an-search-clear {
          color: #94a3b8; cursor: pointer; flex-shrink: 0;
          display: flex; transition: color .15s;
        }
        .an-search-clear:hover { color: #ef4444; }

        .an-sort {
          display: flex; align-items: center; gap: 7px;
          background: #fff; border: 1px solid #e2e8f5;
          border-radius: 10px; padding: 9px 12px;
        }
        .an-sort select {
          background: transparent; border: none; outline: none;
          font-size: 12.5px; font-family: 'Inter', system-ui, sans-serif;
          color: #334155; cursor: pointer; appearance: none; min-width: 100px;
        }
        .an-count {
          font-size: 11px; font-weight: 600; color: #3b82f6;
          background: rgba(59,130,246,0.09);
          border: 1px solid rgba(59,130,246,0.16);
          border-radius: 99px; padding: 4px 12px; white-space: nowrap;
        }

        /* ══════════════════════════════
           GRID
        ══════════════════════════════ */
        .an-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
          gap: 15px;
        }
        @media (max-width: 640px) {
          .an-page { padding: 18px 14px 40px; }
          .an-grid { grid-template-columns: 1fr; }
        }

        /* ══════════════════════════════
           CARD
        ══════════════════════════════ */
        .an-card {
          background: #fff;
          border: 1px solid #e2e8f5;
          border-radius: 20px;
          overflow: hidden;
          display: flex; flex-direction: column;
          transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        }
        .an-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 48px rgba(15,23,42,0.1);
          border-color: #b3cff5;
        }

        /* Bandeau */
        .an-card-banner {
          height: 76px; position: relative; overflow: hidden; flex-shrink: 0;
        }
        .an-card-banner-mesh {
          position: absolute; inset: 0; opacity: .18;
          background-image:
            linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .an-card-banner-shine {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 25% 80%, rgba(255,255,255,.18), transparent 58%);
        }

        /* Statut flottant */
        .an-card-status {
          position: absolute; top: 11px; right: 13px; z-index: 2;
          display: flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,0.18);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.28);
          border-radius: 99px; padding: 3px 10px;
          font-size: 9.5px; font-weight: 700; color: #fff; letter-spacing: 0.3px;
        }
        .an-card-status-dot {
          width: 6px; height: 6px; border-radius: 50%;
        }

        /* Avatar */
        .an-card-av-shell {
          position: absolute; bottom: -24px; left: 20px; z-index: 2;
        }
        .an-card-av {
          width: 52px; height: 52px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; font-weight: 700; color: #fff;
          border: 3px solid #fff;
          box-shadow: 0 4px 16px rgba(0,0,0,.14);
          letter-spacing: -0.5px;
        }

        /* Body */
        .an-card-body {
          padding: 34px 20px 18px;
          flex: 1; display: flex; flex-direction: column;
        }
        .an-card-name {
          font-size: 16.5px; font-weight: 700; color: #0f172a;
          letter-spacing: -0.2px; margin-bottom: 2px; line-height: 1.25;
        }
        .an-card-email {
          font-size: 11.5px; color: #94a3b8; margin-bottom: 14px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* Chips */
        .an-card-chips { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 14px; }
        .an-chip {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 10px; font-weight: 600; padding: 3px 9px;
          border-radius: 99px; border: 1px solid; letter-spacing: .2px;
        }
        .an-chip-role  { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
        .an-chip-promo { background: #f5f3ff; color: #5b21b6; border-color: #ddd6fe; }
        .an-chip-job   { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }

        /* Séparateur */
        .an-card-sep { height: 1px; background: #f0f4fc; margin-bottom: 12px; }

        /* Méta */
        .an-card-meta { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .an-meta-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 11.5px; color: #64748b;
        }
        .an-meta-row svg { color: #94a3b8; flex-shrink: 0; }

        /* Footer */
        .an-card-foot { margin-top: auto; display: flex; justify-content: flex-end; }
        .an-card-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600;
          font-family: 'Inter', system-ui, sans-serif;
          color: #2563eb;
          background: rgba(59,130,246,0.07);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 9px; padding: 8px 14px;
          cursor: pointer; transition: all .18s;
        }
        .an-card-btn:hover {
          background: #3b82f6; color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 16px rgba(59,130,246,0.3);
        }
        .an-card-btn svg { transition: transform .18s; }
        .an-card-btn:hover svg { transform: translateX(3px); }

        /* ── State (empty/error) ── */
        .an-state {
          grid-column: 1 / -1;
          padding: 72px 20px; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .an-state-ico { font-size: 36px; }
        .an-state-title { font-size: 15px; font-weight: 700; color: #334155; }
        .an-state-sub   { font-size: 13px; color: #94a3b8; }

        /* ── Skeleton ── */
        @keyframes anShimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .an-skel {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 600px 100%;
          animation: anShimmer 1.4s infinite;
          border-radius: 8px;
        }
        .an-skel-card {
          background: #fff; border: 1px solid #e2e8f5;
          border-radius: 20px; overflow: hidden;
        }
        .an-skel-banner { height: 76px; }
        .an-skel-body {
          padding: 34px 20px 22px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .an-skel-line { height: 12px; border-radius: 6px; }

        /* ── Animation entrée ── */
        @keyframes anFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}