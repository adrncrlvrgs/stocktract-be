const User = require("models/userModel");
const asyncHandler = require("utils/asynchandler");

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await User.create({ name, email, password });
  res.status(201).res.json(newUser);
});
