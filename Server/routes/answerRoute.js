const express = require("express");
const router = express.Router({ mergeParams: true })
const authMiddleware = require("../middleware/authMiddleware")

const {singleQuestion, postAnswer} = require("../controller/answerController")
// user controller

router.get("", singleQuestion);

router.post("",  postAnswer);

module.exports = router;