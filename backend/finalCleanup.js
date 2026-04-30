import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const finalClean = async () => {
  try {
    const uri = process.env.DB_URL.replace("JobPortal", "Job_Portal"); // Match the real DB name
    await mongoose.connect(uri);
    console.log("Connected to real DB: Job_Portal");
    
    const result = await mongoose.connection.collection("users").deleteMany({ 
      name: { $in: ["satyam", "Rajesh", "hello"] } 
    });
    
    console.log(`Successfully deleted ${result.deletedCount} dummy records.`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

finalClean();
