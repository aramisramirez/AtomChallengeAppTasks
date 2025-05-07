import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller";
import { authenticateJWT } from "../middlewares/verifyAuth";

const router = Router();

router.get("/", authenticateJWT, getTasks);
router.post("/", authenticateJWT, createTask);
router.put("/:id", authenticateJWT, updateTask);
router.delete("/:id", authenticateJWT, deleteTask);

export default router;
