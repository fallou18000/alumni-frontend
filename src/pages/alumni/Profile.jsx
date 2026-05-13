import { useEffect, useState } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

/* ─── Icônes SVG inline ─────────────────────────────── */
const Ico = ({ children, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const IcoUser      = () => <Ico><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></Ico>;
const IcoGrad      = () => <Ico><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></Ico>;
const IcoDoc       = () => <Ico><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></Ico>;
const IcoChevron   = () => <Ico><polyline points="9 18 15 12 9 6"/></Ico>;
const IcoPlus      = () => <Ico><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Ico>;
const IcoBriefcase = () => <Ico><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></Ico>;
const IcoMail      = () => <Ico><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></Ico>;
const IcoBook      = () => <Ico><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></Ico>;
const IcoBuilding  = () => <Ico><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></Ico>;
const IcoHash      = () => <Ico><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></Ico>;
const IcoMapPin    = () => <Ico><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></Ico>;
const IcoStar      = () => <Ico><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Ico>;
const IcoShield    = () => <Ico><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Ico>;

/* ─── TABS config ───────────────────────────────────── */
const TABS = [
  { key: "info",     label: "Informations",  Icon: IcoUser      },
  { key: "academic", label: "Parcours",       Icon: IcoGrad      },
  { key: "docs",     label: "Documents",      Icon: IcoDoc       },
];

/* ─── Champ label/valeur ────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value, accent }) => (
  <div className="pf-info-row">
    <div className="pf-info-ico">{Icon && <Icon />}</div>
    <div className="pf-info-body">
      <span className="pf-info-label">{label}</span>
      <span className={`pf-info-value${accent ? " pf-info-accent" : ""}`}>
        {value || "—"}
      </span>
    </div>
  </div>
);

/* ─── Champ input drawer ────────────────────────────── */
const fieldMeta = {
  filiere_id:      { label: "Filière (ID)",    ph: "Ex: 3"          },
  graduation_year: { label: "Année diplôme",   ph: "Ex: 2020"       },
  degree_level:    { label: "Niveau",           ph: "Ex: Master"     },
  status:          { label: "Statut",           ph: "Ex: Employé"    },
  job_title:       { label: "Poste actuel",     ph: "Ex: Dev Senior" },
  promotion:       { label: "Promotion",        ph: "Ex: Promo 2021" },
  entreprise_id:   { label: "Entreprise (ID)",  ph: "Auto"           },
};

/* ════════════════════════════════════════════════════ */
export default function Profile() {
  const [data,        setData]        = useState(null);
  const [tab,         setTab]         = useState("info");
  const [editOpen,    setEditOpen]    = useState(false);
  const [diplomeOpen, setDiplomeOpen] = useState(false);
  const [form,        setForm]        = useState({});
  const [photo,       setPhoto]       = useState(null);
  const [preview,     setPreview]     = useState(null);
  const [entreprises, setEntreprises] = useState([]);
  const [openCreate,  setOpenCreate]  = useState(false);
  const [newEntreprise, setNewEntreprise] = useState({ nom: "", ville: "", secteur: "" });
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const { id }    = useParams();
  const token     = localStorage.getItem("token");
  const headers   = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const res = id
        ? await api.get(`/admin/profile/${id}`, { headers })
        : await api.get("/profile", { headers });
      setData(res.data);
      setForm({
       filiere_id:
  res.data.profile?.filiere_id ||
  res.data.filiere?.id ||
  "",
        graduation_year: res.data.profile?.graduation_year || "",
        degree_level:    res.data.profile?.degree_level    || "",
        status:          res.data.profile?.status          || "",
        job_title:       res.data.profile?.job_title       || "",
        promotion:       res.data.profile?.promotion       || "",
        entreprise_id:   res.data.profile?.entreprise_id   || "",
      });
    } catch (err) {
      console.log("❌ FETCH ERROR =", err);
    }
  };

  const loadEntreprises = async () => {
    try {
      const res = await api.get("/entreprises", { headers });
      setEntreprises(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    loadEntreprises();
  }, [id]);

const handleSave = async () => {
  try {

    setSaving(true);

    const fd = new FormData();

    Object.keys(form).forEach(k => {
      if (
        form[k] !== null &&
        form[k] !== undefined &&
        form[k] !== ""
      ) {
        fd.append(k, form[k]);
      }
    });

    // ✅ fallback automatique
    const filiereId =
      form.filiere_id || data?.filiere?.id;

    fd.append("filiere_id", filiereId);

    console.log("FILIERE =", filiereId);

    console.log([...fd.entries()]);

    if (photo) {
      fd.append("photo", photo);
    }

    if (id) {
      await api.post(
        `/admin/profile/${id}?_method=PUT`,
        fd,
        { headers }
      );
    } else {
      await api.post(
        "/profile",
        fd,
        { headers }
      );
    }

    setEditOpen(false);

    await fetchData();

  } catch (err) {

    console.log(err.response?.data);

  } finally {

    setSaving(false);

  }
};

  const handleCreateEntreprise = async () => {
    setCreating(true);
    try {
      const res = await api.post("/entreprises", newEntreprise, { headers });
      setEntreprises([...entreprises, res.data]);
      setForm({ ...form, entreprise_id: res.data.id });
      setOpenCreate(false);
      setNewEntreprise({ nom: "", ville: "", secteur: "" });
    } catch (err) {
      console.log(err);
    }
    setCreating(false);
  };

  if (!data) return (
    <div className="pf-loading">
      <div className="pf-spinner" />
      <span>Chargement du profil…</span>
    </div>
  );

  const u = data;
  const p = data.profile || {};
  const fullName = `${u.first_name || ""} ${u.last_name || ""}`.trim();
  const initials = `${u.first_name?.[0] || ""}${u.last_name?.[0] || ""}`.toUpperCase() || "AL";

  // ── Helper : construit l'URL d'un fichier stocké sur le backend ──
  const storageUrl = (path) => `${API_URL}/storage/${path}`;

  return (
    <div className="pf-root">

      {/* ── PAGE HEADER ─────────────────────────────── */}
      <motion.div
        className="pf-page-header"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="pf-page-header-inner">
          <div className="pf-page-header-avatar">{initials}</div>
          <div>
            <h1 className="pf-page-title">Profil — {fullName || "Utilisateur"}</h1>
            <p className="pf-page-sub">Gérez vos informations personnelles et académiques</p>
          </div>
        </div>
        <div className="pf-header-badge">
          <IcoShield />
          <span>Vérifié</span>
        </div>
      </motion.div>

      {/* ── TABS ────────────────────────────────────── */}
      <div className="pf-tabs">
        {TABS.map(({ key, label, Icon }, i) => (
          <motion.button
            key={key}
            className={`pf-tab${tab === key ? " pf-tab-active" : ""}`}
            onClick={() => setTab(key)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <span className="pf-tab-ico"><Icon /></span>
            {label}
          </motion.button>
        ))}
      </div>

      {/* ── MAIN GRID ───────────────────────────────── */}
      <div className="pf-grid">

        {/* ── COLONNE GAUCHE : photo ── */}
        <motion.div
          className="pf-card pf-photo-card"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="pf-card-header">
            <span className="pf-card-title-ico"><FaCamera /></span>
            <span className="pf-card-title-txt">Photo de profil</span>
          </div>

          <div className="pf-photo-box">
            {preview ? (
              <img src={preview} className="pf-photo-img" alt="preview" />
            ) : p.photo ? (
              <img
                src={storageUrl(p.photo)}
                className="pf-photo-img"
                alt="photo"
              />
            ) : (
              <div className="pf-photo-empty">
                <IcoUser />
                <span>Aucune photo</span>
              </div>
            )}

            <label className="pf-camera-btn" title="Changer la photo">
              <FaCamera size={13} />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={e => {
                  const file = e.target.files[0];
                  setPhoto(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>

          {/* Mini carte identité */}
          <div className="pf-identity">
            <div className="pf-identity-name">{fullName || "—"}</div>
            <div className="pf-identity-role">
              {p.job_title || "Alumni"}
            </div>
            <div className="pf-identity-tags">
              {p.status && (
                <span className="pf-tag pf-tag-green">{p.status}</span>
              )}
              {p.graduation_year && (
                <span className="pf-tag pf-tag-blue">Promo {p.graduation_year}</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── COLONNE DROITE : contenu par onglet ── */}
        <AnimatePresence mode="wait">

          {/* ── INFOS ── */}
          {tab === "info" && (
            <motion.div
              key="info"
              className="pf-card"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="pf-card-header">
                <span className="pf-card-title-ico"><IcoUser /></span>
                <span className="pf-card-title-txt">Informations personnelles</span>
              </div>

              <div className="pf-info-grid">
                <InfoRow icon={IcoUser}      label="Prénom / Nom"  value={fullName} />
                <InfoRow icon={IcoMail}      label="Email"         value={u.email} />
                <InfoRow icon={IcoBook}      label="UFR"           value={u.ufr?.nom} />
                <InfoRow icon={IcoHash}      label="Département"   value={u.departement?.nom} />
                 <InfoRow
    icon={IcoStar}
    label="Filière"
    value={u.filiere?.name || u.filiere?.nom}
  />
                <InfoRow icon={IcoHash}      label="N° dossier"    value={u.numero_dossier} />
              </div>
            </motion.div>
          )}

          {/* ── ACADEMIC ── */}
          {tab === "academic" && (
            <motion.div
              key="academic"
              className="pf-card"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="pf-card-header">
                <span className="pf-card-title-ico"><IcoGrad /></span>
                <span className="pf-card-title-txt">Parcours académique</span>
                <button className="pf-edit-btn" onClick={() => setEditOpen(true)}>
                  Modifier
                  <span className="pf-edit-arr"><IcoChevron /></span>
                </button>
              </div>

              <div className="pf-info-grid">
                <InfoRow icon={IcoStar}      label="Année diplôme"  value={p.graduation_year} />
                <InfoRow icon={IcoBook}      label="Niveau"          value={p.degree_level} />
                <InfoRow icon={IcoBriefcase} label="Poste actuel"    value={p.job_title} accent />
                <InfoRow icon={IcoHash}      label="Promotion"       value={p.promotion} />
                <InfoRow icon={IcoShield}    label="Statut"          value={p.status || "Non renseigné"} />
                <InfoRow icon={IcoBuilding}  label="Entreprise"      value={u.profile?.entreprise?.nom || "Non renseigné"} />
              </div>

              {/* Sélecteur entreprise */}
              <div className="pf-section-sep" />
              <div className="pf-section-label">Associer une entreprise</div>

              <div className="pf-select-row">
                <div className="pf-select-wrap">
                  <select
                    value={form.entreprise_id}
                    onChange={e => setForm({ ...form, entreprise_id: e.target.value })}
                    className="pf-select"
                  >
                    <option value="">— Choisir une entreprise —</option>
                    {entreprises.map(e => (
                      <option key={e.id} value={e.id}>{e.nom}</option>
                    ))}
                  </select>
                  <span className="pf-select-chevron"><IcoChevron /></span>
                </div>

                <button
                  className="pf-add-btn"
                  onClick={() => setOpenCreate(true)}
                >
                  <IcoPlus />
                  Nouvelle
                </button>
              </div>
            </motion.div>
          )}

          {/* ── DOCS ── */}
          {tab === "docs" && (
            <motion.div
              key="docs"
              className="pf-card"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="pf-card-header">
                <span className="pf-card-title-ico"><IcoDoc /></span>
                <span className="pf-card-title-txt">Diplôme & Documents</span>
              </div>

              <div
                className="pf-diplome-box"
                onClick={() => u.photo_diplome && setDiplomeOpen(true)}
                title={u.photo_diplome ? "Cliquer pour agrandir" : ""}
              >
                {u.photo_diplome ? (
                  <>
                    <img
                      src={storageUrl(u.photo_diplome)}
                      className="pf-diplome-img"
                      alt="Diplôme"
                    />
                    <div className="pf-diplome-overlay">
                      <IcoDoc />
                      <span>Voir en grand</span>
                    </div>
                  </>
                ) : (
                  <div className="pf-diplome-empty">
                    <IcoDoc />
                    <span>Aucun diplôme renseigné</span>
                    <p>Contactez l'administration pour téléverser votre diplôme</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ════════ MODAL DIPLÔME ════════ */}
      <AnimatePresence>
        {diplomeOpen && (
          <motion.div
            className="pf-modal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDiplomeOpen(false)}
          >
            <motion.div
              className="pf-modal-inner"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="pf-modal-close" onClick={() => setDiplomeOpen(false)}>
                <FaTimes />
              </button>
              <img
                src={storageUrl(u.photo_diplome)}
                className="pf-modal-img"
                alt="Diplôme"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════ DRAWER EDIT ════════ */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            className="pf-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditOpen(false)}
          >
            <motion.div
              className="pf-drawer"
              initial={{ x: 440 }}
              animate={{ x: 0 }}
              exit={{ x: 440 }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="pf-drawer-head">
                <div className="pf-drawer-title">
                  <span className="pf-drawer-title-ico"><IcoGrad /></span>
                  Modifier le profil
                </div>
                <button className="pf-drawer-close" onClick={() => setEditOpen(false)}>
                  <FaTimes size={14} />
                </button>
              </div>

              <div className="pf-drawer-body">
  {Object.keys(form).map(k => (
    k !== "entreprise_id" && k !== "filiere_id" && (
      <div key={k} className="pf-field">
        <label className="pf-field-label">
          {fieldMeta[k]?.label || k}
        </label>

        <input
          value={form[k] ?? ""}
          onChange={e => setForm({ ...form, [k]: e.target.value })}
          placeholder={fieldMeta[k]?.ph || k}
          className="pf-input"
        />
      </div>
    )
  ))}
</div>
              <div className="pf-drawer-footer">
                <button className="pf-btn-ghost" onClick={() => setEditOpen(false)}>
                  Annuler
                </button>
                <button
                  className="pf-btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <><span className="pf-btn-spinner" /> Sauvegarde…</>
                  ) : (
                    "Sauvegarder"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════ DRAWER CRÉER ENTREPRISE ════════ */}
      <AnimatePresence>
        {openCreate && (
          <motion.div
            className="pf-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenCreate(false)}
          >
            <motion.div
              className="pf-drawer"
              initial={{ x: 440 }}
              animate={{ x: 0 }}
              exit={{ x: 440 }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="pf-drawer-head">
                <div className="pf-drawer-title">
                  <span className="pf-drawer-title-ico"><IcoBuilding /></span>
                  Nouvelle entreprise
                </div>
                <button className="pf-drawer-close" onClick={() => setOpenCreate(false)}>
                  <FaTimes size={14} />
                </button>
              </div>

              <div className="pf-drawer-body">
                {[
                  { key: "nom",     label: "Nom de l'entreprise", ph: "Ex: Google Sénégal",  ico: IcoBuilding },
                  { key: "ville",   label: "Ville",                ph: "Ex: Dakar",           ico: IcoMapPin   },
                  { key: "secteur", label: "Secteur d'activité",   ph: "Ex: Technologies",    ico: IcoBriefcase },
                ].map(({ key, label, ph, ico: Icon }) => (
                  <div key={key} className="pf-field">
                    <label className="pf-field-label">{label}</label>
                    <div className="pf-input-wrap">
                      <span className="pf-input-ico"><Icon /></span>
                      <input
                        value={newEntreprise[key]}
                        onChange={e => setNewEntreprise({ ...newEntreprise, [key]: e.target.value })}
                        placeholder={ph}
                        className="pf-input pf-input-has-ico"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pf-drawer-footer">
                <button className="pf-btn-ghost" onClick={() => setOpenCreate(false)}>
                  Annuler
                </button>
                <button
                  className="pf-btn-primary"
                  onClick={handleCreateEntreprise}
                  disabled={creating || !newEntreprise.nom}
                >
                  {creating ? (
                    <><span className="pf-btn-spinner" /> Création…</>
                  ) : (
                    <>
                      <IcoPlus />
                      Créer l'entreprise
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════ STYLES ════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');

        :root {
          --pf-b:   #4f8ef5;
          --pf-b2:  #7eb3ff;
          --pf-b3:  rgba(79,142,245,0.10);
          --pf-v:   #9e7bf5;
          --pf-v2:  #c4aeff;
          --pf-em:  #22d3a0;
          --pf-re:  #f43f5e;

          --pf-bg:  #eef2f9;
          --pf-card: #ffffff;
          --pf-border: rgba(99,139,246,0.11);

          --pf-t0: #0f172a;
          --pf-t1: #1e293b;
          --pf-t2: #475569;
          --pf-t3: #94a3b8;
          --pf-t4: #cbd5e1;

          --pf-ff: 'Lora', Georgia, serif;
          --pf-fb: 'Inter', system-ui, sans-serif;

          --pf-r1: 16px;
          --pf-r2: 12px;
          --pf-r3: 10px;
          --pf-r4: 20px;
        }

        /* ── Root & loading ─── */
        .pf-root {
          min-height: 100vh;
          background: var(--pf-bg);
          padding: 28px 32px 40px;
          font-family: var(--pf-fb);
          -webkit-font-smoothing: antialiased;
          color: var(--pf-t0);
        }

        .pf-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          height: 60vh;
          font-size: 13px;
          color: var(--pf-t2);
          font-family: var(--pf-fb);
        }
        .pf-spinner {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 3px solid rgba(79,142,245,0.15);
          border-top-color: var(--pf-b);
          animation: pf-spin 0.8s linear infinite;
        }
        @keyframes pf-spin { to { transform: rotate(360deg); } }

        /* ── Page header ─── */
        .pf-page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border-radius: var(--pf-r4);
          padding: 20px 26px;
          border: 1px solid var(--pf-border);
          box-shadow: 0 1px 4px rgba(99,139,246,0.05), 0 4px 20px rgba(99,139,246,0.05);
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }
        .pf-page-header::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--pf-b), var(--pf-v));
          border-radius: var(--pf-r4) var(--pf-r4) 0 0;
        }

        .pf-page-header-inner {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .pf-page-header-avatar {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: linear-gradient(145deg, #2563eb, #7c3aed);
          color: #fff;
          font-family: var(--pf-ff);
          font-size: 17px;
          font-weight: 600;
          font-style: italic;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 3px rgba(79,142,245,0.15), 0 4px 14px rgba(79,142,245,0.25);
          flex-shrink: 0;
        }
        .pf-page-title {
          font-family: var(--pf-ff);
          font-size: 18px;
          font-weight: 600;
          color: var(--pf-t0);
          margin: 0 0 3px;
          letter-spacing: .1px;
        }
        .pf-page-sub {
          font-size: 12px;
          color: var(--pf-t3);
          margin: 0;
        }
        .pf-header-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #059669;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 5px 12px;
          border-radius: 20px;
        }

        /* ── TABS ─── */
        .pf-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .pf-tab {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          border-radius: var(--pf-r2);
          border: 1px solid var(--pf-border);
          background: #ffffff;
          font-size: 12.5px;
          font-weight: 500;
          color: var(--pf-t2);
          cursor: pointer;
          font-family: var(--pf-fb);
          transition: all .18s;
          box-shadow: 0 1px 3px rgba(99,139,246,0.04);
        }
        .pf-tab:hover {
          background: #f0f5ff;
          color: var(--pf-b);
          border-color: rgba(79,142,245,0.22);
        }
        .pf-tab-active {
          background: linear-gradient(135deg, var(--pf-b), var(--pf-v)) !important;
          color: #fff !important;
          border-color: transparent !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 16px rgba(79,142,245,0.28) !important;
        }
        .pf-tab-ico {
          display: flex;
          opacity: .8;
        }
        .pf-tab-active .pf-tab-ico { opacity: 1; }

        /* ── GRID ─── */
        .pf-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 18px;
          align-items: start;
        }
        @media (max-width: 860px) {
          .pf-grid { grid-template-columns: 1fr; }
        }

        /* ── CARD ─── */
        .pf-card {
          background: var(--pf-card);
          border-radius: var(--pf-r4);
          border: 1px solid var(--pf-border);
          box-shadow: 0 1px 4px rgba(99,139,246,0.05), 0 6px 24px rgba(99,139,246,0.05);
          overflow: hidden;
        }
        .pf-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 22px;
          border-bottom: 1px solid rgba(99,139,246,0.08);
          background: linear-gradient(90deg, rgba(79,142,245,0.03), rgba(158,123,245,0.025));
        }
        .pf-card-title-ico {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(79,142,245,0.12), rgba(158,123,245,0.10));
          color: var(--pf-b);
          flex-shrink: 0;
        }
        .pf-card-title-txt {
          font-family: var(--pf-ff);
          font-size: 14.5px;
          font-weight: 600;
          color: var(--pf-t0);
          flex: 1;
          letter-spacing: .1px;
        }

        /* ── PHOTO card ─── */
        .pf-photo-card { }
        .pf-photo-box {
          margin: 18px 18px 0;
          height: 200px;
          border-radius: var(--pf-r1);
          background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 50%, #f0f9ff 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(99,139,246,0.12);
        }
        .pf-photo-img {
          width: 100%; height: 100%;
          object-fit: cover;
        }
        .pf-photo-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: var(--pf-t3);
          font-size: 12px;
        }
        .pf-photo-empty svg {
          width: 32px; height: 32px;
          opacity: .4;
        }
        .pf-camera-btn {
          position: absolute;
          bottom: 10px; right: 10px;
          width: 34px; height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--pf-b), var(--pf-v));
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(79,142,245,0.40);
          transition: transform .18s, box-shadow .18s;
        }
        .pf-camera-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 20px rgba(79,142,245,0.50);
        }

        .pf-identity {
          padding: 16px 18px 20px;
          text-align: center;
        }
        .pf-identity-name {
          font-family: var(--pf-ff);
          font-size: 16px; font-weight: 600;
          color: var(--pf-t0);
          margin-bottom: 4px;
        }
        .pf-identity-role {
          font-size: 12px;
          color: var(--pf-b);
          font-weight: 500;
          margin-bottom: 12px;
        }
        .pf-identity-tags {
          display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;
        }
        .pf-tag {
          font-size: 9.5px; font-weight: 700;
          padding: 3px 9px; border-radius: 6px;
          letter-spacing: .5px;
        }
        .pf-tag-green { background: #ecfdf5; color: #059669; }
        .pf-tag-blue  { background: #eff6ff; color: #2563eb; }
        .pf-tag-violet{ background: #f5f3ff; color: #7c3aed; }

        /* ── INFO GRID ─── */
        .pf-info-grid {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pf-info-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: var(--pf-r3);
          background: #f8fafc;
          border: 1px solid rgba(99,139,246,0.07);
          transition: background .15s;
        }
        .pf-info-row:hover { background: #f0f5ff; }
        .pf-info-ico {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: rgba(79,142,245,0.08);
          color: var(--pf-b);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pf-info-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }
        .pf-info-label {
          font-size: 10px; font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase;
          color: var(--pf-t3);
        }
        .pf-info-value {
          font-size: 13.5px; font-weight: 500;
          color: var(--pf-t1);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .pf-info-accent { color: var(--pf-b); font-weight: 600; }

        /* ── EDIT BTN (dans card-header) ─── */
        .pf-edit-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 13px;
          border-radius: 8px;
          border: 1px solid rgba(79,142,245,0.20);
          background: #f0f5ff;
          color: var(--pf-b);
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          font-family: var(--pf-fb);
          transition: all .16s;
        }
        .pf-edit-btn:hover {
          background: var(--pf-b);
          color: #fff;
          border-color: transparent;
        }
        .pf-edit-arr { display: flex; }

        /* ── SECTION sep / label ─── */
        .pf-section-sep {
          height: 1px;
          background: rgba(99,139,246,0.08);
          margin: 4px 20px 0;
        }
        .pf-section-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: var(--pf-t3);
          padding: 14px 20px 8px;
        }

        /* ── SELECT ─── */
        .pf-select-row {
          padding: 0 20px 20px;
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .pf-select-wrap {
          flex: 1;
          position: relative;
        }
        .pf-select {
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
          padding: 10px 36px 10px 14px;
          border-radius: var(--pf-r3);
          border: 1px solid rgba(99,139,246,0.18);
          background: #f8fafc;
          font-size: 13px;
          color: var(--pf-t1);
          font-family: var(--pf-fb);
          cursor: pointer;
          outline: none;
          transition: border-color .15s;
        }
        .pf-select:focus { border-color: var(--pf-b); background: #fff; }
        .pf-select-chevron {
          position: absolute;
          right: 10px; top: 50%; transform: translateY(-50%);
          color: var(--pf-t3);
          pointer-events: none;
          display: flex;
        }

        .pf-add-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 10px 14px;
          border-radius: var(--pf-r3);
          border: 1px solid rgba(79,142,245,0.20);
          background: #eff6ff;
          color: var(--pf-b);
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          font-family: var(--pf-fb);
          white-space: nowrap;
          transition: all .16s;
          flex-shrink: 0;
        }
        .pf-add-btn:hover {
          background: var(--pf-b);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 14px rgba(79,142,245,0.28);
        }

        /* ── DIPLOME ─── */
        .pf-diplome-box {
          margin: 20px;
          border-radius: var(--pf-r1);
          background: linear-gradient(135deg, #f8fafc, #f0f5ff);
          border: 1px dashed rgba(99,139,246,0.22);
          min-height: 200px;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          cursor: pointer;
          transition: border-color .18s;
        }
        .pf-diplome-box:hover { border-color: rgba(79,142,245,0.4); }
        .pf-diplome-img {
          width: 100%;
          max-height: 300px;
          object-fit: contain;
          border-radius: var(--pf-r2);
          display: block;
        }
        .pf-diplome-overlay {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 8px;
          background: rgba(15,23,42,0.55);
          color: #fff; font-size: 12px; font-weight: 600;
          opacity: 0; transition: opacity .18s;
          border-radius: var(--pf-r1);
        }
        .pf-diplome-box:hover .pf-diplome-overlay { opacity: 1; }
        .pf-diplome-empty {
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          color: var(--pf-t3); text-align: center; padding: 32px;
        }
        .pf-diplome-empty svg { width: 32px; height: 32px; opacity: .35; }
        .pf-diplome-empty span { font-size: 13px; font-weight: 600; color: var(--pf-t2); }
        .pf-diplome-empty p { font-size: 11.5px; color: var(--pf-t3); line-height: 1.5; }

        /* ── MODALS ─── */
        .pf-modal-bg {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(7,16,31,0.80);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
        }
        .pf-modal-inner {
          position: relative;
          background: #fff;
          border-radius: 18px;
          padding: 8px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.5);
          max-width: 540px;
          width: 90%;
        }
        .pf-modal-close {
          position: absolute;
          top: -14px; right: -14px;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #1e293b;
          color: #fff;
          border: 2px solid #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: background .15s;
        }
        .pf-modal-close:hover { background: var(--pf-re); }
        .pf-modal-img {
          width: 100%;
          border-radius: 12px;
          display: block;
        }

        /* ── DRAWER (overlay + panel) ─── */
        .pf-overlay {
          position: fixed; inset: 0; z-index: 900;
          background: rgba(7,16,31,0.40);
          backdrop-filter: blur(4px);
        }
        .pf-drawer {
          position: fixed;
          right: 0; top: 0; bottom: 0;
          width: 400px;
          background: #ffffff;
          display: flex; flex-direction: column;
          box-shadow: -16px 0 60px rgba(0,0,0,0.18);
          border-left: 1px solid var(--pf-border);
        }
        @media (max-width: 480px) {
          .pf-drawer { width: 100%; }
        }

        .pf-drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 22px;
          border-bottom: 1px solid rgba(99,139,246,0.09);
          background: linear-gradient(90deg, rgba(79,142,245,0.03), rgba(158,123,245,0.02));
          flex-shrink: 0;
        }
        .pf-drawer-title {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--pf-ff);
          font-size: 16px; font-weight: 600;
          color: var(--pf-t0);
        }
        .pf-drawer-title-ico {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(79,142,245,0.12), rgba(158,123,245,0.10));
          color: var(--pf-b);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pf-drawer-close {
          width: 30px; height: 30px;
          border-radius: 8px;
          border: 1px solid rgba(99,139,246,0.12);
          background: #f8fafc;
          color: var(--pf-t2);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all .15s;
        }
        .pf-drawer-close:hover { background: #fff1f2; color: var(--pf-re); border-color: rgba(244,63,94,0.2); }

        .pf-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px 22px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .pf-drawer-body::-webkit-scrollbar { width: 4px; }
        .pf-drawer-body::-webkit-scrollbar-thumb {
          background: rgba(99,139,246,0.18);
          border-radius: 4px;
        }

        .pf-field { display: flex; flex-direction: column; gap: 6px; }
        .pf-field-label {
          font-size: 10.5px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: var(--pf-t3);
        }
        .pf-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: var(--pf-r3);
          border: 1px solid rgba(99,139,246,0.18);
          background: #f8fafc;
          font-size: 13px;
          color: var(--pf-t1);
          font-family: var(--pf-fb);
          outline: none;
          transition: border-color .15s, background .15s;
        }
        .pf-input:focus {
          border-color: var(--pf-b);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(79,142,245,0.10);
        }
        .pf-input-wrap { position: relative; }
        .pf-input-ico {
          position: absolute;
          left: 12px; top: 50%; transform: translateY(-50%);
          color: var(--pf-t3);
          display: flex;
          pointer-events: none;
        }
        .pf-input-has-ico { padding-left: 36px !important; }

        .pf-drawer-footer {
          padding: 16px 22px;
          border-top: 1px solid rgba(99,139,246,0.09);
          display: flex; gap: 10px;
          flex-shrink: 0;
        }
        .pf-btn-ghost {
          flex: 1;
          padding: 11px;
          border-radius: var(--pf-r3);
          border: 1px solid rgba(99,139,246,0.18);
          background: #f8fafc;
          color: var(--pf-t2);
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          font-family: var(--pf-fb);
          transition: all .15s;
        }
        .pf-btn-ghost:hover { background: #f0f5ff; color: var(--pf-b); border-color: rgba(79,142,245,0.25); }

        .pf-btn-primary {
          flex: 2;
          padding: 11px;
          border-radius: var(--pf-r3);
          border: none;
          background: linear-gradient(135deg, var(--pf-b), var(--pf-v));
          color: #fff;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          font-family: var(--pf-fb);
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: opacity .15s, box-shadow .15s;
          box-shadow: 0 4px 16px rgba(79,142,245,0.28);
        }
        .pf-btn-primary:hover:not(:disabled) {
          opacity: .92;
          box-shadow: 0 6px 22px rgba(79,142,245,0.38);
        }
        .pf-btn-primary:disabled {
          opacity: .6;
          cursor: not-allowed;
        }
        .pf-btn-spinner {
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          animation: pf-spin .7s linear infinite;
        }
      `}</style>
    </div>
  );
}
