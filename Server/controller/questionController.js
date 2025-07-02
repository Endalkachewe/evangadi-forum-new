const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");



async function postQuestion(req, res) {
  // const username = req.user.username;//from authMiddleware
  // const userid = req.user.userid;

  const { user_id , title, content } = req.body;

  if (!title || !content || !user_id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide all required fields",
    });
  }

  try {
    const [result] = await dbConnection.query(
      `INSERT INTO questionTable (user_id, title, content)
       VALUES (?, ?, ?)`,
      [user_id, title, content]
    );

    return res.status(StatusCodes.CREATED).json({
      message: "Question posted successfully."
    });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred.",
    });
  }
}



async function allQuestion(req, res) {
  try {
    const [rows] = await dbConnection.query(
      `SELECT 
         q.question_id,
         q.title,
         q.content,
         u.user_name,
         q.created_at
       FROM 
         questionTable q
       JOIN 
         userTable u ON q.user_id = u.user_id
       ORDER BY 
         q.created_at DESC`
    );

    return res.status(StatusCodes.OK).json(rows);
  }  catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "No questions found.",
    });
  }
}


async function singleQuestion(req, res) {
  const questionId = req.params.question_id;
  

  try {
    const [rows] = await dbConnection.query(
      `SELECT 
         q.question_id,
         q.title,
         q.content,
         u.user_name,
         q.created_at
       FROM 
         questionTable q
       JOIN 
         userTable u ON q.user_id = u.user_id
       WHERE 
         q.question_id = ?`,
      [questionId]
    );

    if (rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Question not found",
      });
    }

    return res.status(StatusCodes.OK).json(rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred.",
    });
  }
}


module.exports = {postQuestion, singleQuestion, allQuestion};