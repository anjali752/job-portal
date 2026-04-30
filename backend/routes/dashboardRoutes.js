import express from "express";
import { 
  getSeekerStats, 
  getRecruiterStats, 
  getRecentApplications 
} from "../controllers/dashboardController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/seeker/stats", isAuthenticated, getSeekerStats);
router.get("/recruiter/stats", isAuthenticated, getRecruiterStats);
router.get("/recent", isAuthenticated, getRecentApplications);

export default router;
