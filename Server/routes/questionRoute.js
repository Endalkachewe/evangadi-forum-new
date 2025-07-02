const express = require("express");
const router = express.Router({ mergeParams: true })
const authMiddleware = require("../middleware/authMiddleware")

// question controller
const {postQuestion, singleQuestion, allQuestion} = require("../controller/questionController")

router.post("",  postQuestion);

router.get("",  allQuestion);


router.get("/:question_id", singleQuestion);

module.exports = router;