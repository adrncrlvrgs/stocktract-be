import { 
  createCategory, 
  getAllCategory, 
  getCategoryById, 
  updateCategory
} from "./service.js";
import { generateMeta } from "../../core/utils/generateMeta.js";

export const create = async (req, res) => {
  const authDocId = req.user.userId;
  try {
    const result = await createCategory(req.body, authDocId);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const { data, meta } = await generateMeta({
      authDocId: req.user.userId,
      getData: getAllCategory,
      search: req.query.search,
      limit: req.query.limit || 10,
      page: req.query.page || 1,
      orderBy: req.query.orderBy || "name",
      order: req.query.order || "asc",
      searchFields: ["name", "categoryID"],
    });

    return res.status(200).json({ data, meta });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getCategory = async (req, res) => {
  const { categoryID } = req.params;
  const authDocId = req.user.userId;

  try {
    const user = await getCategoryById(categoryID, authDocId);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const updateCategoryDetails = async (req, res) => {
  const { categoryID } = req.params;
  const authDocId = req.user.userId;

  try {
    const result = await updateCategory(authDocId, categoryID, req.body);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
