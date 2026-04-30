import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/userSchema.js";

dotenv.config();

const debug = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB");
    
    // Check all roles
    const roles = await User.distinct("role");
    console.log("Distinct Roles in DB:", roles);
    
    // Recent users
    const users = await User.find({}).sort({ createdAt: -1 }).limit(10).select("name email role createdAt");
    console.log("10 Most Recent Users:");
    console.table(users.map(u => ({ 
      name: u.name, 
      email: u.email, 
      role: u.role, 
      date: u.createdAt 
    })));
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

debug();
