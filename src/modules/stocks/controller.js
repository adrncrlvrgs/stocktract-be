import {
  createStock,
  getAllStocks,
  getStockById,
  updateStock,
  deleteStock,
} from "./service.js";

import { generateMeta } from "../../core/utils/generateMeta.js";

export const create = async (req, res) => {
  const authDocId = req.user.userId;
  const id = req.user.id;
  try {
    const result = await createStock(req.body, authDocId, id);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getStocks = async (req, res) => {
  try {
    const { data, meta } = await generateMeta({
      authDocId: req.user.userId,
      getData: getAllStocks,
      search: req.query.search,
      limit: req.query.limit || 10,
      page: req.query.page || 1,
      orderBy: req.query.orderBy || "stockID",
      order: req.query.order || "asc",
      searchFields: ["item", "stockID"],
    });

    return res.status(200).json({ data, meta });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getStock = async (req, res) => {
  const { stockID } = req.params;
  const authDocId = req.user.userId;

  try {
    const stock = await getStockById(stockID, authDocId);
    return res.status(200).json(stock);
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const updateStockDetails = async (req, res) => {
  const { stockID } = req.params;
  const authDocId = req.user.userId;
  const id = req.user.id;

  try {
    const result = await updateStock(authDocId, stockID, req.body, id);
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const removeStock = async (req, res) => {
  const { stockID } = req.params;
  const authDocId = req.user.userId;
  const id = req.user.id;

  try {
    const result = await deleteStock(authDocId, stockID, id);
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
