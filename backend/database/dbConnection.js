import mongoose from "mongoose";

const dbConnection = () => {
  if (!process.env.DB_URL) {
    console.error("Error: DB_URL is not defined in .env file.");
    return;
  }

  mongoose
    .connect(process.env.DB_URL, {
      dbName: "RECRUITEX_PORTAL", // You can change this to your desired database name
    })
    .then(() => {
      console.log("✅ MongoDB Atlas Connected Successfully!");
      console.log(`📡 Connected to Database: ${mongoose.connection.name}`);
    })
    .catch((error) => {
      console.error(`❌ Failed to connect to MongoDB: ${error.message}`);
      process.exit(1); // Stop the server if DB connection fails
    });
};

export default dbConnection;