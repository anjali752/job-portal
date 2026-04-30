import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const globalfind = async () => {
  try {
    const clusterUri = process.env.DB_URL.split("/").slice(0, 3).join("/") + "/";
    console.log("Connecting to Cluster...");
    
    const dbsToCheck = ["Job_Portal", "jop-portal", "test", "MERN_JOB_PORTAL_WITH_AUTOMATION"];
    
    for (const dbName of dbsToCheck) {
       const uri = `${clusterUri}${dbName}?retryWrites=true&w=majority`;
       try {
         const conn = await mongoose.createConnection(uri).asPromise();
         console.log(`\n--- DB: ${dbName} ---`);
         const collections = await conn.db.listCollections().toArray();
         const hasUsers = collections.some(c => c.name === "users");
         
         if (hasUsers) {
            const count = await conn.collection("users").countDocuments({ name: /Rajesh/i });
            console.log(`Found ${count} Rajesh in 'users'`);
            if (count > 0) {
               const deleted = await conn.collection("users").deleteMany({ name: /Rajesh/i });
               console.log(`DELETED ${deleted.deletedCount} Rajesh from ${dbName}`);
            }
         } else {
            console.log("No 'users' collection");
         }
         await conn.close();
       } catch (e) {
         console.log(`Failed to connect to ${dbName}: ${e.message}`);
       }
    }
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

globalfind();
