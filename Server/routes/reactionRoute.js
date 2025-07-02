const express = require("express");
const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware")
const {handleReaction, getReaction} = require("../controller/reactionController")

router.post("/:answerId/react", handleReaction);
router.get("/:answerId/react", getReaction);

module.exports = router;