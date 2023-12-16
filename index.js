const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api", authRoutes);
app.use("/users", userRoutes);
app.use("/questions", questionRoutes);

// API entry point
app.get("/", (req, res) => {
  res.json({ mssg: "You're viewing the API" });
});

// connect to db
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: "Quizz",
  })
  .then(() => {
    // listen to connection
    app.listen(process.env.PORT, () => {
      console.log(`Backend service running on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
