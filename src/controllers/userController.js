import User from "../models/userModel.js";
import asyncHandler from "../utils/asynchandler.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await User.create({ name, email, password });
  res.status(201).res.json(newUser);
});
