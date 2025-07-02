const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

async function handleReaction(req, res) {
  const { user_id, reaction_type } = req.body;
  const { answerId } = req.params;

  try {
    const [existing] = await dbConnection.query(
      `SELECT * FROM answerReactionTable WHERE user_id = ? AND answer_id = ?`,
      [user_id, answerId]
    );

    if (existing.length > 0) {
      if (existing[0].reaction_type === reaction_type) {
        await dbConnection.query(
          `DELETE FROM answerReactionTable WHERE user_id = ? AND answer_id = ?`,
          [user_id, answerId]
        );
        return res.status(200).json({ message: "Reaction removed" });
      } else {
        await dbConnection.query(
          `UPDATE answerReactionTable SET reaction_type = ? WHERE user_id = ? AND answer_id = ?`,
          [reaction_type, user_id, answerId]
        );
        return res.status(200).json({ message: "Reaction updated" });
      }
    } else {
      await dbConnection.query(
        `INSERT INTO answerReactionTable (user_id, answer_id, reaction_type) VALUES (?, ?, ?)`,
        [user_id, answerId, reaction_type]
      );
      return res.status(200).json({ message: "Reaction added" });
    }

  } catch (err) {
    console.error(" Server error in reaction controller:", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
}
async function getReaction(req, res) {
  const { answerId } = req.params;
  const { user_id } = req.query;

  try {
    // Total likes
    const [likes] = await dbConnection.query(
      `SELECT COUNT(*) AS likeCount FROM answerReactionTable WHERE answer_id = ? AND reaction_type = 'like'`,
      [answerId]
    );

    // Total dislikes
    const [dislikes] = await dbConnection.query(
      `SELECT COUNT(*) AS dislikeCount FROM answerReactionTable WHERE answer_id = ? AND reaction_type = 'dislike'`,
      [answerId]
    );

    // User's reaction (if user_id is provided)
    let userReaction = "none";
    if (user_id) {
      const [userReactRes] = await dbConnection.query(
        `SELECT reaction_type FROM answerReactionTable WHERE user_id = ? AND answer_id = ?`,
        [user_id, answerId]
      );

      if (userReactRes.length > 0) {
        userReaction = userReactRes[0].reaction_type;
      }
    }

    res.status(200).json({
      likeCount: likes[0].likeCount,
      dislikeCount: dislikes[0].dislikeCount,
      userReaction,
    });
  } catch (err) {
    console.error("Error fetching reactions:", err);
    res.status(500).json({ error: "Failed to fetch reactions", detail: err.message });
  }
}


module.exports = { handleReaction, getReaction };
