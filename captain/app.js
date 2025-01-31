const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const captainRoutes = require("./routes/captain.routes");
const cookieParser = require("cookie-parser");
const connectDB = require("./db");
connectDB();
const app = express();

const rabbitMq = require('./service/rabbit.js')
rabbitMq.connect();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/", captainRoutes);


module.exports = app;
