import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const inspect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB");
    
    const collection = mongoose.connection.collection("users");
    const users = await collection.find({}).toArray();
    
    console.log("Full Database Dump (Users):");
    console.table(users.map(u => ({ 
      id: u._id,
      name: u.name, 
      email: u.email,
      role: u.role 
    })));
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

inspect();
