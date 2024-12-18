import { db } from "../../config/admin.config.js";

export const createCategory = async (props, authDocId) => {
  const { test, categoryName } = props;
  try {
    await db.collection("admin").doc(authDocId).collection("category").add({
      categoryName,
      status: "Active",
      categoryID,
      createdAt: new Date(),
    });

    return { message: "User created successfully" };
  } catch (error) {
    throw new Error(error.message || "Error creating user");
  }
};

export const getAllCategory = (authDocId)=>{
  try {
    const usersSnapshot = db
      .collection("admin")
      .doc(authDocId)
      .collection("category");

    return usersSnapshot;
  } catch (error) {
    throw new Error(error.message || "Error fetching categories");
  }
}
