const captain = require("../models/captain.model");
const blacklistToken = require("../models/blacklisttoken.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { subscribeToQueue, publishToQueue } = require("../service/rabbit.js");

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const captainExists = await captain.findOne({ email });

    if (captainExists) {
      return res.status(400).json({ message: "Captain already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCaptain = new captain({
      name,
      email,
      password: hashedPassword,
    });

    await newCaptain.save();

    delete newCaptain._doc.password;

    const token = jwt.sign({ id: newCaptain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token);
    res.send({ message: "Captain registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);

    const existingCaptain = await captain
      .findOne({ email })
      .select("+password");

    if (!existingCaptain) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingCaptain.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: existingCaptain._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    delete existingCaptain._doc.password;

    res.cookie("token", token);
    res.send({ token, existingCaptain });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    // console.log(token);
    await blacklistToken.create({ token });
    res.clearCookie("token");
    res.send({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.profile = async (req, res) => {
  try {
    const captain = req.captain;
    // delete user._doc.password;
    res.send(captain);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.toogleAvailable = async (req, res) => {
  try {
    const existingCaptain = await captain.findById(req.captain._id);

    if (!existingCaptain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    existingCaptain.isAvailable = !existingCaptain.isAvailable;

    await existingCaptain.save();
    delete existingCaptain._doc.password;
    // console.log(existingCaptain);
    console.log("Captain availability toogled");
    res.send(existingCaptain);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

subscribeToQueue("new-ride", (data) => {
  console.log(JSON.parse(data));
  
});
