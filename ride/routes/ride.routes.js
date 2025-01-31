const express = require("express");
const { userAuth } = require("../middleware/auth.middleware.js");
const rideControllers = require("../controllers/ride.controller.js")

const router = express.Router();

router.post('/create-ride',userAuth,rideControllers.createRide);

module.exports = router;