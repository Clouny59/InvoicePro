// src/pages/Dashboard.tsx
import { useAuth } from "../context/AuthContext";
import "../assets/Dashboard.css";
import { Link } from "react-router-dom";
import { FaFileInvoiceDollar } from "react-icons/fa";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <h2>Bienvenue {user?.name} !</h2>
      <div className="dashboard">
        <p>Email : {user?.email}</p>
        <p>
          ID Entreprise :{" "}
          {(user as { role?: string })?.role === "admin"
            ? "Admin"
            : user?.entreprise_id}
        </p>

        {(user as { role?: string })?.role === "admin" && (
          <nav className="dashboard-nav">
            <h3>Navigation admin :</h3>
            <ul>
              <li>
                <Link to="/gestion-clients">Gestion des clients</Link>
              </li>
              <li>
                <Link to="/liste-devis">
                  📄 Liste des devis
                </Link>
              </li>
              <li>
                <Link to="/devis">
                  <FaFileInvoiceDollar style={{ marginRight: "0.5rem" }} />
                  Gestion des devis
                </Link>
              </li>
            </ul>
          </nav>
        )}

        <button onClick={logout}>Se déconnecter</button>
      </div>
    </div>
  );
};

export default Dashboard;
