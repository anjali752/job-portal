// import mongoose from "mongoose"; //just mongoose import!
// import dotenv from "dotenv"
// dotenv.config()

// //Database connection here!
//  const dbConnection  = ()=>{
//     mongoose.connect(process.env.DB_URL,{
//        dbName: "Job_Portal"

//     }).then(()=>{ //agar connect ho jaye toh!
//        console.log("MongoDB Connected Sucessfully !")
//     }).catch((error)=>{
//         console.log(`Failed to connect ${error}`) //warna error de do console me!
//     })
    
// }
// export default dbConnection;

// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import User from "../models/userSchema.js";

// dotenv.config();

// const dbConnection = () => {
//   mongoose.connect(process.env.DB_URL, {
//     dbName: "Job_Portal"
//   })
//   .then(async () => {
//     console.log("MongoDB Connected Successfully!");

//     await User.create({ name: "Rajesh" });
//     console.log("Test data inserted");
//   })
//   .catch((error) => {
//     console.log(`Failed to connect ${error}`);
//   });
// };

// export default dbConnection;

// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import { User } from "../models/userSchema.js"; // ✅ correct import

// dotenv.config();

// const dbConnection = () => {
//   mongoose.connect(process.env.DB_URL, {
//     dbName: "Job_Portal"
//   })
//   .then(async () => {
//     console.log("MongoDB Connected Successfully!");

//     // ✅ proper data (all required fields)
//     await User.create({
//       name: "Rajesh",
//       email: "rajesh@gmail.com",
//       phone: 9876543210,
//       password: "12345678",
//       role: "Job Seeker"
//     });

//     console.log("Test data inserted");
//   })
//   .catch((error) => {
//     console.log(`Failed to connect ${error}`);
//   });
// };

// export default dbConnection;


import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/userSchema.js";

dotenv.config();

const dbConnection = () => {
  mongoose.connect(process.env.DB_URL, {
    dbName: "Job_Portal"
  })
  .then(async () => {
    console.log("MongoDB Connected Successfully!");

    // ✅ DB name check
    console.log("Connected DB:", mongoose.connection.name);

    try {
      const user = await User.create({
        name: "Rajesh",
        email: "rajesh@gmail.com",
        phone: 9044189506,
        password: "12345678",
        role: "Job Seeker"
      });

      console.log("Inserted Data:", user);
    } catch (err) {
      console.log("Insert Error:", err.message);
    }

  })
  .catch((error) => {
    console.log(`Failed to connect ${error}`);
  });
};

export default dbConnection;