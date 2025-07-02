const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")

// user controller
const { register, login, checkUser } = require("../controller/userController");

router.post("/register", register);

router.post("/login", login);

router.get("/checkUser", authMiddleware, checkUser);

module.exports = router;