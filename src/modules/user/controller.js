import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./service.js";
import { generateMeta } from "../../core/utils/generateMeta.js";

export const create = async (req, res) => {
  const file = req.file;

  try {
    const result = await createUser(req.body, req.user, file);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { data, meta } = await generateMeta({
      authDocId: req.user.userId,
      getData: getAllUsers,
      search: req.query.search,
      limit: req.query.limit || 10,
      page: req.query.page || 1,
      orderBy: req.query.orderBy || "firstName",
      order: req.query.order || "asc",
      searchFields: ["firstName", "userID"],
    });

    return res.status(200).json({ data, meta });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await getUserById(userID, req.user);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const updateUserDetails = async (req, res) => {
  const { userID } = req.params;
  const file = req.file;

  try {
    const result = await updateUser(req.user, userID, req.body, file);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const removeUser = async (req, res) => {
  const { userID } = req.params;

  try {
    const result = await deleteUser(req.user, userID);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
