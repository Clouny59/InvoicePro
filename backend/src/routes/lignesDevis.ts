import { Router, Request, Response } from "express";
import pool from "../db/db";
import { authenticateToken, AuthRequest } from "../middleware/authenticateToken";

const router = Router();

// Obtenir toutes les lignes pour un devis
router.get("/:id/lignes", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM lignes_devis WHERE devis_id = ?", [req.params.id]);
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET lignes devis:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Ajouter une ligne à un devis
router.post("/:id/lignes", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { description, quantite, prix_unitaire, tva } = req.body;
    await pool.query(
      `INSERT INTO lignes_devis (devis_id, description, quantite, prix_unitaire, tva)
       VALUES (?, ?, ?, ?, ?)`,
      [req.params.id, description, quantite, prix_unitaire, tva ?? 20]
    );
    res.status(201).json({ message: "Ligne ajoutée" });
  } catch (err) {
    console.error("Erreur POST ligne devis:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer une ligne
router.delete("/lignes/:ligneId", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await pool.query("DELETE FROM lignes_devis WHERE id = ?", [req.params.ligneId]);
    res.json({ message: "Ligne supprimée" });
  } catch (err) {
    console.error("Erreur DELETE ligne devis:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Mettre à jour une ligne
router.put("/lignes/:ligneId", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { description, quantite, prix_unitaire, tva } = req.body;
    await pool.query(
      "UPDATE lignes_devis SET description = ?, quantite = ?, prix_unitaire = ?, tva = ? WHERE id = ?",
      [description, quantite, prix_unitaire, tva, req.params.ligneId]
    );
    res.json({ message: "Ligne mise à jour" });
  } catch (err) {
    console.error("Erreur PUT ligne devis:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
