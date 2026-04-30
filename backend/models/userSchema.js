import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Phone Number!"],
  },
  password: {
    type: String,
    required: [true, "Please provide a Password!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    maxLength: [32, "Password cannot exceed 32 characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "Please select a role"],
    enum: ["Job Seeker", "Employer"],
  },
  // Recruiter/Company Profile Section
  companyLegalName: { type: String },
  companyName: { type: String }, // Restored
  companyRegistrationNumber_CIN: { type: String },
  gstNumber: { type: String },
  companyWebsite: {
    type: String,
    validate: {
      validator: (v) => !v || validator.isURL(v),
      message: "Please enter a valid URL for Company Website!"
    }
  },
  officialCompanyEmail: {
    type: String,
    validate: {
      validator: (v) => !v || validator.isEmail(v),
      message: "Please provide a valid business email!"
    }
  },
  industryType: { type: String },
  companySize: {
    type: String,
    enum: {
      values: ["1-10", "11-50", "51-200", "201-500", "500+", ""], // Allow empty string
      message: "{VALUE} is not a valid company size"
    }
  },
  yearOfEstablishment: { type: Number },
  officeAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  address: { type: String }, // Restored
  recruiterFullName: { type: String },
  recruiterWorkEmail: {
    type: String,
    validate: {
      validator: (v) => !v || validator.isEmail(v),
      message: "Please provide a valid work email!"
    }
  },
  recruiterPhoneNumber: { type: String },
  recruiterLinkedInURL: {
    type: String,
    validate: {
      validator: (v) => !v || validator.isURL(v),
      message: "Please enter a valid LinkedIn URL!"
    }
  },
  jobTitle: { type: String }, // Restored
  bio: { type: String }, // Restored
  documents: {
    companyRegistrationCertificate: { public_id: String, url: String },
    gstCertificate: { public_id: String, url: String },
    officeAddressProof: { public_id: String, url: String },
    recruiterIdProof: { public_id: String, url: String },
  },
  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  profileViews: {
    type: Number,
    default: 0
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  professionalSummary: {
    type: String,
    maxLength: [1000, "Summary cannot exceed 1000 characters!"],
  },
  skills: [
    {
      type: String,
    },
  ],
  education: [
    {
      institution: String,
      degree: String,
      year: String,
    },
  ],
  experience: [
    {
      company: String,
      role: String,
      duration: String,
      description: String,
    },
  ],
  portfolioUrl: String,
  githubProfile: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
});


//ENCRYPTING THE PASSWORD WHEN THE USER REGISTERS OR MODIFIES HIS PASSWORD
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//COMPARING THE USER PASSWORD ENTERED BY USER WITH THE USER SAVED PASSWORD
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//GENERATING A JWT TOKEN WHEN A USER REGISTERS OR LOGINS, IT DEPENDS ON OUR CODE THAT WHEN DO WE NEED TO GENERATE THE JWT TOKEN WHEN THE USER LOGIN OR REGISTER OR FOR BOTH. 
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
