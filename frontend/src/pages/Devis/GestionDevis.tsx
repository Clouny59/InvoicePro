// src/pages/Devis/GestionDevis.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../assets/Devis/GestionDevis.css";

interface LigneDevis {
  id: number;
  description: string;
  quantite: number;
  prix_unitaire: number;
  tva: number;
  total_ht: number;
  total_ttc: number;
}

interface Devis {
  id: number;
  numero: string;
  date: string;
  client_nom: string;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  description: string;
  lignes: LigneDevis[];
}

const GestionDevis = () => {
  const { id } = useParams();
  const [devis, setDevis] = useState<Devis | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchDevis = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/devis/${id}`, { withCredentials: true });
      const data = res.data;

      if (data.devis && data.lignes) {
        setDevis({ ...data.devis, lignes: data.lignes });
      } else {
        setDevis(data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement du devis:", err);
      setMessage("❌ Erreur lors du chargement du devis.");
    }
  };

  useEffect(() => {
    fetchDevis();
  }, [id]);

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return isNaN(date.getTime()) ? "Date invalide" : date.toLocaleDateString("fr-FR");
  };

  const handleInputChange = (index: number, field: keyof LigneDevis, value: string | number) => {
    if (!devis) return;
    const updatedLignes = devis.lignes.map((ligne, i) =>
      i === index ? {
        ...ligne,
        [field]: field === "description" ? value : parseFloat(value as string) || 0,
        total_ht: field === "quantite" || field === "prix_unitaire"
          ? parseFloat(((field === "quantite" ? +value : ligne.quantite) * (field === "prix_unitaire" ? +value : ligne.prix_unitaire)).toFixed(2))
          : ligne.total_ht,
        total_ttc: field === "tva" || field === "quantite" || field === "prix_unitaire"
          ? parseFloat((((field === "quantite" ? +value : ligne.quantite) * (field === "prix_unitaire" ? +value : ligne.prix_unitaire)) * (1 + (field === "tva" ? +value : ligne.tva) / 100)).toFixed(2))
          : ligne.total_ttc,
      } : ligne
    );
    setDevis({ ...devis, lignes: updatedLignes });
  };

  const totalFinalHT = devis?.lignes.reduce((acc, l) => acc + l.total_ht, 0) || 0;
  const totalFinalTTC = devis?.lignes.reduce((acc, l) => acc + l.total_ttc, 0) || 0;

  return (
    <div className="gestion-devis-container">
      <h2>Détail du Devis</h2>

      {message && <div className="form-message">{message}</div>}

      {devis ? (
        <div className="devis-detail">
          <p><strong>Numéro :</strong> {devis.numero}</p>
          <p><strong>Date :</strong> {formatDate(devis.date)}</p>
          <p><strong>Client :</strong> {devis.client_nom}</p>
          <p><strong>Description :</strong> {devis.description}</p>

          <h3>Lignes de devis :</h3>
          <table className="lignes-devis-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix Unitaire</th>
                <th>TVA</th>
                <th>Total HT</th>
                <th>Total TTC</th>
              </tr>
            </thead>
            <tbody>
              {devis.lignes.map((ligne, index) => (
                <tr key={ligne.id}>
                  <td>
                    <input
                      type="text"
                      value={ligne.description}
                      onChange={(e) => handleInputChange(index, "description", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={ligne.quantite}
                      onChange={(e) => handleInputChange(index, "quantite", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={ligne.prix_unitaire}
                      onChange={(e) => handleInputChange(index, "prix_unitaire", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={ligne.tva}
                      onChange={(e) => handleInputChange(index, "tva", e.target.value)}
                    />
                  </td>
                  <td>{(ligne.total_ht || 0).toFixed(2)} €</td>
                  <td>{(ligne.total_ttc || 0).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="totaux-devis">
            <p><strong>Total HT :</strong> {totalFinalHT.toFixed(2)} €</p>
            <p><strong>Total TTC :</strong> {totalFinalTTC.toFixed(2)} €</p>
          </div>
        </div>
      ) : (
        <p>Chargement du devis...</p>
      )}
    </div>
  );
};

export default GestionDevis;
