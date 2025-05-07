import { Router } from "express";
import { createUser, getUser } from "../controllers/user.controller";
import { checkIfUserExists } from "../middlewares/verifyEmail";

const router = Router();

router.get("/:email", getUser);
router.post("/", checkIfUserExists, createUser);

export default router;
