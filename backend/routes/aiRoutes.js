import express from "express";
import { chatBotController, analyzeResumeController, matchSkillController } from "../controllers/aiController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/chat", isAuthenticated, chatBotController);
router.post("/analyze", isAuthenticated, analyzeResumeController);
router.post("/match", isAuthenticated, matchSkillController);

export default router;
