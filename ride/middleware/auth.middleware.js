const jwt = require("jsonwebtoken");
const axios = require("axios");

axios.defaults.baseURL = process.env.BASE_URL;
// console.log(axios.defaults.baseURL);

module.exports.captainAuth = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // console.log(token);

    const isBlacklisted = await captainBlacklistTokenModel.find({ token });
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

module.exports.userAuth = async (req, res, next) => {
  try {
    // console.log(req.cookies);
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // console.log(token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(1);
    // console.log(token);

    const resp = await axios.get('user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(1);

    console.log(resp.data);

    const user = resp.data;

    if (!user) {
      return res.status(404).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
