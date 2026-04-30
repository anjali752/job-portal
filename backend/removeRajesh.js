import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/userSchema.js";

dotenv.config();

const removeRajesh = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB");
    
    // Delete all users with Rajesh in their name
    const result = await User.deleteMany({ 
      name: { $regex: /Rajesh/i }
    });
    
    console.log(`Deleted ${result.deletedCount} instances of Rajesh.`);
    
    // Final check
    const remaining = await User.find({ role: "Job Seeker" }).select("name");
    console.log("Remaining Seeker Profiles:", remaining.map(u => u.name));
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

removeRajesh();
