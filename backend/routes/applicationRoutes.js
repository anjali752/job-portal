import express from "express";
import {
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplications,
  postApplication,
  getSingleApplication,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { validateRequest } from "../middlewares/validationMiddleware.js";
import { applicationSchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post("/post", isAuthenticated, validateRequest(applicationSchema), postApplication);
router.get("/employer/getall", isAuthenticated, employerGetAllApplications);
router.get("/jobseeker/getall", isAuthenticated, jobseekerGetAllApplications);
router.get("/:id", isAuthenticated, getSingleApplication);
router.put("/update/:id", isAuthenticated, updateApplicationStatus);
router.delete("/delete/:id", isAuthenticated, jobseekerDeleteApplication);

export default router;
