// src/routes/clients.ts
import { Router, Request, Response } from "express";
import pool from "../db/db";
import { authenticateToken, AuthRequest } from "../middleware/authenticateToken";

const router = Router();

// GET /api/clients — Liste des clients de l’entreprise connectée
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const entrepriseId = req.user?.entreprise_id;
    if (!entrepriseId) {
      return res.status(403).json({ message: "Entreprise non définie." });
    }

    const [rows] = await pool.query("SELECT * FROM clients WHERE entreprise_id = ?", [entrepriseId]);
    res.json(rows);
  } catch (error) {
    console.error("Erreur GET clients:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /api/clients — Ajouter un client
router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const entrepriseId = req.user?.entreprise_id;
    if (!entrepriseId) {
      return res.status(403).json({ message: "Entreprise non définie." });
    }

    const { nom, email, telephone, adresse, code_postal, ville } = req.body;

    const [result] = await pool.query(
      `INSERT INTO clients (entreprise_id, nom, email, telephone, adresse, code_postal, ville)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [entrepriseId, nom, email, telephone, adresse, code_postal, ville]
    );

    res.status(201).json({ message: "Client ajouté", clientId: (result as any).insertId });
  } catch (error) {
    console.error("Erreur POST client:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT /api/clients/:id — Modifier un client
router.put("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const entrepriseId = req.user?.entreprise_id;
    if (!entrepriseId) {
      return res.status(403).json({ message: "Entreprise non définie." });
    }

    const { id } = req.params;
    const { nom, email, telephone, adresse, code_postal, ville } = req.body;

    await pool.query(
      `UPDATE clients
       SET nom = ?, email = ?, telephone = ?, adresse = ?, code_postal = ?, ville = ?
       WHERE id = ? AND entreprise_id = ?`,
      [nom, email, telephone, adresse, code_postal, ville, id, entrepriseId]
    );

    res.json({ message: "Client mis à jour" });
  } catch (error) {
    console.error("Erreur PUT client:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /api/clients/:id — Supprimer un client
router.delete("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const entrepriseId = req.user?.entreprise_id;
    if (!entrepriseId) {
      return res.status(403).json({ message: "Entreprise non définie." });
    }

    const { id } = req.params;

    await pool.query("DELETE FROM clients WHERE id = ? AND entreprise_id = ?", [id, entrepriseId]);

    res.json({ message: "Client supprimé" });
  } catch (error) {
    console.error("Erreur DELETE client:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
