import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.min": "Name must be at least 3 characters long",
    "string.empty": "Name is required"
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required"
  }),
  phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required().messages({
    "string.pattern.base": "Phone number must contain only digits",
    "string.min": "Phone number must be at least 10 digits",
    "string.empty": "Phone number is required"
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required"
  }),
  role: Joi.string().valid("Job Seeker", "Employer").required().messages({
    "any.only": "Invalid role selected",
    "string.empty": "Role is required"
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("Job Seeker", "Employer").required(),
});

export const jobSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  category: Joi.string().required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  location: Joi.string().required(),
  fixedSalary: Joi.number().optional(),
  salaryFrom: Joi.number().optional(),
  salaryTo: Joi.number().optional(),
  jobType: Joi.string().required(),
  jobId: Joi.string().optional(), // For updates
}).or("fixedSalary", "salaryFrom");

export const applicationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  coverLetter: Joi.string().min(10).required(),
  jobId: Joi.string().required(),
});
