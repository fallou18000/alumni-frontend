import { useState } from "react";
import api from "../services/api";
import logo from "../assets/logo.jpeg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/forgot-password", { email });
      setMessage(res.data.message || "Email envoyé !");
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de l'envoi"
      );
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
          margin-bottom: 25px;
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

          <h2 className="title">Mot de passe oublié</h2>
          <p className="subtitle">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>

          <form onSubmit={handleSubmit} className="form">

            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />

            <button type="submit" disabled={loading} className="button">
              {loading ? "Traitement..." : "Envoyer le lien"}
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