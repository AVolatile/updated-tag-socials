import express from "express";
import { login, register } from "../controllers/auth.js"; // ⬅️ Make sure register is imported

const router = express.Router();

router.post("/login", login);
router.post("/register", register); // 

export default router;
