import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const cleanDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB");
    
    const collection = mongoose.connection.collection("users");
    const indexes = await collection.indexes();
    console.log("Current Indexes:", indexes.map(i => i.name));
    
    const indexesToDrop = [
      "mobile_1", 
      "phoneNumber_1", 
      "pancard_1", 
      "aadhaarCard_1", 
      "adharcard_1", 
      "drivingLicense_1",
      "mobile",
      "phoneNumber",
      "pancard",
      "aadhaarCard",
      "adharcard",
      "drivingLicense"
    ];
    
    for (const name of indexesToDrop) {
       if (indexes.some(i => i.name === name)) {
         try {
           await collection.dropIndex(name);
           console.log(`Dropped index: ${name}`);
         } catch (e) {
           console.log(`Failed to drop ${name}: ${e.message}`);
         }
       }
    }
    
    console.log("Database cleanup finished.");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

cleanDB();
