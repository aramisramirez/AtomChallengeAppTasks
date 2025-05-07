import { Request, Response } from "express";
import { db } from "../firebase";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta"; // Idealmente usa una variable de entorno pero por efecto del challenge lo dejo así.

export const getUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.params;

    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res
        .status(400)
        .json({ exists: false, message: "Usuario no encontrado" });
    }

    const userData = snapshot.docs[0].data();

    const token = jwt.sign(
      { email: userData.email, id: snapshot.docs[0].id },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.json({
      exists: true,
      token,
      user: { id: snapshot.docs[0].id, ...userData },
    });
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  await db.collection("users").add({ email, createdAt: new Date() });
  res.status(201).json({ message: "User created" });
};
