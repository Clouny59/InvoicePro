// src/pages/Clients/GestionClients.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { RiEdit2Line, RiDeleteBin2Fill } from "react-icons/ri";
import "../../assets/Clients/GestionClients.css";

interface Client {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  code_postal: string;
  ville: string;
}

const GestionClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<Partial<Client>>({});
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const fetchClients = async () => {
    const res = await axios.get("http://localhost:5000/api/clients", { withCredentials: true });
    setClients(res.data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await axios.put(`http://localhost:5000/api/clients/${isEditing}`, form, { withCredentials: true });
    } else {
      await axios.post("http://localhost:5000/api/clients", form, { withCredentials: true });
    }
    setForm({});
    setIsEditing(null);
    fetchClients();
  };

  const handleEdit = (client: Client) => {
    setForm(client);
    setIsEditing(client.id);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:5000/api/clients/${id}`, { withCredentials: true });
    fetchClients();
  };

  return (
    <div className="clients-container">
      <h2>Gestion des Clients</h2>
      <form className="clients-form" onSubmit={handleSubmit}>
        <input name="nom" placeholder="Nom" value={form.nom || ""} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email || ""} onChange={handleChange} required />
        <input name="telephone" placeholder="Téléphone" value={form.telephone || ""} onChange={handleChange} required />
        <input name="adresse" placeholder="Adresse" value={form.adresse || ""} onChange={handleChange} />
        <input name="code_postal" placeholder="Code postal" value={form.code_postal || ""} onChange={handleChange} />
        <input name="ville" placeholder="Ville" value={form.ville || ""} onChange={handleChange} />
        <button type="submit">{isEditing ? "Modifier" : "Ajouter"}</button>
      </form>

      <ul className="clients-list">
        {clients.map((client) => (
          <li key={client.id} className="clients-item">
            <span>{client.nom} - {client.email}</span>
            <div className="icon-actions">
              <RiEdit2Line className="edit-btn" onClick={() => handleEdit(client)} />
              <RiDeleteBin2Fill className="delete-btn" onClick={() => handleDelete(client.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionClients;
