import express from "express";
import { 
  login, 
  register, 
  logout, 
  getUser, 
  searchCandidates, 
  updateProfile,
  saveJob,
  unsaveJob,
  getSavedJobs
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { registerSchema, loginSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.get("/logout", logout);
router.get("/getuser", isAuthenticated, getUser);
router.get("/search", isAuthenticated, searchCandidates);
router.put("/update/profile", isAuthenticated, updateProfile);
router.post("/save/job", isAuthenticated, saveJob);
router.delete("/unsave/job/:jobId", isAuthenticated, unsaveJob);
router.get("/saved/jobs", isAuthenticated, getSavedJobs);

export default router;
