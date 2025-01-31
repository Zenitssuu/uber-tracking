const rideModel = require("../models/ride.model.js");
const { subscribeToQueue, publishToQueue } = require("../service/rabbit.js");

module.exports.createRide = async (req, res) => {
  try {
    const { pickup, destination } = req.body;
    console.log(req.user);

    const newRide = new rideModel({
      user: req.user._id,
      pickup,
      destination,
    });

    await newRide.save();
    publishToQueue("new-ride", JSON.stringify(newRide));

    return res.status(200).json(newRide);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};
