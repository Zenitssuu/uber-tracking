const express = require("express");
const captainController = require("../controllers/captain.controller.js");
const authmiddleware = require("../middleware/auth.middleware.js");
const router = express.Router();

router.post("/register", captainController.register);
router.post("/login", captainController.login);
router.post("/logout", captainController.logout);
router.get("/profile", authmiddleware.captainAuth, captainController.profile);
router.patch("/toogleAvailable", authmiddleware.captainAuth, captainController.toogleAvailable);

module.exports = router;
