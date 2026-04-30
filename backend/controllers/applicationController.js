import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }
  
  const { name, email, coverLetter, phone, address, jobId } = req.body;
  
  if (!jobId) {
     return next(new ErrorHandler("Job ID is required!", 400));
  }

  // Check if job exists first
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  // Check if user has already applied
  const existingApplication = await Application.findOne({
    "applicantID.user": req.user._id,
    jobId: jobId,
  });

  if (existingApplication) {
    return next(new ErrorHandler("You have already applied for this job!", 400));
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume File Required!", 400));
  }

  const { resume } = req.files;
  const allowedFormats = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(new ErrorHandler("Invalid file type. Please upload a PDF or Docx file.", 400));
  }

  try {
    // Correctly choose between buffer and temp file path
    // If useTempFiles is true, resume.data is usually an empty buffer with length 0
    const fileBuffer = (resume.data && resume.data.length > 0) 
      ? resume.data 
      : (resume.tempFilePath ? fs.readFileSync(resume.tempFilePath) : null);
    
    if (!fileBuffer || fileBuffer.length === 0) {
      return next(new ErrorHandler("File content is empty. Please try uploading again.", 400));
    }
    
    // Create a promise-based wrapper for upload_stream
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto", // Use auto to allow Cloudinary to detect PDFs for browser viewing
            folder: "resumes",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    };

    const cloudinaryResponse = await uploadToCloudinary();

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary Error Detail:", cloudinaryResponse?.error || "Unknown Cloudinary error");
      return next(new ErrorHandler(`Failed to upload Resume: ${cloudinaryResponse?.error?.message || "Service Busy"}`, 500));
    }

    const applicantID = { user: req.user._id, role: "Job Seeker" };
    const employerID = { user: jobDetails.postedBy, role: "Employer" };

    if (!name || !email || !coverLetter || !phone || !address) {
      return next(new ErrorHandler("Please fill all fields.", 400));
    }

    const application = await Application.create({
      name, email, coverLetter, phone, address, applicantID, employerID, jobId,
      resume: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: "Application Submitted!",
      application,
    });
  } catch (error) {
    console.error("CRITICAL APPLICATION ERROR:", error);
    return next(new ErrorHandler(`Processing Error: ${error.message || "Internal server error"}`, 500));
  }
});

export const getSingleApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const application = await Application.findById(id).populate("jobId");
  if (!application) {
    return next(new ErrorHandler("Application not found!", 404));
  }
  res.status(200).json({
    success: true,
    application,
  });
});

export const updateApplicationStatus = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role !== "Employer") {
    return next(new ErrorHandler("Recruiters only allowed to update status.", 400));
  }
  const { id } = req.params;
  const { status } = req.body;
  
  let application = await Application.findById(id);
  if (!application) {
    return next(new ErrorHandler("Application not found!", 404));
  }
  
  application.status = status;
  await application.save();
  
  res.status(200).json({
    success: true,
    message: `Application ${status}!`,
    application
  });
});

export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id }).populate("jobId");
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id }).populate("jobId");
    res.status(200).json({
      success: true,
      applications,
    });
  }
);


export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }

    // Ownership Validation: Ensure only the applicant can delete their own application
    if (application.applicantID.user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You are not authorized to delete this application.", 403));
    }

    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);


