// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [entrepriseId, setEntrepriseId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        entreprise_id: entrepriseId || null,
      });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur d'inscription");
    }
  };

  return (
    <div className="register-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="number" placeholder="ID entreprise (optionnel)" value={entrepriseId} onChange={(e) => setEntrepriseId(e.target.value)} />
        <button type="submit">Créer un compte</button>
        {error && <p className="register-error">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
