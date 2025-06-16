import { Router, Request, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/authenticateToken";
import pool from "../db/db";

const router = Router();

// GET /api/devis — tous les devis de l'entreprise
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const entrepriseId = req.user?.entreprise_id;
    const [rows] = await pool.query("SELECT * FROM devis WHERE entreprise_id = ?", [entrepriseId]);
    res.json(rows);
  } catch (err) {
    console.error("Erreur GET devis:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/devis/:id — un devis avec ses lignes
router.get("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const entrepriseId = req.user?.entreprise_id;

    const [devisRows] = await pool.query(
      "SELECT * FROM devis WHERE id = ? AND entreprise_id = ?",
      [id, entrepriseId]
    );

    if ((devisRows as any[]).length === 0)
      return res.status(404).json({ message: "Devis non trouvé" });

    const devis = (devisRows as any[])[0];

    const [lignes] = await pool.query(
      "SELECT * FROM lignes_devis WHERE devis_id = ?",
      [id]
    );

    res.json({ ...devis, lignes });
  } catch (err) {
    console.error("Erreur GET devis/:id:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// POST /api/devis — créer un devis
router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      numero,
      client_nom,
      client_adresse,
      client_codePostal,
      client_ville,
      date,
      description,
      montant_ht,
      montant_tva,
      montant_ttc
    } = req.body;
    const entrepriseId = req.user?.entreprise_id;

    const [result] = await pool.query(
      `INSERT INTO devis (entreprise_id, numero, client_nom, client_adresse, client_codePostal, client_ville, date, description, montant_ht, montant_tva, montant_ttc)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [entrepriseId, numero, client_nom, client_adresse, client_codePostal, client_ville, date, description, montant_ht, montant_tva, montant_ttc]
    );

    res.status(201).json({ id: (result as any).insertId });
  } catch (err) {
    console.error("Erreur POST devis:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /api/devis/:id/lignes — ajouter des lignes à un devis
router.post("/:id/lignes", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const devisId = req.params.id;
    const lignes = req.body.lignes; // tableau [{ description, quantite, prix_unitaire, tva }]

    for (const ligne of lignes) {
      await pool.query(
        `INSERT INTO lignes_devis (devis_id, description, quantite, prix_unitaire, tva)
         VALUES (?, ?, ?, ?, ?)`,
        [devisId, ligne.description, ligne.quantite, ligne.prix_unitaire, ligne.tva || 0]
      );
    }

    res.status(201).json({ message: "Lignes ajoutées" });
  } catch (err) {
    console.error("Erreur POST lignes_devis:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// DELETE /api/devis/:id — supprimer un devis
router.delete("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const entrepriseId = req.user?.entreprise_id;

    const [check] = await pool.query("SELECT * FROM devis WHERE id = ? AND entreprise_id = ?", [id, entrepriseId]);
    if ((check as any[]).length === 0) return res.status(403).json({ message: "Non autorisé" });

    await pool.query("DELETE FROM devis WHERE id = ?", [id]);

    res.json({ message: "Devis supprimé" });
  } catch (err) {
    console.error("Erreur DELETE devis:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT /api/devis/:id — Modifier un devis
router.put("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { numero, date, client_nom, montant_ht, montant_tva, montant_ttc, description } = req.body;
      const entrepriseId = req.user?.entreprise_id;
  
      const [result] = await pool.query(
        `UPDATE devis SET numero = ?, date = ?, client_nom = ?, montant_ht = ?, montant_tva = ?, montant_ttc = ?, description = ?
         WHERE id = ? AND entreprise_id = ?`,
        [numero, date, client_nom, montant_ht, montant_tva, montant_ttc, description, id, entrepriseId]
      );
  
      res.json({ message: "Devis mis à jour" });
    } catch (error) {
      console.error("Erreur PUT devis:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  

export default router;
