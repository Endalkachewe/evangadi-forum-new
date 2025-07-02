const express = require("express");
const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware")
const {postComment, getComment} = require("../controller/commentController")

router.post("/:answerId/comment", postComment);
router.get("/:answerId/comment", getComment);

module.exports = router;