import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/db";
import { authenticateToken, AuthRequest } from "../middleware/authenticateToken";

const router = Router();

// GET /api/auth/me — retourne les infos de l'utilisateur connecté
router.get("/me", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur." });
  }
});

// POST /api/auth/login — connexion utilisateur
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = (rows as any[])[0];

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const tokenPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        entreprise_id: user.entreprise_id,
      };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: "1d" });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // true si HTTPS
        sameSite: "lax",
        maxAge: 86400000, // 1 jour
      })
      .json(tokenPayload);
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /api/auth/register — inscription
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name, entreprise_id } = req.body;

    const [exists] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if ((exists as any[]).length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, entreprise_id) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, entreprise_id || null]
    );

    res.status(201).json({ message: "Utilisateur créé avec succès", userId: (result as any).insertId });
  } catch (error) {
    console.error("Erreur register:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /api/auth/logout — déconnexion
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // true si HTTPS
    sameSite: "lax",
  });
  res.json({ message: "Déconnecté avec succès" });
});

export default router;
