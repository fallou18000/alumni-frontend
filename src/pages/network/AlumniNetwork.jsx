import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

/* ─── Palette réduite : 1 teinte par initiale ─── */
const HUE = [220,250,160,330,190,35,280,12];
const avatarColor = id => {
  const h = HUE[(id || 0) % HUE.length];
  return { bg: `hsl(${h},55%,92%)`, fg: `hsl(${h},55%,35%)` };
};
const initials = u =>
  ((u?.first_name?.[0] || "") + (u?.last_name?.[0] || "")).toUpperCase() || "AL";

/* ─── Skeleton ─── */
function Skeleton() {
  return (
    <div className="an-card an-skel-card">
      <div className="an-skel an-skel-av" />
      <div style={{ flex: 1 }}>
        <div className="an-skel an-skel-ln" style={{ width: "60%", marginBottom: 8 }} />
        <div className="an-skel an-skel-ln" style={{ width: "80%" }} />
      </div>
    </div>
  );
}

/* ─── Card ─── */
function AlumniCard({ user, onView }) {
  const { bg, fg } = avatarColor(user.id);
  const approved = user.status === "approved";

  return (
    <div className="an-card" onClick={() => onView(user.id)} role="button" tabIndex={0}
      onKeyDown={e => e.key === "Enter" && onView(user.id)}>

      {/* Avatar */}
      <div className="an-av" style={{ background: bg, color: fg }}>
        {initials(user)}
      </div>

      {/* Info */}
      <div className="an-info">
        <div className="an-name">
          {user.first_name} {user.last_name}
          <span className={`an-dot ${approved ? "an-dot-ok" : "an-dot-wait"}`} />
        </div>
        <div className="an-email">{user.email}</div>

        <div className="an-tags">
          {user.profile?.job_title && (
            <span className="an-tag">{user.profile.job_title}</span>
          )}
          {user.profile?.promotion && (
            <span className="an-tag an-tag-subtle">Promo {user.profile.promotion}</span>
          )}
          {user.profile?.entreprise?.nom && (
            <span className="an-tag an-tag-subtle">{user.profile.entreprise.nom}</span>
          )}
        </div>
      </div>

      {/* Arrow */}
      <div className="an-arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════ PAGE ═══════════════ */
export default function AlumniNetwork() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [search,  setSearch]  = useState("");
  const [sort,    setSort]    = useState("name");
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true); setError(null);
      const res  = await api.get("/alumni/users");
      const data = res.data;
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch { setError("Impossible de charger les membres."); }
    finally  { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = q
      ? users.filter(u =>
          `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.profile?.job_title?.toLowerCase().includes(q) ||
          u.profile?.promotion?.toString().includes(q) ||
          u.profile?.entreprise?.nom?.toLowerCase().includes(q))
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

      {/* ── En-tête ── */}
      <div className="an-head">
        <div className="an-head-left">
          <div className="an-label">Réseau alumni</div>
          <h1 className="an-title">Notre communauté</h1>
          <p className="an-sub">Retrouvez et connectez-vous avec les anciens étudiants</p>
        </div>
        {!loading && !error && (
          <div className="an-kpis">
            <div className="an-kpi">
              <div className="an-kpi-val">{users.length}</div>
              <div className="an-kpi-lbl">Membres</div>
            </div>
            <div className="an-kpi-sep" />
            <div className="an-kpi">
              <div className="an-kpi-val an-kpi-green">{approved}</div>
              <div className="an-kpi-lbl">Vérifiés</div>
            </div>
            <div className="an-kpi-sep" />
            <div className="an-kpi">
              <div className="an-kpi-val an-kpi-muted">
                {users.length - approved}
              </div>
              <div className="an-kpi-lbl">En attente</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Barre de recherche ── */}
      {!loading && !error && (
        <div className="an-toolbar">
          <div className="an-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" className="an-search-ico">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input className="an-search-inp"
              placeholder="Nom, email, poste, promotion…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="an-clear" onClick={() => setSearch("")} aria-label="Effacer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          <div className="an-select-wrap">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" className="an-select-ico">
              <path d="M3 6h18M7 12h10M11 18h2"/>
            </svg>
            <select className="an-select" value={sort}
              onChange={e => setSort(e.target.value)}>
              <option value="name">Nom A → Z</option>
              <option value="promo">Promotion récente</option>
            </select>
          </div>

          {search && (
            <span className="an-badge">
              {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* ── Liste ── */}
      <div className="an-list">

        {loading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}

        {error && !loading && (
          <div className="an-state">
            <div className="an-state-ico">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
            </div>
            <div className="an-state-title">Erreur de chargement</div>
            <div className="an-state-sub">{error}</div>
            <button className="an-retry" onClick={load}>Réessayer</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="an-state">
            <div className="an-state-ico">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <div className="an-state-title">
              {search ? `Aucun résultat pour « ${search} »` : "Le réseau est vide"}
            </div>
            {search && (
              <button className="an-retry" onClick={() => setSearch("")}>
                Effacer la recherche
              </button>
            )}
          </div>
        )}

        {!loading && !error && filtered.map((u, i) => (
          <div key={u.id} style={{
            animation: "anUp .25s ease both",
            animationDelay: `${Math.min(i, 15) * 30}ms`,
          }}>
            <AlumniCard user={u} onView={id => navigate(`/alumni/profile/${id}`)} />
          </div>
        ))}
      </div>

      {/* ── Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .an-page {
          min-height: 100vh;
          background: #f4f6fb;
          padding: 32px 28px 64px;
          display: flex; flex-direction: column; gap: 16px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ── En-tête ── */
        .an-head {
          display: flex; align-items: flex-end; justify-content: space-between;
          gap: 24px; flex-wrap: wrap;
          background: #fff;
          border: 1px solid rgba(15,23,42,0.07);
          border-radius: 18px;
          padding: 28px 32px;
          position: relative; overflow: hidden;
        }
        .an-head::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #0ea5e9);
        }
        .an-label {
          font-size: 9px; font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; color: #6366f1; margin-bottom: 8px;
          display: flex; align-items: center; gap: 6px;
        }
        .an-label::before {
          content: ''; display: block; width: 16px; height: 1.5px;
          background: #6366f1; border-radius: 2px;
        }
        .an-title {
          font-size: 24px; font-weight: 700; color: #0f172a;
          letter-spacing: -0.5px; margin-bottom: 5px;
        }
        .an-sub { font-size: 13px; color: #64748b; font-weight: 400; }

        /* KPIs */
        .an-kpis {
          display: flex; align-items: center; gap: 0;
          background: #f8fafc; border: 1px solid rgba(15,23,42,0.07);
          border-radius: 14px; overflow: hidden; flex-shrink: 0;
        }
        .an-kpi { padding: 14px 22px; text-align: center; }
        .an-kpi-sep { width: 1px; background: rgba(15,23,42,0.07); align-self: stretch; }
        .an-kpi-val {
          font-size: 24px; font-weight: 700; color: #0f172a;
          letter-spacing: -1px; line-height: 1; margin-bottom: 3px;
          font-family: 'DM Mono', monospace;
        }
        .an-kpi-val.an-kpi-green { color: #10b981; }
        .an-kpi-val.an-kpi-muted { color: #94a3b8; }
        .an-kpi-lbl {
          font-size: 9px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: #94a3b8;
        }

        /* ── Toolbar ── */
        .an-toolbar {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
        }
        .an-search {
          flex: 1; min-width: 220px; max-width: 400px;
          display: flex; align-items: center; gap: 8px;
          background: #fff; border: 1px solid rgba(15,23,42,0.09);
          border-radius: 12px; padding: 10px 14px;
          transition: border-color .2s, box-shadow .2s;
        }
        .an-search:focus-within {
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.07);
        }
        .an-search-ico { color: #94a3b8; flex-shrink: 0; }
        .an-search-inp {
          background: none; border: none; outline: none;
          font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0f172a; width: 100%;
        }
        .an-search-inp::placeholder { color: #c8d1e0; }
        .an-clear {
          background: none; border: none; cursor: pointer;
          color: #94a3b8; display: flex; padding: 0; transition: color .15s;
        }
        .an-clear:hover { color: #f43f5e; }

        .an-select-wrap {
          display: flex; align-items: center; gap: 7px;
          background: #fff; border: 1px solid rgba(15,23,42,0.09);
          border-radius: 12px; padding: 10px 13px;
        }
        .an-select-ico { color: #94a3b8; flex-shrink: 0; }
        .an-select {
          background: transparent; border: none; outline: none;
          font-size: 12.5px; font-family: 'Plus Jakarta Sans', sans-serif;
          color: #334155; cursor: pointer; appearance: none; min-width: 120px;
        }
        .an-badge {
          font-size: 11px; font-weight: 600; color: #6366f1;
          background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.18);
          border-radius: 99px; padding: 4px 12px; white-space: nowrap;
          font-family: 'DM Mono', monospace;
        }

        /* ── Liste ── */
        .an-list {
          display: flex; flex-direction: column; gap: 6px;
        }

        /* ── Card ── */
        .an-card {
          display: flex; align-items: center; gap: 16px;
          background: #fff;
          border: 1px solid rgba(15,23,42,0.07);
          border-radius: 14px;
          padding: 16px 20px;
          cursor: pointer;
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
          outline: none;
        }
        .an-card:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(15,23,42,0.08);
          border-color: rgba(99,102,241,0.25);
        }
        .an-card:focus-visible {
          box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
        }

        /* Avatar */
        .an-av {
          width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; letter-spacing: -0.3px;
        }

        /* Info */
        .an-info { flex: 1; min-width: 0; }
        .an-name {
          font-size: 14px; font-weight: 600; color: #0f172a;
          letter-spacing: -0.1px; margin-bottom: 2px;
          display: flex; align-items: center; gap: 7px;
        }
        .an-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }
        .an-dot-ok   { background: #10b981; }
        .an-dot-wait { background: #f59e0b; }

        .an-email {
          font-size: 11.5px; color: #94a3b8; margin-bottom: 10px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* Tags */
        .an-tags { display: flex; flex-wrap: wrap; gap: 5px; }
        .an-tag {
          font-size: 10.5px; font-weight: 600; padding: 2px 9px;
          border-radius: 99px; border: 1px solid;
          white-space: nowrap;
          background: rgba(99,102,241,0.07);
          color: #4f46e5;
          border-color: rgba(99,102,241,0.2);
        }
        .an-tag-subtle {
          background: #f4f6fb;
          color: #64748b;
          border-color: rgba(15,23,42,0.08);
        }

        /* Flèche */
        .an-arrow {
          color: #c8d1e0; flex-shrink: 0; transition: color .18s, transform .18s;
          display: flex; align-items: center;
        }
        .an-card:hover .an-arrow {
          color: #6366f1; transform: translateX(3px);
        }

        /* ── State ── */
        .an-state {
          padding: 80px 20px; text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          background: #fff; border: 1px solid rgba(15,23,42,0.07);
          border-radius: 14px;
        }
        .an-state-ico { color: #cbd5e1; }
        .an-state-title {
          font-size: 15px; font-weight: 600; color: #334155;
        }
        .an-retry {
          margin-top: 4px;
          font-size: 12.5px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #6366f1; background: rgba(99,102,241,0.07);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 9px; padding: 8px 18px;
          cursor: pointer; transition: all .18s;
        }
        .an-retry:hover {
          background: #6366f1; color: #fff; border-color: transparent;
        }

        /* ── Skeleton ── */
        @keyframes anShimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .an-skel {
          background: linear-gradient(90deg, #f1f5f9 25%, #e8edf5 50%, #f1f5f9 75%);
          background-size: 400px 100%;
          animation: anShimmer 1.3s infinite;
          border-radius: 8px;
        }
        .an-skel-card {
          pointer-events: none; cursor: default;
        }
        .an-skel-av {
          width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
        }
        .an-skel-ln { height: 12px; border-radius: 6px; }

        /* ── Animation entrée ── */
        @keyframes anUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .an-page { padding: 18px 14px 48px; }
          .an-head { padding: 22px 20px; }
          .an-kpis { display: none; }
          .an-card { padding: 14px 16px; }
        }
      `}</style>
    </div>
  );
}
