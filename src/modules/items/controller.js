import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from "./service.js";
import { generateMeta } from "../../core/utils/generateMeta.js";

export const create = async (req, res) => {
  const authDocId = req.user.userId;
  const files = req.files;

  try {
    const result = await createItem(req.body, authDocId, files);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getItems = async (req, res) => {
  try {
    const { data, meta } = await generateMeta({
      authDocId: req.user.userId,
      getData: getAllItems,
      search: req.query.search,
      limit: req.query.limit || 10,
      page: req.query.page || 1,
      orderBy: req.query.orderBy || "item",
      order: req.query.order || "asc",
      searchFields: ["item", "itemID"],
    });

    return res.status(200).json({ data, meta });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getItem = async (req, res) => {
  const { itemID } = req.params;
  const authDocId = req.user.userId;

  try {
    const item = await getItemById(itemID, authDocId);
    return res.status(200).json(item);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const updateItemDetails = async (req, res) => {
  const { itemID } = req.params;
  const authDocId = req.user.userId;
  const files = req.files;
 
  try {
    const result = await updateItem(authDocId, itemID, req.body, files);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const deleteItemDetails = async (req, res) => {
  const { itemID } = req.params;
  const authDocId = req.user.userId;

  try {
    const result = await deleteItem(authDocId, itemID);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
