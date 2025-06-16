// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
    <nav style={styles.nav}>
      <h3 style={styles.title}>🧾 Mon App Devis</h3>
      <div style={styles.links}>
        {user ? (
          <>
            <span>Bienvenue, {user.name}</span>
            <button onClick={handleLogout} style={styles.button}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Inscription</Link>
          </>
        )}
      </div>
    </nav>
  </>);
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "var(--primary)",
    color: "white",
    maxWidth: "1280px",
    width: "100%",
  },
  title: {
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  button: {
    backgroundColor: "white",
    color: "var(--primary)",
    border: "none",
    borderRadius: "var(--radius)",
    cursor: "pointer",
  },
};

export default Navbar;
