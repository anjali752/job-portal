import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const check = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL);
    console.log("Connected to:", conn.connection.name);
    
    const admin = conn.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log("Databases List:");
    dbs.databases.forEach(db => console.log(`- ${db.name}`));
    
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("Collections in current DB:");
    collections.forEach(c => console.log(`- ${c.name}`));

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
