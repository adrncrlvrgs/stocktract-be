import {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
} from "./service.js";

import { generateMeta } from "../../core/utils/generateMeta.js";

export const create = async (req, res) => {
  const authDocId = req.user.userId;
  try {
    const result = await createSale(req.body, authDocId);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getSales = async (req, res) => {
  try {
    const { data, meta } = await generateMeta({
      authDocId: req.user.userId,
      getData: getAllSales,
      search: req.query.search,
      limit: req.query.limit || 10,
      page: req.query.page || 1,
      orderBy: req.query.orderBy || "saleID",
      order: req.query.order || "asc",
      searchFields: ["saleID", "item"],
    });

    return res.status(200).json({ data, meta });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getSale = async (req, res) => {
  const { saleID } = req.params;
  const authDocId = req.user.userId;

  try {
    const sale = await getSaleById(saleID, authDocId);
    return res.status(200).json(sale);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const updateSaleDetails = async (req, res) => {
  const { saleID } = req.params;
  const authDocId = req.user.userId;

  try {
    const result = await updateSale(authDocId, saleID, req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const deleteSaleDetails = async (req, res) => {
  const { saleID } = req.params;
  const authDocId = req.user.userId;

  try {
    const result = await deleteSale(authDocId, saleID);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
