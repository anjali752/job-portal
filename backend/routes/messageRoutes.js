import express from "express";
import { sendMessage, getMessages, getChatList } from "../controllers/messageController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", isAuthenticated, sendMessage);
router.get("/all/:participantId", isAuthenticated, getMessages);
router.get("/chats", isAuthenticated, getChatList);

export default router;
