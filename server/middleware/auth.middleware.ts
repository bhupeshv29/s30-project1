import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function Authmiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "token missing" });
    }

    const token = authHeader.startsWith("Bearer ")? authHeader.split(" ")[1]:authHeader;

    if (!JWT_SECRET) {
      return res.status(500).json({ message: "server misconfigured" });
    }

    const decoded = jwt.verify(token!, JWT_SECRET);
    req.userId = typeof decoded === "string" ? decoded : String((decoded as any).id);

    return next();
  } catch (error) {
    return res.status(401).json({ message: "invalid or expired token" });
  }
}
