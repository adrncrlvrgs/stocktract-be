import { db } from "../../config/admin.config.js";

export const logActivity = async (props, authDocId) => {
  const { logID, userID, action, details } = props;
  try {
    const log = {
      logID,
      userID,
      action,
      details,
      timestamp: new Date(),
    };


    const activityLogsRef = db
      .collection("admin")
      .doc(authDocId)
      .collection("activityLogs");


    const activityLogsSnapshot = await activityLogsRef.get();
    const logCount = activityLogsSnapshot.size;

    if (logCount >= 500) {
      const oldestLogsQuery = activityLogsRef
        .orderBy("timestamp", "asc")
        .limit(250);

      const oldestLogsSnapshot = await oldestLogsQuery.get();
      const batch = db.batch();

      oldestLogsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    }

    await activityLogsRef.add(log);

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
