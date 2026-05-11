import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/logo.jpeg";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const t = searchParams.get("token");
    const e = searchParams.get("email");

    if (!t || !e) {
      setError("Lien invalide");
    } else {
      setToken(t);
      setEmail(e);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation,
      });

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background: #f4f6f9;
        }

        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .card {
          width: 420px;
          background: #ffffff;
          padding: 40px 35px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          text-align: center;
          border-top: 5px solid #1e3a8a;
        }

        .logo {
          width: 80px;
          margin-bottom: 15px;
        }

        .institution {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 10px;
        }

        .title {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 5px;
        }

        .subtitle {
          font-size: 14px;
          color: #475569;
          margin-bottom: 20px;
          word-break: break-all;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .input {
          padding: 14px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          outline: none;
          font-size: 14px;
          transition: 0.2s;
        }

        .input:focus {
          border-color: #1e3a8a;
          box-shadow: 0 0 0 3px rgba(30,58,138,0.1);
        }

        .button {
          margin-top: 10px;
          padding: 14px;
          border-radius: 10px;
          border: none;
          background: #1e3a8a;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .button:hover {
          background: #1e40af;
        }

        .button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .success {
          color: green;
          margin-top: 10px;
          font-size: 14px;
        }

        .error {
          color: red;
          margin-top: 10px;
          font-size: 14px;
        }

        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #94a3b8;
        }
      `}</style>

      <div className="page">
        <div className="card">

          <img src={logo} alt="logo" className="logo" />

          <div className="institution">
            Plateforme officielle des Alumni
          </div>

          <h2 className="title">Réinitialisation</h2>
          <p className="subtitle">
            {email || "Entrez un nouveau mot de passe"}
          </p>

          <form onSubmit={handleSubmit} className="form">

            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />

            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="input"
            />

            <button type="submit" disabled={loading} className="button">
              {loading ? "Traitement..." : "Réinitialiser"}
            </button>

          </form>

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}

          <div className="footer">
            Sécurité et confidentialité assurées
          </div>

        </div>
      </div>
    </>
  );
}