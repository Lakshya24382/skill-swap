import express from "express";
import {
  createSwap,
  getMySwaps,
  updateSwapStatus,
} from "../controllers/swapController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSwap);
router.get("/", protect, getMySwaps);
router.put("/:id", protect, updateSwapStatus);


export default router;