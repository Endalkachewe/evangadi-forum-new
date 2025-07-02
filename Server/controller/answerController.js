const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");


async function singleQuestion(req, res) {
  const questionId = req.params.question_id; 

  try {
    const [answers] = await dbConnection.query(`
      SELECT 
        a.answer_id,
        a.content ,
        u.user_name,
        a.created_at
      FROM 
        answerTable a
      JOIN 
        userTable u ON a.user_id = u.user_id
      WHERE 
        a.question_id = ?
      ORDER BY 
        a.created_at ASC;
    `, [questionId]);

    return res.status(StatusCodes.OK).json(answers); 
  } catch (err) {
    console.error(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An unexpected error occurred." });
  }

};

async function postAnswer(req, res) {
  // Get user ID from JWT middleware
  // const user_id = req.user.userid;
  const question_id = req.params.question_id;  
  const { content, user_id } = req.body;

  if (!content) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please provide answer content",
    });
  }

  try {
    await dbConnection.query(
      `INSERT INTO answerTable (question_id, user_id, content)
       VALUES (?, ?, ?)`,
      [question_id, user_id, content]
    );

    return res.status(201).json({
      message: "Answer posted successfully."
    });
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred.",
    });
  }
}


module.exports = { singleQuestion, postAnswer };