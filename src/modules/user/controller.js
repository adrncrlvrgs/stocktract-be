import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./service.js";
import { generateMeta } from "../../core/utils/generateMeta.js";

export const create = async (req, res) => {
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


export const getUsers = async (req, res) => {

  try {
      const { data, meta } = await generateMeta({
        getData: getAllUsers,  
        search: req.query.search,
        limit: req.query.limit || 20,
        offset: req.query.offset || 0,
        orderBy: req.query.orderBy || 'createdAt',  
        order: req.query.order || 'desc',  
        searchFields: ['name',"userID"]
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
