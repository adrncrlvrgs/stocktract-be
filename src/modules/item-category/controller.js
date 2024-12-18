import { createCategory } from "./service.js";

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