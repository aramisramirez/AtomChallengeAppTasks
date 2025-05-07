import { Request, Response, NextFunction } from "express";
import { db } from "../firebase";

export const checkIfUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      return void res.status(400).json({ message: "El email es requerido" });
    }

    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!snapshot.empty) {
      return void res.status(409).json({ message: "El usuario ya existe" });
    }

    return next();
  } catch (error) {
    console.error("Error en checkIfUserExists:", error);
    return void res.status(500).json({ message: "Error interno del servidor" });
  }
};
