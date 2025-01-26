const express = require('express');
const userController = require('../controllers/user.controller');
const authmiddleware = require('../middleware/auth.middleware.js');
const router = express.Router();

router.post('/register', userController.register)
router.post('/register', userController.login)
router.post('/register', userController.logout)
router.get('/profile', authmiddleware.userAuth ,userController.profile)

module.exports = router;