import { logActivity, getActivityLogs } from "./service.js";

export const logActivity = async (req, res) => {
  try {
    const result = await logActivity(req.body);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const { data, meta } = await generateMeta({
      authDocId: req.user.userId,
      getData: getActivityLogs,
      search: req.query.search,
      limit: req.query.limit || 10,
      page: req.query.page || 1,
      orderBy: req.query.orderBy || "logID",
      order: req.query.order || "asc",
      searchFields: ["logID", "activity"],
    });

    return res.status(200).json({ data, meta });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
