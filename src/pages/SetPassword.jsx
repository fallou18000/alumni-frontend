import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!token || !email) {
      setError("Lien invalide");
      return;
    }

    if (password !== password_confirmation) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      await api.post("/set-password", {
        token,
        email,
        password,
        password_confirmation,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 100 }}>
      <h2>Définir mot de passe</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Confirmer"
          value={password_confirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />

        <br /><br />

        <button disabled={loading}>
          {loading ? "Chargement..." : "Valider"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}