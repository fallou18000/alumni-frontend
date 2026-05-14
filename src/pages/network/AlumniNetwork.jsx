import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

/* ══════════════════════════════════════════════════════
   CSS — design system identique à AdminDashboard (light)
══════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

.an *, .an *::before, .an *::after { box-sizing: border-box; margin: 0; padding: 0; }
.an ::-webkit-scrollbar { width: 4px; }
.an ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 4px; }
.an ::-webkit-scrollbar-track { background: transparent; }

.an {
  min-height: 100vh;
  background: #f0f2f9;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13.5px;
  color: #1e293b;
  -webkit-font-smoothing: antialiased;
  padding: 24px 26px 64px;
  display: flex; flex-direction: column; gap: 20px;
}

:where(.an) {
  --primary:        #6366f1;
  --primary-light:  rgba(99,102,241,0.08);
  --primary-border: rgba(99,102,241,0.2);
  --violet: #8b5cf6;
  --teal:   #0ea5e9;
  --green:  #10b981;
  --gold:   #f59e0b;
  --rose:   #f43f5e;
  --ink1: #0f172a;
  --ink2: #1e293b;
  --ink3: #475569;
  --ink4: #94a3b8;
  --ink5: #cbd5e1;
  --bg:    #f0f2f9;
  --bg2:   #f8faff;
  --white: #ffffff;
  --border:  rgba(15,23,42,0.07);
  --border2: rgba(15,23,42,0.11);
  --shadow-sm: 0 1px 3px rgba(15,23,42,0.06),0 1px 2px rgba(15,23,42,0.04);
  --shadow-md: 0 8px 30px rgba(15,23,42,0.10),0 2px 8px rgba(15,23,42,0.06);
  --r: 16px; --r2: 12px; --r3: 9px;
  --mono: 'DM Mono',monospace;
}

/* ══ BANNER ══ */
.an-banner {
  background: linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#0ea5e9 100%);
  border-radius: var(--r); padding: 28px 32px;
  display: flex; align-items: center; justify-content: space-between;
  position: relative; overflow: hidden;
  box-shadow: 0 8px 32px rgba(79,70,229,0.28);
  flex-wrap: wrap; gap: 20px;
}
.an-banner-pat {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    radial-gradient(circle at 18% 50%,rgba(255,255,255,0.08) 0%,transparent 50%),
    radial-gradient(circle at 82% 20%,rgba(255,255,255,0.06) 0%,transparent 40%);
}
.an-banner-dots {
  position: absolute; right: 210px; top: 0; bottom: 0; width: 200px; pointer-events: none;
  background-image: radial-gradient(circle,rgba(255,255,255,0.13) 1px,transparent 1px);
  background-size: 18px 18px;
}
.an-banner-left { position: relative; z-index: 1; }
.an-banner-eye {
  font-size: 9.5px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
  color: rgba(255,255,255,0.65); margin-bottom: 7px;
  display: flex; align-items: center; gap: 6px;
}
.an-banner-title { font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -.5px; margin-bottom: 5px; line-height: 1.15; }
.an-banner-sub  { font-size: 13px; color: rgba(255,255,255,0.52); }
.an-banner-right {
  position: relative; z-index: 1; display: flex;
  background: rgba(255,255,255,0.1); border-radius: var(--r2);
  border: 1px solid rgba(255,255,255,0.16); overflow: hidden; backdrop-filter: blur(8px);
}
.an-bstat { padding: 16px 24px; text-align: center; border-right: 1px solid rgba(255,255,255,0.13); }
.an-bstat:last-child { border-right: none; }
.an-bsv { font-size: 30px; font-weight: 800; color: #fff; letter-spacing: -1.5px; line-height: 1; font-family: var(--mono); }
.an-bsl { font-size: 9.5px; color: rgba(255,255,255,0.5); margin-top: 5px; letter-spacing: .7px; text-transform: uppercase; }

/* ══ TOOLBAR ══ */
.an-toolbar {
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--r); padding: 16px 20px;
  box-shadow: var(--shadow-sm);
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.an-tl {
  font-size: 8.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  color: var(--ink4); display: flex; align-items: center; gap: 5px; white-space: nowrap;
}
.an-search {
  flex: 1; min-width: 200px; max-width: 380px;
  display: flex; align-items: center; gap: 8px;
  background: var(--bg); border: 1.5px solid var(--border);
  border-radius: var(--r2); padding: 8px 12px; transition: all .22s;
}
.an-search:focus-within {
  border-color: var(--primary-border);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.07);
  background: var(--white);
}
.an-search input {
  background: none; border: none; outline: none;
  font-size: 12.5px; font-family: 'Plus Jakarta Sans',sans-serif;
  color: var(--ink2); width: 100%;
}
.an-search input::placeholder { color: var(--ink5); }
.an-sico { color: var(--ink5); flex-shrink: 0; }
.an-clear { background: none; border: none; cursor: pointer; color: var(--ink5); display: flex; padding: 0; transition: color .15s; flex-shrink: 0; }
.an-clear:hover { color: var(--rose); }
.an-sw {
  display: flex; align-items: center; gap: 7px;
  background: var(--bg); border: 1.5px solid var(--border);
  border-radius: var(--r2); padding: 8px 12px;
}
.an-sw svg { color: var(--ink5); flex-shrink: 0; }
.an-sw select {
  background: transparent; border: none; outline: none;
  font-size: 12.5px; font-family: 'Plus Jakarta Sans',sans-serif;
  color: var(--ink2); cursor: pointer; appearance: none; min-width: 120px;
}
.an-pill {
  font-size: 11px; font-weight: 700; color: var(--primary);
  background: var(--primary-light); border: 1px solid var(--primary-border);
  border-radius: 20px; padding: 3px 10px; white-space: nowrap; font-family: var(--mono);
}

/* ══ GRID ══ */
.an-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(300px,1fr));
  gap: 12px;
}

/* ══ CARD ══ */
.an-card {
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--r); overflow: hidden;
  display: flex; flex-direction: column;
  box-shadow: var(--shadow-sm);
  transition: transform .22s ease,box-shadow .22s ease,border-color .22s ease;
  cursor: pointer; position: relative;
}
.an-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--primary-border); }
.an-card-stripe { height: 3px; width: 100%; background: linear-gradient(90deg,var(--primary),var(--violet)); }
.an-card-head {
  padding: 18px 18px 14px;
  display: flex; align-items: center; gap: 13px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg,rgba(99,102,241,0.025),rgba(139,92,246,0.01));
}
.an-av {
  width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; color: #fff; letter-spacing: -.3px;
}
.an-av-info { flex: 1; min-width: 0; }
.an-uname { font-size: 14px; font-weight: 700; color: var(--ink1); letter-spacing: -.1px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.an-uemail { font-size: 11px; color: var(--ink4); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.an-status {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 700; padding: 3px 8px;
  border-radius: 20px; flex-shrink: 0; letter-spacing: .2px;
}
.an-status::before { content:''; width:5px; height:5px; border-radius:50%; flex-shrink:0; }
.an-s-ok   { background:rgba(16,185,129,0.1);  color:var(--green); border:1px solid rgba(16,185,129,0.2);  }
.an-s-ok::before   { background:var(--green); }
.an-s-wait { background:rgba(245,158,11,0.1);  color:var(--gold);  border:1px solid rgba(245,158,11,0.2);  }
.an-s-wait::before { background:var(--gold); }

.an-card-body { padding:14px 18px 16px; flex:1; display:flex; flex-direction:column; gap:12px; }
.an-meta { display:flex; flex-direction:column; gap:6px; }
.an-mrow { display:flex; align-items:center; gap:7px; font-size:12px; color:var(--ink3); }
.an-mrow svg { color:var(--ink4); flex-shrink:0; }
.an-mrow span { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.an-tags { display:flex; flex-wrap:wrap; gap:5px; }
.an-tag {
  display:inline-flex; align-items:center; font-size:10px; font-weight:700;
  padding:3px 9px; border-radius:20px; border:1px solid; letter-spacing:.2px;
}
.an-t0 { background:var(--primary-light);          color:var(--primary); border-color:var(--primary-border); }
.an-t1 { background:rgba(139,92,246,0.08);         color:var(--violet);  border-color:rgba(139,92,246,0.2); }
.an-t2 { background:rgba(14,165,233,0.08);         color:var(--teal);    border-color:rgba(14,165,233,0.2); }
.an-t3 { background:rgba(16,185,129,0.08);         color:var(--green);   border-color:rgba(16,185,129,0.2); }
.an-tn { background:var(--bg2); color:var(--ink4); border-color:var(--border); }

.an-card-foot {
  padding:11px 18px; border-top:1px solid var(--border); background:var(--bg2);
  display:flex; align-items:center; justify-content:space-between; gap:8px;
}
.an-role {
  font-size:9px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase;
  padding:3px 9px; border-radius:20px; border:1px solid;
}
.an-r-alumni { background:var(--primary-light);        color:var(--primary); border-color:var(--primary-border); }
.an-r-admin  { background:rgba(244,63,94,0.08);        color:var(--rose);    border-color:rgba(244,63,94,0.2); }
.an-r-resp   { background:rgba(245,158,11,0.08);       color:var(--gold);    border-color:rgba(245,158,11,0.2); }
.an-card-btn {
  display:inline-flex; align-items:center; gap:5px;
  font-size:11.5px; font-weight:700; padding:7px 13px;
  border-radius:var(--r3); border:1.5px solid var(--primary-border);
  background:var(--primary-light); color:var(--primary);
  cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all .18s;
}
.an-card-btn:hover { background:var(--primary); color:#fff; border-color:transparent; box-shadow:0 4px 14px rgba(99,102,241,0.3); }
.an-card-btn svg { transition:transform .18s; }
.an-card-btn:hover svg { transform:translateX(2px); }

/* ══ SKELETON ══ */
@keyframes anShimmer {
  0%   { background-position:-500px 0; }
  100% { background-position:500px 0; }
}
.an-skel {
  background:linear-gradient(90deg,#f1f5f9 25%,#e8edf5 50%,#f1f5f9 75%);
  background-size:500px 100%; animation:anShimmer 1.4s infinite; border-radius:8px;
}
.an-skel-card { background:var(--white); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; box-shadow:var(--shadow-sm); }
.an-skel-stripe { height:3px; }
.an-skel-head { padding:18px; display:flex; align-items:center; gap:13px; border-bottom:1px solid var(--border); }
.an-skel-av   { width:44px; height:44px; border-radius:50%; flex-shrink:0; }
.an-skel-info { flex:1; display:flex; flex-direction:column; gap:8px; }
.an-skel-ln   { height:11px; border-radius:6px; }
.an-skel-body { padding:16px 18px; display:flex; flex-direction:column; gap:10px; }
.an-skel-foot { padding:12px 18px; border-top:1px solid var(--border); background:var(--bg2); height:44px; }

/* ══ STATE ══ */
.an-state {
  grid-column:1/-1;
  padding:80px 20px;
  display:flex; flex-direction:column; align-items:center; gap:14px;
  background:var(--white); border:1px solid var(--border);
  border-radius:var(--r); box-shadow:var(--shadow-sm); text-align:center;
}
.an-state-ico   { color:var(--ink5); }
.an-state-title { font-size:15px; font-weight:700; color:var(--ink2); }
.an-state-sub   { font-size:12.5px; color:var(--ink4); }
.an-state-btn {
  display:inline-flex; align-items:center; gap:6px;
  font-size:12px; font-weight:700; padding:8px 18px;
  border-radius:var(--r2); border:1.5px solid var(--primary-border);
  background:var(--primary-light); color:var(--primary);
  cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif;
  transition:all .18s; margin-top:4px;
}
.an-state-btn:hover { background:var(--primary); color:#fff; border-color:transparent; }

/* ══ ANIMATION ══ */
@keyframes anFadeUp {
  from { opacity:0; transform:translateY(8px); }
  to   { opacity:1; transform:translateY(0); }
}

@media (max-width:768px) {
  .an { padding:16px 14px 48px; }
  .an-grid { grid-template-columns:1fr; }
  .an-banner-right { display:none; }
}
`;

if (typeof document !== "undefined" && !document.getElementById("an-css-v4")) {
  const s = document.createElement("style");
  s.id = "an-css-v4"; s.textContent = CSS;
  document.head.appendChild(s);
}

/* ═══════════════════
   HELPERS
═══════════════════ */
const AV_GRADS = [
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#0ea5e9,#6366f1)",
  "linear-gradient(135deg,#f59e0b,#f43f5e)",
  "linear-gradient(135deg,#10b981,#0ea5e9)",
  "linear-gradient(135deg,#8b5cf6,#ec4899)",
  "linear-gradient(135deg,#f43f5e,#f59e0b)",
  "linear-gradient(135deg,#0ea5e9,#10b981)",
  "linear-gradient(135deg,#6366f1,#f43f5e)",
];
const avGrad   = id => AV_GRADS[(id || 0) % AV_GRADS.length];
const initials = u  => ((u?.first_name?.[0] || "") + (u?.last_name?.[0] || "")).toUpperCase() || "AL";
const TAG_CLS  = ["an-t0","an-t1","an-t2","an-t3"];

/* ═══════════════════
   SKELETON
═══════════════════ */
function Skeleton() {
  return (
    <div className="an-skel-card">
      <div className="an-skel an-skel-stripe" />
      <div className="an-skel-head">
        <div className="an-skel an-skel-av" />
        <div className="an-skel-info">
          <div className="an-skel an-skel-ln" style={{ width: "60%" }} />
          <div className="an-skel an-skel-ln" style={{ width: "82%" }} />
        </div>
      </div>
      <div className="an-skel-body">
        <div className="an-skel an-skel-ln" style={{ width: "70%" }} />
        <div className="an-skel an-skel-ln" style={{ width: "50%" }} />
        <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
          <div className="an-skel an-skel-ln" style={{ width: 68, height: 20 }} />
          <div className="an-skel an-skel-ln" style={{ width: 84, height: 20 }} />
        </div>
      </div>
      <div className="an-skel an-skel-foot" />
    </div>
  );
}

/* ═══════════════════
   CARD
═══════════════════ */
function AlumniCard({ user, onView }) {
  const approved = user.status === "approved";
  const roleMap  = { 1: ["Admin", "an-r-admin"], 2: ["Alumni", "an-r-alumni"], 3: ["Responsable", "an-r-resp"] };
  const [roleLabel, roleCls] = roleMap[user.role_id] || ["Alumni", "an-r-alumni"];

  const tags = [
    user.profile?.job_title,
    user.filiere?.name,
    user.ufr?.nom,
    user.profile?.promotion ? `Promo ${user.profile.promotion}` : null,
  ].filter(Boolean);

  return (
    <div className="an-card">
      <div className="an-card-stripe" />

      {/* Header */}
      <div className="an-card-head">
        <div className="an-av" style={{ background: avGrad(user.id) }}>
          {initials(user)}
        </div>
        <div className="an-av-info">
          <div className="an-uname">{user.first_name} {user.last_name}</div>
          <div className="an-uemail">{user.email}</div>
        </div>
        <span className={`an-status ${approved ? "an-s-ok" : "an-s-wait"}`}>
          {approved ? "Vérifié" : "En attente"}
        </span>
      </div>

      {/* Body */}
      <div className="an-card-body">
        <div className="an-meta">
          {user.profile?.entreprise?.nom && (
            <div className="an-mrow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="18" rx="2"/>
                <path d="M8 21V9M16 21V9M2 9h20"/>
              </svg>
              <span>{user.profile.entreprise.nom}</span>
            </div>
          )}
          {(user.filiere?.name || user.ufr?.nom) && (
            <div className="an-mrow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              <span>{[user.filiere?.name, user.ufr?.nom].filter(Boolean).join(" · ")}</span>
            </div>
          )}
          {user.profile?.graduation_year && (
            <div className="an-mrow">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              <span>Diplômé {user.profile.graduation_year}</span>
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="an-tags">
            {tags.slice(0, 4).map((t, i) => (
              <span key={i} className={`an-tag ${TAG_CLS[i] || "an-tn"}`}>{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="an-card-foot">
        <span className={`an-role ${roleCls}`}>{roleLabel}</span>
        <button className="an-card-btn" onClick={() => onView(user.id)}>
          Voir le profil
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════
   PAGE
═══════════════════ */
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
    } catch { setError("Impossible de charger les membres du réseau."); }
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
          u.profile?.entreprise?.nom?.toLowerCase().includes(q) ||
          u.filiere?.name?.toLowerCase().includes(q))
      : users;
    return [...list].sort((a, b) =>
      sort === "name"
        ? `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
        : (b.profile?.promotion || 0) - (a.profile?.promotion || 0)
    );
  }, [users, search, sort]);

  const approved = users.filter(u => u.status === "approved").length;
  const withJob  = users.filter(u => u.profile?.job_title).length;

  return (
    <div className="an">

      {/* ══ BANNER — identique à AdminDashboard ══ */}
      <div className="an-banner">
        <div className="an-banner-pat" />
        <div className="an-banner-dots" />
        <div className="an-banner-left">
          <div className="an-banner-eye">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
            </svg>
            Réseau Alumni
          </div>
          <div className="an-banner-title">Notre communauté</div>
          <div className="an-banner-sub">Connectez-vous avec les anciens étudiants de la plateforme</div>
        </div>
        <div className="an-banner-right">
          <div className="an-bstat">
            <div className="an-bsv">{users.length}</div>
            <div className="an-bsl">Membres</div>
          </div>
          <div className="an-bstat">
            <div className="an-bsv">{approved}</div>
            <div className="an-bsl">Vérifiés</div>
          </div>
          <div className="an-bstat">
            <div className="an-bsv">{withJob}</div>
            <div className="an-bsl">En poste</div>
          </div>
        </div>
      </div>

      {/* ══ TOOLBAR — identique au filter panel de ResponsableDashboard ══ */}
      {!loading && !error && (
        <div className="an-toolbar">
          <div className="an-tl">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M7 12h10M11 18h2"/>
            </svg>
            Recherche
          </div>

          <div className="an-search">
            <svg className="an-sico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              placeholder="Nom, email, poste, promotion…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="an-clear" onClick={() => setSearch("")} aria-label="Effacer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          <div className="an-sw">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M7 12h10M11 18h2"/>
            </svg>
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="name">Nom A → Z</option>
              <option value="promo">Promotion récente</option>
            </select>
          </div>

          {search && (
            <span className="an-pill">
              {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* ══ GRILLE ══ */}
      <div className="an-grid">

        {loading && Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)}

        {error && !loading && (
          <div className="an-state">
            <div className="an-state-ico">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4M12 16h.01"/>
              </svg>
            </div>
            <div className="an-state-title">Erreur de chargement</div>
            <div className="an-state-sub">{error}</div>
            <button className="an-state-btn" onClick={load}>Réessayer</button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="an-state">
            <div className="an-state-ico">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <div className="an-state-title">
              {search ? `Aucun résultat pour « ${search} »` : "Aucun membre pour l'instant"}
            </div>
            {search && (
              <button className="an-state-btn" onClick={() => setSearch("")}>
                Effacer la recherche
              </button>
            )}
          </div>
        )}

        {!loading && !error && filtered.map((u, i) => (
          <div key={u.id} style={{
            animation: "anFadeUp .3s ease both",
            animationDelay: `${Math.min(i, 16) * 35}ms`,
          }}>
            <AlumniCard user={u} onView={id => navigate(`/alumni/profile/${id}`)} />
          </div>
        ))}
      </div>
    </div>
  );
}
