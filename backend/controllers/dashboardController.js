import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";

export const getSeekerStats = catchAsyncErrors(async (req, res, next) => {
  const { _id } = req.user;
  
  const applications = await Application.find({ "applicantID.user": _id });
  
  const stats = {
    appliedJobs: applications.length,
    interviews: applications.filter(app => app.status === "Interview").length,
    offers: applications.filter(app => app.status === "Offer").length,
    profileViews: req.user.profileViews || 0
  };

  res.status(200).json({
    success: true,
    stats
  });
});

export const getRecruiterStats = catchAsyncErrors(async (req, res, next) => {
  const { _id } = req.user;

  const myJobs = await Job.find({ postedBy: _id });
  const myApplications = await Application.find({ "employerID.user": _id });

  const stats = {
    activeJobs: myJobs.filter(job => !job.expired).length,
    totalApplicants: myApplications.length,
    interviewsScheduled: myApplications.filter(app => app.status === "Interview").length,
    positionsFilled: myApplications.filter(app => app.status === "Accepted").length
  };

  res.status(200).json({
    success: true,
    stats
  });
});

export const getRecentApplications = catchAsyncErrors(async (req, res, next) => {
  const { role, _id } = req.user;
  let query = {};

  if (role === "Job Seeker") {
    query = { "applicantID.user": _id };
  } else {
    query = { "employerID.user": _id };
  }

  const applications = await Application.find(query)
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    applications
  });
});
