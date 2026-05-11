import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

export default function PublicProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const isAdmin = currentUser?.role_id === 1;
  const isOwner = currentUser?.id == id;
  const canEdit = isAdmin || isOwner;

  const loadProfile = async () => {
    try {
      const res = await api.get(`/alumni/user/${id}`);
      setUser(res.data);
    } catch (err) {
      console.log(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const updateProfile = async () => {
    try {
      await api.put(`/alumni/user/${id}`, user);
      setEditMode(false);
      loadProfile();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Chargement...</p>;

  if (!user)
    return <p style={{ textAlign: "center" }}>Profil introuvable</p>;

  const p = user.profile;
  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: Inter, sans-serif;
          background: #f3f6ff;
        }

        .topbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 70px;
          background: linear-gradient(135deg,#1e3a8a,#2563eb);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          z-index: 1000;
        }

        .container {
          max-width: 1050px;
          margin: 120px auto 40px;
          display: flex;
          gap: 22px;
          padding: 0 20px;
          flex-wrap: wrap;
        }

        .card {
          flex: 1;
          min-width: 320px;
          border-radius: 26px;
          overflow: hidden;
          background: white;
          box-shadow: 0 12px 35px rgba(30,58,138,0.10);
        }

        .hero {
          position: relative;
          height: 470px;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          color: white;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.4));
        }

        .hero-content {
          position: relative;
          padding: 26px;
        }

        .avatar {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          background: white;
          color: #1e3a8a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          font-weight: bold;
          margin-bottom: 12px;
        }

        .name {
          font-size: 24px;
          font-weight: 800;
          margin: 0;
        }

        .email {
          font-size: 14px;
          opacity: 0.85;
        }

        .content {
          padding: 32px;
        }

        .section {
          padding: 15px 0;
          border-bottom: 1px solid #eef2ff;
        }

        .label {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
        }

        .value {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
        }

        input {
          width: 100%;
          padding: 10px;
          margin-top: 5px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .btn {
          margin-top: 15px;
          padding: 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          color: white;
        }

        .edit {
          background: #3b82f6;
        }

        .save {
          background: #00d09c;
        }
      `}</style>

      <div className="topbar">
        👤 Profil de {fullName || "Alumni"}
      </div>

      <div className="container">

        {/* LEFT */}
        <div className="card">
          <div
            className="hero"
            style={{
              backgroundImage: p?.photo
                ? `url(http://127.0.0.1:8000/storage/${p.photo})`
                : "linear-gradient(135deg,#1e3a8a,#2563eb)"
            }}
          >
            <div className="overlay"></div>

            <div className="hero-content">
              <div className="avatar">
                {user.first_name?.charAt(0)}
              </div>

              <h2 className="name">{fullName}</h2>
              <p className="email">{user.email}</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="card">
          <div className="content">

            {/* EDIT MODE */}
            {canEdit && editMode ? (
              <>
                <div className="section">
                  <div className="label">Nom</div>
                  <input
                    value={user.first_name || ""}
                    onChange={(e) =>
                      setUser({ ...user, first_name: e.target.value })
                    }
                  />
                </div>

                <div className="section">
                  <div className="label">Email</div>
                  <input
                    value={user.email || ""}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                  />
                </div>

                <div className="section">
                  <div className="label">Poste</div>
                  <input
                    value={p?.job_title || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        profile: {
                          ...p,
                          job_title: e.target.value
                        }
                      })
                    }
                  />
                </div>

                <button className="btn save" onClick={updateProfile}>
                  Sauvegarder
                </button>
              </>
            ) : (
              <>
                {/* VIEW MODE */}
                <div className="section">
                  <div className="label">Année de graduation</div>
                  <div className="value">{p?.graduation_year || "-"}</div>
                </div>

                <div className="section">
                  <div className="label">Niveau</div>
                  <div className="value">{p?.degree_level || "-"}</div>
                </div>

                <div className="section">
                  <div className="label">Statut</div>
                  <div className="value">{p?.status || "-"}</div>
                </div>

                <div className="section">
                  <div className="label">Poste</div>
                  <div className="value">{p?.job_title || "-"}</div>
                </div>

                <div className="section">
                  <div className="label">Promotion</div>
                  <div className="value">{p?.promotion || "-"}</div>
                </div>

                {canEdit && (
                  <button
                    className="btn edit"
                    onClick={() => setEditMode(true)}
                  >
                    Modifier profil
                  </button>
                )}
              </>
            )}

          </div>
        </div>

      </div>
    </>
  );
}