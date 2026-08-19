import express from "express";
import { 
  adminLogin, 
  getAllUsers, 
  deleteUser, 
  getAdminStats, 
  getAllJobsAdmin 
} from "../controllers/adminController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Middleware to check if user is Admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
};

router.post("/login", adminLogin);
router.get("/users", isAuthenticated, isAdmin, getAllUsers);
router.delete("/user/delete/:id", isAuthenticated, isAdmin, deleteUser);
router.get("/stats", isAuthenticated, isAdmin, getAdminStats);
router.get("/jobs", isAuthenticated, isAdmin, getAllJobsAdmin);

export default router;
