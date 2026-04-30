import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import mongoose from "mongoose";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form !"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered !"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });
  sendToken(user, 201, res, "User Registered Sucessfully !");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email ,password and role !"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password !", 400));
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found !`, 404)
    );
  }
  sendToken(user, 201, res, "User Logged In Sucessfully !");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged Out Successfully !",
    });
});


import cloudinary from "cloudinary";

export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  // Sanitize user data to remove sensitive fields
  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    companyName: user.companyName,
    companyWebsite: user.companyWebsite,
    jobTitle: user.jobTitle,
    linkedInProfile: user.linkedInProfile,
    bio: user.bio,
    address: user.address,
    isVerified: user.isVerified,
    profileViews: user.profileViews,
    avatar: user.avatar,
    skills: user.skills,
    professionalSummary: user.professionalSummary,
    education: user.education,
    experience: user.experience,
    portfolioUrl: user.portfolioUrl,
    githubProfile: user.githubProfile,
  };

  res.status(200).json({
    success: true,
    user: sanitizedUser,
  });
});

export const searchCandidates = catchAsyncErrors(async (req, res, next) => {
  const { query, location } = req.query;
  const searchFilter = {
    role: "Job Seeker",
  };

  if (query) {
    const isObjectId = mongoose.Types.ObjectId.isValid(query);
    searchFilter.$or = [
      { name: { $regex: query, $options: "i" } },
      { jobTitle: { $regex: query, $options: "i" } },
      { address: { $regex: query, $options: "i" } },
      { skills: { $in: [new RegExp(query, "i")] } },
      { professionalSummary: { $regex: query, $options: "i" } },
    ];
    if (isObjectId) {
      searchFilter.$or.push({ _id: query });
    }
  }

  if (location) {
    searchFilter.address = { $regex: location, $options: "i" };
  }

  const candidates = await User.find(searchFilter)
    .select("name email phone jobTitle bio address avatar skills professionalSummary education experience portfolioUrl githubProfile")
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json({
    success: true,
    candidates,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  // Domain Validation for Employers
  if (req.user.role === "Employer" && req.body.officialCompanyEmail) {
    const publicDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com"];
    const emailDomain = req.body.officialCompanyEmail.split("@")[1]?.toLowerCase();
    
    if (publicDomains.includes(emailDomain)) {
      return next(new ErrorHandler("Public email domains (Gmail, Yahoo, etc.) are not allowed for official company email.", 400));
    }

    if (req.body.companyWebsite) {
      const websiteUrl = new URL(req.body.companyWebsite.startsWith('http') ? req.body.companyWebsite : `http://${req.body.companyWebsite}`);
      const websiteDomain = websiteUrl.hostname.replace("www.", "").toLowerCase();
      if (!emailDomain.includes(websiteDomain) && !websiteDomain.includes(emailDomain)) {
         return next(new ErrorHandler("Official company email domain must match the company website domain.", 400));
      }
    }
  }

  const newUserData = {
    name: req.body.name || user.name,
    email: req.body.email || user.email,
    phone: req.body.phone || user.phone,
    companyName: req.body.companyName || user.companyName,
    companyLegalName: req.body.companyLegalName,
    companyRegistrationNumber_CIN: req.body.companyRegistrationNumber_CIN,
    gstNumber: req.body.gstNumber,
    companyWebsite: req.body.companyWebsite,
    officialCompanyEmail: req.body.officialCompanyEmail,
    industryType: req.body.industryType,
    companySize: req.body.companySize,
    yearOfEstablishment: req.body.yearOfEstablishment,
    officeAddress: req.body.officeAddress ? (typeof req.body.officeAddress === 'string' ? JSON.parse(req.body.officeAddress) : req.body.officeAddress) : user.officeAddress,
    jobTitle: req.body.jobTitle,
    linkedInProfile: req.body.linkedInProfile,
    bio: req.body.bio,
    address: req.body.address,
    recruiterFullName: req.body.recruiterFullName,
    recruiterWorkEmail: req.body.recruiterWorkEmail,
    recruiterPhoneNumber: req.body.recruiterPhoneNumber,
    recruiterLinkedInURL: req.body.recruiterLinkedInURL,
    skills: req.body.skills ? (typeof req.body.skills === 'string' ? JSON.parse(req.body.skills) : req.body.skills) : user.skills,
    professionalSummary: req.body.professionalSummary,
    education: req.body.education ? (typeof req.body.education === 'string' ? JSON.parse(req.body.education) : req.body.education) : user.education,
    experience: req.body.experience ? (typeof req.body.experience === 'string' ? JSON.parse(req.body.experience) : req.body.experience) : user.experience,
    portfolioUrl: req.body.portfolioUrl,
    githubProfile: req.body.githubProfile,
  };

  // Handle Multi-Document Uploads for Employers
  const documentFields = ["companyRegistrationCertificate", "gstCertificate", "officeAddressProof", "recruiterIdProof"];
  if (req.files) {
    newUserData.documents = user.documents || {};
    
    for (const field of documentFields) {
      if (req.files[field]) {
        const file = req.files[field];
        // Delete old document if exists
        if (user.documents && user.documents[field] && user.documents[field].public_id) {
          await cloudinary.v2.uploader.destroy(user.documents[field].public_id);
        }
        // Upload new document
        const myCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
          folder: "company_documents",
        });
        newUserData.documents[field] = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    }
  }

  if (req.files && req.files.avatar) {
    const file = req.files.avatar;

    // If user already has an avatar, delete it from Cloudinary
    if (user.avatar && user.avatar.public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }

    // Upload new avatar
    const myCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

export const saveJob = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.body;
  const user = await User.findById(req.user.id);

  if (user.role !== "Job Seeker") {
    return next(new ErrorHandler("Only job seekers can save jobs.", 400));
  }

  if (user.savedJobs.includes(jobId)) {
    return next(new ErrorHandler("Job already saved.", 400));
  }

  user.savedJobs.push(jobId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Job saved successfully!",
    savedJobs: user.savedJobs
  });
});

export const unsaveJob = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.params;
  const user = await User.findById(req.user.id);

  user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Job removed from saved list.",
    savedJobs: user.savedJobs
  });
});

export const getSavedJobs = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("savedJobs");
  
  res.status(200).json({
    success: true,
    savedJobs: user.savedJobs
  });
});