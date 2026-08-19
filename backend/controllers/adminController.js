import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { Job } from "../models/jobSchema.js";
import { Application } from "../models/applicationSchema.js";
import { sendToken } from "../utils/jwtToken.js";

// Admin Login using .env credentials
export const adminLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password!", 400));
  }

  // Check against .env credentials
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return next(new ErrorHandler("Invalid Admin Credentials!", 401));
  }

  // Find or Create Admin User in DB to get a valid JWT
  let user = await User.findOne({ email, role: "Admin" });
  if (!user) {
    user = await User.create({
      name: "System Admin",
      email: process.env.ADMIN_EMAIL,
      phone: 9999999999,
      password: process.env.ADMIN_PASSWORD,
      role: "Admin",
    });
  }

  sendToken(user, 200, res, "Admin Logged In Successfully!");
});

// Get all users (Seekers & Recruiters)
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ role: { $ne: "Admin" } });
  res.status(200).json({
    success: true,
    users,
  });
});

// Delete a user
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("User not found!", 404));
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User deleted successfully!",
  });
});

// Get Admin Dashboard Stats
export const getAdminStats = catchAsyncErrors(async (req, res, next) => {
  const totalSeekers = await User.countDocuments({ role: "Job Seeker" });
  const totalEmployers = await User.countDocuments({ role: "Employer" });
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();

  res.status(200).json({
    success: true,
    stats: {
      totalSeekers,
      totalEmployers,
      totalJobs,
      totalApplications,
    },
  });
});

// Get all jobs for management
export const getAllJobsAdmin = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find().populate("postedBy", "name email");
  res.status(200).json({
    success: true,
    jobs,
  });
});
