import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import clientsRoutes from "./routes/clients";
import cookieParser from "cookie-parser";
import devisRoutes from "./routes/devis";
import lignesDevisRoutes from "./routes/lignesDevis";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration CORS pour accepter les cookies du frontend
app.use(cors({
  origin: "http://localhost:5173", // adresse du frontend Vite
  credentials: true                // autoriser les cookies (token JWT)
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/devis", devisRoutes);
app.use("/api/devis", lignesDevisRoutes);

app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
