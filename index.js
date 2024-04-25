const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const storeroutes = require("./routes/store");

dotenv.config();

const app = express();
const DB = process.env.MONGO_URL;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use("/store", storeroutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 4000;

mongoose
  .connect(DB)
  .then(() => {
    console.log("connection established");
    app.listen(PORT);
  })
  .catch((error) => {
    console.log(error);
  });
