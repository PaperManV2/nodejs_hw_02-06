const user = require("../services/schemas/users");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();
const secret = process.env.SECRET_KEY;

const addUser = async (body) => {
  try {
    const { password, email } = body;

    const alreadyUp = await user.findOne({ email }).lean();

    if (alreadyUp) {
      return "alreadyUp";
    }

    const hashedPass = await bcrypt.hash(password, saltRounds);
    body.password = hashedPass;

    const newUser = await user.create(body);
    return newUser;
  } catch (error) {
    console.error(error);
  }
};

const Login = async (body) => {
  try {
    const { password, email } = body;
    const foundUser = await user.findOne({ email });
    if (foundUser === null) {
      return "notUp";
    }
    const isPassOk = await bcrypt.compare(password, foundUser.password);
    if (!isPassOk) {
      return "passNotOk";
    }

    const payload = {
      id: String(foundUser._id),
    };
    const token = jwt.sign(payload, secret, { expiresIn: "2h" });
    foundUser.token = token;
    const updatedUser = await user.findOneAndUpdate({ email }, foundUser, {
      new: true,
    });

    return updatedUser;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  addUser,
  Login,
};
