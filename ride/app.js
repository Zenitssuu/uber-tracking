const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const connect = require('./db/index.js');
connect();
const cookieParser = require('cookie-parser');
const rideRoutes = require('./routes/ride.routes');

const app = express();

const rabbitMq = require('./service/rabbit')

rabbitMq.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/', rideRoutes);


module.exports = app;