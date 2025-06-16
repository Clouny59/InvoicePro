// src/pages/Devis/AjouterLignes.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Ligne {
  id?: number;
  description: string;
  quantite: number;
  prix_unitaire: number;
  tva: number;
  total_ht?: number;
  total_ttc?: number;
}

const AjouterLignes = () => {
  const { id } = useParams(); // id du devis
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [nouvelleLigne, setNouvelleLigne] = useState<Ligne>({
    description: "",
    quantite: 1,
    prix_unitaire: 0,
    tva: 20,
  });

  useEffect(() => {
    axios.get(`/api/devis/${id}/lignes`, { withCredentials: true })
      .then(res => setLignes(res.data));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNouvelleLigne({ ...nouvelleLigne, [e.target.name]: e.target.value });
  };

  const ajouterLigne = async () => {
    await axios.post(`/api/devis/${id}/lignes`, nouvelleLigne, { withCredentials: true });
    const res = await axios.get(`/api/devis/${id}/lignes`, { withCredentials: true });
    setLignes(res.data);
    setNouvelleLigne({ description: "", quantite: 1, prix_unitaire: 0, tva: 20 });
  };

  const supprimerLigne = async (ligneId: number) => {
    await axios.delete(`/api/devis/lignes/${ligneId}`, { withCredentials: true });
    setLignes(lignes.filter(l => l.id !== ligneId));
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Lignes du devis #{id}</h2>

      <div style={{ marginBottom: 20 }}>
        <input name="description" placeholder="Description" value={nouvelleLigne.description} onChange={handleChange} />
        <input name="quantite" type="number" value={nouvelleLigne.quantite} onChange={handleChange} />
        <input name="prix_unitaire" type="number" value={nouvelleLigne.prix_unitaire} onChange={handleChange} />
        <input name="tva" type="number" value={nouvelleLigne.tva} onChange={handleChange} />
        <button onClick={ajouterLigne}>Ajouter</button>
      </div>

      <ul>
        {lignes.map(l => (
          <li key={l.id}>
            {l.description} — {l.quantite} x {l.prix_unitaire}€ — TVA: {l.tva}% — TTC: {l.total_ttc?.toFixed(2)}€
            <button onClick={() => supprimerLigne(l.id!)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AjouterLignes;
