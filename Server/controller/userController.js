const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

async function register(req, res) {
  const { user_name, first_name, last_name, email, password } = req.body;
  if (!user_name || !first_name || !last_name || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  try {
    const [user] = await dbConnection.query(
      "SELECT user_name, user_id FROM userTable WHERE user_name=? or email=?",
      [user_name, email]
    );

    if (user.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({msg: "User already existed"})
    }

    if (password.length < 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({msg: "Password must be at least 8 characters"})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await dbConnection.query(
      "INSERT INTO userTable (user_name, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)",
      [user_name, first_name, last_name, email, hashedPassword]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({msg: "Please provide all required fields"})
  }


  try {

    const [user] = await dbConnection.query(
      "SELECT user_name, user_id, password FROM userTable WHERE email=?",
      [email]
    );
   
    if (user.length == 0) {
        return res.status(StatusCodes.UNAUTHORIZED).json({msg: "Invalid username"})
      }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({msg: "Invalid password"})
    } 

    const username = user[0].user_name;
    const userid = user[0].user_id;
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {expiresIn:"1d"});
    
    return res.status(StatusCodes.OK).json({msg: "User login successful", token, username})
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred" });
  }
}

async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  return res.status(StatusCodes.OK).json({msg: "Valid user", username, userid});
  res.send("check user");
}

module.exports = { register, login, checkUser };
