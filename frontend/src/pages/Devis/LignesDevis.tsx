// src/pages/Devis/LignesDevis.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../assets/Devis/LignesDevis.css";

interface Ligne {
  id: number;
  description: string;
  quantite: number;
  prix_unitaire: number;
  tva: number;
  total_ht: number;
  total_ttc: number;
}

const LignesDevis = () => {
  const { id } = useParams();
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [form, setForm] = useState<Partial<Ligne>>({ quantite: 1, tva: 20 });

  const fetchLignes = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/devis/${id}/lignes`,
      {
        withCredentials: true,
      }
    );
    setLignes(res.data);
  };

  useEffect(() => {
    fetchLignes();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post(`http://localhost:5000/api/devis/${id}/lignes`, form, {
      withCredentials: true,
    });
    setForm({ quantite: 1, tva: 20 });
    fetchLignes();
  };

  const handleDelete = async (ligneId: number) => {
    await axios.delete(`http://localhost:5000/api/devis/lignes/${ligneId}`, {
      withCredentials: true,
    });
    fetchLignes();
  };

  return (
    <div className="lignes-container">
      <h2>Lignes du Devis</h2>

      <form className="ligne-form" onSubmit={handleAdd}>
        <input
          name="description"
          placeholder="Description"
          value={form.description || ""}
          onChange={handleChange}
          required
        />
        <input
          name="quantite"
          type="number"
          value={form.quantite || 1}
          onChange={handleChange}
          required
        />
        <input
          name="prix_unitaire"
          type="number"
          value={form.prix_unitaire || ""}
          onChange={handleChange}
          required
        />
        <input
          name="tva"
          type="number"
          value={form.tva || 20}
          onChange={handleChange}
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      <ul className="ligne-list">
        {lignes.map((ligne) => (
          <li key={ligne.id} className="ligne-item">
            <span>
              {ligne.description} — {ligne.quantite} x {ligne.prix_unitaire} € —{" "}
              {ligne.tva}% = {ligne.total_ttc} € TTC
            </span>
            <button
              onClick={() => handleDelete(ligne.id)}
              className="delete-btn"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
      <div className="devis-summary">
        <p>
          <strong>Total HT :</strong>{" "}
          {lignes.reduce((sum, ligne) => sum + ligne.total_ht, 0).toFixed(2)} €
        </p>
        <p>
          <strong>Total TTC :</strong>{" "}
          {lignes.reduce((sum, ligne) => sum + ligne.total_ttc, 0).toFixed(2)} €
        </p>
      </div>
    </div>
  );
};

export default LignesDevis;
