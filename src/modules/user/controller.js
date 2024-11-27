// src/modules/users/controller.js
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./service.js";

// Create user
export const createUser = async (req, res) => {
  try {
    const result = await createUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

// Get user by ID
export const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await getUserById(userId);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

// Update user
export const updateUserDetails = async (req, res) => {
  const { userId } = req.params;
  const { name, role } = req.body;

  try {
    const result = await updateUser(userId, { name, role });
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

// Delete user
export const removeUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await deleteUser(userId);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
