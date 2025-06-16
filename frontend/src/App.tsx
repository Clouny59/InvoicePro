import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GestionClients from "./pages/Clients/GestionClients";
import Header from "./components/Header";
import RequireAuth from "./context/RequireAuth";
import RequireAdmin from "./context/RequireAdmin";
import GestionDevis from "./pages/Devis/GestionDevis";
import Dashboard from "./pages/Dashboard"; // ✅ le bon Dashboard
import LignesDevis from "./pages/Devis/LignesDevis";
import ListeDevis from "./pages/Devis/ListeDevis";
import "./assets/global.css";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="main">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/devis/:id"
              element={
                <RequireAuth>
                  <GestionDevis />
                </RequireAuth>
              }
            />
            <Route
              path="/devis"
              element={
                <RequireAuth>
                  <GestionDevis />
                </RequireAuth>
              }
            />
            <Route
              path="/gestion-clients"
              element={
                <RequireAdmin>
                  <GestionClients />
                </RequireAdmin>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
  path="/liste-devis"
  element={
    <RequireAuth>
      <ListeDevis />
    </RequireAuth>
  }
/>
            <Route
              path="/devis/:id/lignes"
              element={
                <RequireAuth>
                  <LignesDevis />
                </RequireAuth>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
