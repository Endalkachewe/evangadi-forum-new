const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../db/dbConfig");


async function postComment(req, res) {
  const { answerId } = req.params; 
  const { content, user_id } = req.body;

  if (!content) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide comment content",
    });
  }

  try {
    await dbConnection.query(
      `INSERT INTO  commentTable (answer_id, user_id, content)
       VALUES (?, ?, ?)`,
      [answerId, user_id, content]
    );

    return res.status(201).json({
      message: "comment posted successfully."
    });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred.",
    });
  }
}


async function getComment(req, res) {
  const { answer_id } = req.params;

  try {
    const [comments] = await dbConnection.query(
      `SELECT 
         c.content,
         u.user_id, u.user_name 
       FROM 
         commentTable c
       JOIN 
         userTable u ON c.user_id = u.user_id
       WHERE 
         c.answer_id = ?`,
      [answer_id]
    );

    return res.status(StatusCodes.OK).json(comments);
  } catch (error) {
    console.error(" Error fetching comments:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred.",
    });
  }
}

module.exports = { postComment, getComment }