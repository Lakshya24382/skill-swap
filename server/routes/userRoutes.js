import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route (only logged in users can see users)
router.get("/", protect, getAllUsers);

export default router;