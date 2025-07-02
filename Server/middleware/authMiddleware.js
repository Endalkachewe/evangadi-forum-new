const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken")

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({msg: "Authentication Invalid"})
  }

  const token = authHeader.split(' ')[1];
 

  try {
    const { username, userid } = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = { username, userid };
    next()

  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "Authentication Invalid"})

  }
}

module.exports = authMiddleware;