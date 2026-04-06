


// import express from "express";
// import dbConnection from "./database/dbConnection.js";
// import jobRouter from "./routes/jobRoutes.js";
// import userRouter from "./routes/userRoutes.js";
// import applicationRouter from "./routes/applicationRoutes.js";
// import { config } from "dotenv";
// import cors from "cors";
// import { errorMiddleware } from "./middlewares/error.js";
// import cookieParser from "cookie-parser";
// import fileUpload from "express-fileupload";
// import fetch from "node-fetch";

// const app = express();
// config({ path: "./config/config.env" });

// app.use(
//   cors({
//     origin: [process.env.FRONTEND_URL],
//     methods: ["GET", "POST", "DELETE", "PUT"],
//     credentials: true,
//   })
// );

// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );

// //
// // 🔥 FREE CHATBOT ROUTE (UPDATED MODEL)
// //
// app.post("/chat-free", async (req, res) => {
//   try {
//     const { message } = req.body;

//     console.log("User message:", message);

//     const response = await fetch(
//   "https://api-inference.huggingface.co/models/google/flan-t5-base",
//   {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       inputs: message,
//     }),
//   }
// );

//     const data = await response.json();

//     console.log("HF Response:", data);

//     // ✅ SAFE RESPONSE RETURN
//     if (data.error) {
//       return res.json({
//         generated_text: "Model loading... try again ⏳",
//       });
//     }

//     res.json(data);
//   } catch (error) {
//     console.log("Chatbot Error:", error);
//     res.status(500).json({ message: "Chatbot error aa gaya" });
//   }
// });

// //
// // 🔥 EXISTING ROUTES
// //
// app.use("/api/v1/user", userRouter);
// app.use("/api/v1/job", jobRouter);
// app.use("/api/v1/application", applicationRouter);

// dbConnection();

// app.use(errorMiddleware);

// export default app;



import express from "express";
import dbConnection from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import fetch from "node-fetch";

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//
// 🔥 AI CHATBOT ROUTE (OpenRouter)
//
app.post("/chat-free", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("User message:", message);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, // 👈 yaha key use hogi
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("AI Response:", data);

    res.json(data);
  } catch (error) {
    console.log("Chatbot Error:", error);
    res.status(500).json({ message: "Chatbot error aa gaya" });
  }
});


app.post("/analyze-resume", async (req, res) => {
  try {
    const file = req.files.resume;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resumeText = file.data.toString();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "system",
              content:
                "You are a resume analyzer. Give missing skills and improvement tips in bullet points.",
            },
            {
              role: "user",
              content: resumeText,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content || "No response";

    res.json({ reply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in analysis" });
  }
});


//
// 🔥 EXISTING ROUTES
//
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

dbConnection();

app.use(errorMiddleware);

export default app;