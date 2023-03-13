const { model } = require('mongoose');

const express = require('express');
const router = express.Router();
const userController = require("../app/controllers/userController");
const middlewareController = require("../app/middleware/MiddlewareController");

//Get all user
router.get("/", middlewareController.verifyToken, userController.getAllUsers);

//Delete user
router.delete("/:id", middlewareController.VerifyTokenAndAdminAuth, userController.deleteUser)

module.exports = router