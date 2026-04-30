import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/userSchema.js";

dotenv.config();

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB");
    
    // Delete duplicate/dummy accounts
    const result = await User.deleteMany({ 
      $or: [
        { name: "Rajesh" },
        { name: "hello" },
        { email: /example\.com/ } // This will remove the seeded profiles too if you want, but maybe keep them for now?
      ]
    });
    
    console.log(`Deleted ${result.deletedCount} dummy/test accounts.`);
    
    // List remaining real-looking seekers
    const survivors = await User.find({ role: "Job Seeker" }).select("name email createdAt");
    console.log("Remaining Seekers in DB:");
    console.table(survivors.map(s => ({ 
      name: s.name, 
      email: s.email, 
      date: s.createdAt 
    })));
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

cleanup();
