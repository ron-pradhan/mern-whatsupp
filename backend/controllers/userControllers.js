const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, profilePicture } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Enter all the Fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already Exists");
  }
  const newUser = await User.create({
    name,
    email,
    password,
    profilePicture,
  });
  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      profilePicture: newUser.profilePicture,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("User Creation Failed");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const checkUser = await User.findOne({ email });
  if (checkUser && (await checkUser.matchPassword(password))) {
    res.json({
      _id: checkUser._id,
      email: checkUser.email,
      name: checkUser.name,
      password: checkUser.password,
      profilePicture: checkUser.profilePicture,
      token: generateToken(checkUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Email or Password Entered wrong !!");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
