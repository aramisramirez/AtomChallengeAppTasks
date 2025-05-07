import { Request, Response } from "express";
import { db } from "../firebase";

// Obtener las tareas

export const getTasks = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const email = req.query.email as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const title = req.query.title as string;

    if (!email) {
      return res.status(400).json({ message: "Falta el parámetro 'email'" });
    }

    let query: FirebaseFirestore.Query = db
      .collection("tasks")
      .where("userEmail", "==", email);

    if (startDate) {
      query = query.where("createdAt", ">=", new Date(startDate));
    }

    if (endDate) {
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      query = query.where("createdAt", "<=", endDateObj);
    }

    const snapshot = await query.get();

    let tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (title) {
      const normalizedTitle = title.toLowerCase();
      tasks = tasks.filter((task: any) =>
        task.title?.toLowerCase().includes(normalizedTitle)
      );
    }

    return res.json(tasks);
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Crear una nueva tarea

export const createTask = async (req: Request, res: Response) => {
  const { userEmail, title, description, completed } = req.body;
  console.log("Creando tarea...");

  try {
    const currentDate = new Date(); // Alternativa a admin.firestore.Timestamp.now()

    await db.collection("tasks").add({
      userEmail,
      title,
      description,
      completed,
      createdAt: currentDate,
    });

    res.status(201).json({ message: "Task created" });
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    res.status(500).json({ message: "Error creando la tarea" });
  }
};

// Actualizar una tarea existente
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.collection("tasks").doc(id).update(req.body);
  res.sendStatus(204);
};

// Eliminar una tarea
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.collection("tasks").doc(id).delete();
  res.sendStatus(204);
};
