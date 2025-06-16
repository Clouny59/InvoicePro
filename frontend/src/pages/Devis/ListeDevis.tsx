// src/pages/Devis/ListeDevis.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../assets/Devis/ListeDevis.css";

interface Devis {
  id: number;
  numero: string;
  date: string;
  client_nom: string;
  montant_ttc: number;
}

const ListeDevis = () => {
  const [devisList, setDevisList] = useState<Devis[]>([]);
  const navigate = useNavigate();

  const fetchDevis = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/devis", { withCredentials: true });
      setDevisList(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des devis:", err);
    }
  };

  useEffect(() => {
    fetchDevis();
  }, []);

  const handleGestion = (id: number) => {
    navigate(`/devis/${id}`);
  };

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <div className="liste-devis-container">
      <h2>Liste des Devis</h2>
      <ul className="devis-list">
        {devisList.map((devis) => (
          <li key={devis.id} className="devis-item">
            <span>
              {devis.numero} — {devis.client_nom} — {formatDate(devis.date)} — {devis.montant_ttc} €
            </span>
            <button onClick={() => handleGestion(devis.id)} className="gestion-btn">
              Gérer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListeDevis;
