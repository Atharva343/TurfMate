import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./Routes/authRouter.js";
import turfRouter from "./Routes/turfRouter.js";
import ticketRouter from "./Routes/ticketRouter.js";
import userRouter from "./Routes/userRouter.js";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT || 8080;

async function dbConnect() {
  await mongoose.connect(process.env.MONGO_URI);
}

dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on ${PORT} and DB connected
        `);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/auth", authRouter);
app.use("/turfs", turfRouter);
app.use("/tickets", ticketRouter);
app.use("/user", userRouter);

app.use((err, req, res, next) => {
  const { status = 500, message = "Something Went Wrong" } = err;
  res.status(status).json({ error: message });
});
