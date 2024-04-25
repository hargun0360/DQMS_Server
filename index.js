const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const DB = process.env.MONGO_URL;
console.log(DB);
mongoose
    .connect(DB)
    .then(() => {
        console.log("connection established");
    })
    .catch((error) => {
        console.log(error);
    });

app.get("/", (req, res) => {    
    res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
