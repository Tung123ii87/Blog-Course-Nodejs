const express = require('express');
const router = express.Router();

const autherController = require('../app/controllers/authController');
const middlewareController = require('../app/middleware/MiddlewareController')

//Register
router.post("/register", autherController.registerUser);
router.get("/register", autherController.register);

//Login
router.post("/login", autherController.loginUser);
router.get("/login", autherController.login);

//Refresh
router.post("/refresh", autherController.requestRefreshToken);

//Logout
router.post("/logout", middlewareController.verifyToken, autherController.userLogout);

module.exports = router;