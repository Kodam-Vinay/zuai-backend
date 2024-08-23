require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");
const { hash, genSalt } = require("bcrypt");
const userModel = require("../db/models/userModel");
const generateToken = async ({ userDetails }) => {
  return await sign(userDetails, process.env.JWT_SECRET_KEY);
};

const makeHashText = async (text) => {
  if (!text) {
    return;
  }
  let hashedText = "";
  try {
    const salt = parseInt(process.env.SALT_ROUNDS);
    const saltRounds = await genSalt(salt);
    hashedText = await hash(text, saltRounds);
  } catch (error) {
    console.log(error);
  }
  return hashedText;
};

const authorizeUser = (req, res, next) => {
  const authHeaders = req.headers["authorization"];
  if (authHeaders) {
    const token = authHeaders.split(" ")[1];
    verify(token, process.env.JWT_SECRET_KEY, async (err, encoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized User" });
      }
      req.user = encoded;
      next();
    });
  } else {
    return res.status(401).json({ message: "Unauthorized User" });
  }
};

const generateRandomNumber = () => {
  let number = "";
  const possibleValues = "0123456789_";
  const alphabatesAndSymbols = "_abcdefghijklmnopqrstuvwxyz";
  const rand = Math.floor(Math.random() * 4) + 1;
  for (let i = 0; i < rand; i++) {
    number += possibleValues[Math.floor(Math.random() * possibleValues.length)];
    number +=
      alphabatesAndSymbols[
        Math.floor(Math.random() * alphabatesAndSymbols.length)
      ];
  }
  console.log(number);
  return number;
};

const generateUserId = (name) => {
  const randomNumber = generateRandomNumber();
  const userId = name + "_" + randomNumber;
  const checkUserIdExist = userModel.findOne({
    user_id: userId,
  });
  if (!checkUserIdExist) {
    return userId;
  }
};
module.exports = {
  generateToken,
  makeHashText,
  authorizeUser,
  generateUserId,
};
