// src/pages/Devis/AfficherDevis.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../assets/Devis/AfficherDevis.css";

interface Devis {
  id: number;
  numero: string;
  date: string;
  client_nom: string;
  client_adresse?: string;
  client_code_postal?: string;
  client_ville?: string;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  description?: string;
}

interface LigneDevis {
  id: number;
  description: string;
  quantite: number;
  prix_unitaire: number;
  tva: number;
  total_ht: number;
  total_ttc: number;
}

const AfficherDevis = () => {
  const { id } = useParams<{ id: string }>();
  const [devis, setDevis] = useState<Devis | null>(null);
  const [lignes, setLignes] = useState<LigneDevis[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevis = async () => {
      const res = await axios.get(`http://localhost:5000/api/devis/${id}`, { withCredentials: true });
      setDevis(res.data);
    };
    const fetchLignes = async () => {
      const res = await axios.get(`http://localhost:5000/api/devis/${id}/lignes`, { withCredentials: true });
      setLignes(res.data);
    };
    fetchDevis();
    fetchLignes();
  }, [id]);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("fr-FR");

  if (!devis) return <div>Chargement...</div>;

  return (
    <div className="devis-details">
      <h2>Devis n° {devis.numero}</h2>
      <p><strong>Date:</strong> {formatDate(devis.date)}</p>
      <p><strong>Client:</strong> {devis.client_nom}</p>
      {devis.client_adresse && (
        <p><strong>Adresse:</strong> {devis.client_adresse}, {devis.client_code_postal} {devis.client_ville}</p>
      )}
      <p><strong>Description:</strong> {devis.description}</p>

      <h3>Lignes du devis</h3>
      <table className="devis-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantité</th>
            <th>Prix Unit.</th>
            <th>TVA</th>
            <th>Total HT</th>
            <th>Total TTC</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne) => (
            <tr key={ligne.id}>
              <td>{ligne.description}</td>
              <td>{ligne.quantite}</td>
              <td>{ligne.prix_unitaire} €</td>
              <td>{ligne.tva} %</td>
              <td>{ligne.total_ht.toFixed(2)} €</td>
              <td>{ligne.total_ttc.toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="totaux">
        <p><strong>Total HT:</strong> {devis.montant_ht.toFixed(2)} €</p>
        <p><strong>TVA:</strong> {devis.montant_tva.toFixed(2)} €</p>
        <p><strong>Total TTC:</strong> {devis.montant_ttc.toFixed(2)} €</p>
      </div>

      <button onClick={() => navigate("/devis")} className="retour-btn">Retour</button>
    </div>
  );
};

export default AfficherDevis;
