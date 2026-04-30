import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/userSchema.js";

dotenv.config();

const realTalent = [
  {
    name: "Aarav Sharma",
    email: "aarav.dev@example.com",
    phone: 9876543210,
    mobile: 9876543210,
    phoneNumber: 9876543210,
    pancard: "ABCDE1234F",
    aadhaarCard: 123456789012,
    adharcard: 123456789012,
    drivingLicense: "DL1234567890",
    password: "password123",
    role: "Job Seeker",
    jobTitle: "Senior Frontend Engineer",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux"],
    professionalSummary: "Passionate frontend developer with 5+ years of experience building scalable web applications. Expert in modern React patterns and performance optimization.",
    bio: "Love building clean UIs and mentoring junior developers.",
    address: "Bangalore, India",
    isVerified: true,
  },
  {
    name: "Ishani Gupta",
    email: "ishani.data@example.com",
    phone: 9123456781,
    mobile: 9123456781,
    phoneNumber: 9123456781,
    pancard: "FGHIJ5678K",
    aadhaarCard: 234567890123,
    adharcard: 234567890123,
    drivingLicense: "DL0987654321",
    password: "password123",
    role: "Job Seeker",
    jobTitle: "Data Scientist",
    skills: ["Python", "TensorFlow", "Pandas", "SQL", "Scikit-Learn"],
    professionalSummary: "Data science enthusiast with a strong background in machine learning and statistical modeling. Experienced in turning complex data into actionable insights.",
    bio: "PhD in Computer Science. Specialized in NLP.",
    address: "Delhi, India",
    isVerified: true,
  },
  {
    name: "Rohan Verma",
    email: "rohan.fullstack@example.com",
    phone: 9234567892,
    mobile: 9234567892,
    phoneNumber: 9234567892,
    pancard: "KLMNO9012P",
    aadhaarCard: 345678901234,
    adharcard: 345678901234,
    drivingLicense: "DL1122334455",
    password: "password123",
    role: "Job Seeker",
    jobTitle: "Full Stack Developer",
    skills: ["Node.js", "Express", "MongoDB", "React", "Docker", "AWS"],
    professionalSummary: "Versatile Full Stack Developer with 4 years of experience in MERN stack. Proficient in cloud deployment and microservices architecture.",
    bio: "Open source contributor. Tech blogger.",
    address: "Pune, India",
    isVerified: true,
  },
  {
    name: "Sneha Reddy",
    email: "sneha.uiux@example.com",
    phone: 9345678903,
    mobile: 9345678903,
    phoneNumber: 9345678903,
    pancard: "QR STU3456V",
    aadhaarCard: 456789012345,
    adharcard: 456789012345,
    drivingLicense: "DL6677889900",
    password: "password123",
    role: "Job Seeker",
    jobTitle: "UI/UX Designer",
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Visual Design"],
    professionalSummary: "Creative UX Designer focused on human-centric design. Skilled in creating intuitive user journeys and high-fidelity prototypes.",
    bio: "Designing for impact. Coffee lover.",
    address: "Hyderabad, India",
    isVerified: true,
  },
  {
    name: "Vikram Malhotra",
    email: "vikram.devops@example.com",
    phone: 9456789014,
    mobile: 9456789014,
    phoneNumber: 9456789014,
    pancard: "WXY Z7890A",
    aadhaarCard: 567890123456,
    adharcard: 567890123456,
    drivingLicense: "DL0099887766",
    password: "password123",
    role: "Job Seeker",
    jobTitle: "DevOps Engineer",
    skills: ["Kubernetes", "Jenkins", "Terraform", "CI/CD", "Azure", "Python"],
    professionalSummary: "DevOps Engineer dedicated to automating infrastructure and streamlining deployment pipelines. Strong advocate for GitOps practices.",
    bio: "Automation freak. SRE mindset.",
    address: "Gurgaon, India",
    isVerified: true,
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB for seeding...");

    // Check if these users already exist to avoid duplicates
    for (const talent of realTalent) {
      const exists = await User.findOne({ email: talent.email });
      if (!exists) {
        await User.create(talent);
        console.log(`Created talent: ${talent.name}`);
      } else {
        console.log(`Talent already exists: ${talent.name}`);
      }
    }

    console.log("Seeding completed!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
