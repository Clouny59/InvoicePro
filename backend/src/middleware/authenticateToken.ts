import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Type étendu pour inclure les infos utilisateur dans req
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
    role: string;
    entreprise_id?: number;
  };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }

    req.user = decoded;
    next();
  });
}
