require("dotenv").config();
const { isEmail, isStrongPassword } = require("validator");
const bcrypt = require("bcrypt");
const UserModel = require("../db/models/userModel");
const {
  generateToken,
  makeHashText,
  generateUserId,
} = require("../utils/constants");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({ status: false, message: "Please fill in all fields" });
    }
    if (!isEmail(email)) {
      return res.status(400).send({ status: false, message: "Invalid email" });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Password Not Meet the criteria, it Must includes(password length 8 or more charaters, 1 uppercase letter, 1 special symbol)",
      });
    }

    const checkUserAlreadyExists = await UserModel.findOne({ email });
    if (checkUserAlreadyExists) {
      return res
        .status(400)
        .send({ status: false, message: "User already exists" });
    }
    const hashedPassword = await makeHashText(password);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      user_id: generateUserId(),
    });
    const user = await newUser.save();

    const token = await generateToken({
      userDetails: {
        user_id: user?.user_id,
        name,
      },
    });

    const sendDetails = {
      name: user?.name,
      user_id: user?.user_id,
      token,
    };

    res.status(200).send({
      status: true,
      message: "User Created Successfully",
      data: {
        userDetails: sendDetails,
      },
    });
  } catch (error) {
    res.status(400).send({ status: false, message: "Something Went Wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: false, message: "Email and Password are required" });
    }
    if (!isEmail(email)) {
      return res.status(400).send({ status: false, message: "Invalid Email" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({ status: false, message: "User Not Found" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .send({ status: false, message: "Check Your Password" });
    }
    const token = await generateToken({
      userDetails: {
        user_id: user?.user_id,
        name: user?.name,
      },
    });
    const sendDetails = {
      name: user?.name,
      user_id: user?.user_id,
      token,
    };
    res.status(200).send({
      status: true,
      message: "Login Successful",
      data: {
        userDetails: sendDetails,
      },
    });
  } catch (error) {
    res.status(400).send({ status: false, message: "Something Went Wrong" });
  }
};

module.exports = {
  register,
  login,
};
