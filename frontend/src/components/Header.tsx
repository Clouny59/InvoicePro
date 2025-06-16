// src/components/Header.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <h1 className="title">Mon App</h1>
      <nav className="nav">
        {user ? (
          <>
            <span className="username">{user.name}</span>
            <button onClick={handleLogout} className="button">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="link">
              Connexion
            </Link>
            <Link to="/register" className="link">
              Inscription
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
