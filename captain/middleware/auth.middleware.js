const jwt = require("jsonwebtoken");
const captainModel = require("../models/captain.model");
const blacklistTokenModel = require("../models/blacklisttoken.model");

module.exports.captainAuth = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // console.log(token);

    const isBlacklisted = await blacklistTokenModel.find({ token });
    // console.log(isBlacklisted);

    if (isBlacklisted.length) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const captain = await captainModel.findById(decoded.id);

    if (!captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // console.log(captain);
    delete captain._doc.password; //deleting the password feild from user document
    req.captain = captain;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
