import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./service.js";
import { generateMeta } from "../../core/utils/generateMeta.js";

export const create = async (req, res) => {
  const authDocId = req.user.userId;
  try {
    const result = await createUser(req.body, authDocId);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getUsers = async (req, res) => {

  console.log(req.query)
  const searchKey = req.query.searchKey || 'search'; // fallback to 'search'
  const searchQuery = req.query[searchKey] ? req.query[searchKey].trim() : "";
  try {
    const { data, meta } = await generateMeta({
      authDocId: req.user.userId,
      getData: getAllUsers,
      search: searchQuery,
      limit: req.query.limit || 10,
      page: req.query.page || 1,
      orderBy: req.query.orderBy || "name",
      order: req.query.order || "asc",
      searchFields: ["name", "userID"],
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
  const authDocId = req.user.userId;

  try {
    const user = await getUserById(userID, authDocId);
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
  const authDocId = req.user.userId;

  try {
    const result = await updateUser(authDocId, userID, req.body);
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
  const authDocId = req.user.userId;

  try {
    const result = await deleteUser(authDocId, userID);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
