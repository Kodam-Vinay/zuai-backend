require("dotenv").config();
const { sign, verify } = require("jsonwebtoken");
const { hash, genSalt } = require("bcrypt");
const { v4: uniqueId } = require("uuid");
const multer = require("multer");
const path = require("path");

CLOUDINARY_CONFIG = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
};

const generateToken = async ({ userDetails }) => {
  return await sign({ userDetails }, process.env.JWT_SECRET_KEY);
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
  return number;
};

const generateUserId = (name) => {
  const randomNumber = generateRandomNumber();
  return (userId = name + "_" + randomNumber);
};

const sendPostDetails = (post) => {
  return {
    post_id: post.post_id,
    title: post.title,
    content: post.content,
    author: post.author,
    image: post.image,
    published_date: post?.createdAt,
  };
};

const STORAGE = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, "../uploads");
    return cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    return cb(null, `${uniqueId()}${file.originalname}`);
  },
});

module.exports = {
  generateToken,
  makeHashText,
  authorizeUser,
  generateUserId,
  sendPostDetails,
  CLOUDINARY_CONFIG,
  STORAGE,
};
