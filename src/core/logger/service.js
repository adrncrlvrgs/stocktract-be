import { db } from "../../config/admin.config";

export const logActivity = async (props, authDocId) => {
  const { logID ,userID, action, details } = props;
  try {
    const log = {
      logID,
      userID,
      action,
      details,
      timestamp: new Date(),
    };
    await db.collection("activityLogs").add(log);
    return { message: "Activity logged successfully" };
  } catch (error) {
    throw new Error(error.message || "Error logging activity");
  }
};

export const getActivityLogs = (authController) => {
  try {
    const activityLogsSnapshot = db
      .collection("admin")
      .doc(authController)
      .collection("activityLogs");
    return activityLogsSnapshot;
  } catch (error) {
    throw new Error(error.message || "Error fetching activity logs");
  }
};
