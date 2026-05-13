import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/logo.jpeg";

export default function SetPassword() {
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get("token");
  const email = params.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    if (!token || !email) {
      setError("Lien invalide ou expiré");
      setLoading(false);
      return;
    }

    if (password !== password_confirmation) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      await api.post("/set-password", {
        token,
        email,
        password,
        password_confirmation
      });

      setMessage("Mot de passe défini avec succès !");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création du mot de passe");
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
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
          width: 100%;
          max-width: 480px;
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

        .title {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
        }

        .subtitle {
          font-size: 14px;
          color: #475569;
          margin-bottom: 25px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .input {
          padding: 15px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          font-size: 16px;
          background: #f8fafc;
        }

        .input:focus {
          border-color: #1e3a8a;
          outline: none;
        }

        .button {
          padding: 15px;
          border-radius: 10px;
          border: none;
          background: #1e3a8a;
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        .error {
          color: red;
          margin-top: 10px;
        }

        .success {
          color: green;
          margin-top: 10px;
        }
      `}</style>

      <div className="page">
        <div className="card">

          <img src={logo} alt="logo" className="logo" />

          <h2 className="title">Définir le mot de passe</h2>
          <p className="subtitle">Créez votre mot de passe sécurisé</p>

          <form className="form" onSubmit={handleSubmit}>

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
              placeholder="Confirmer mot de passe"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              className="input"
            />

            <button type="submit" disabled={loading} className="button">
              {loading ? "En cours..." : "Valider"}
            </button>

          </form>

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

        </div>
      </div>
    </>
  );
}