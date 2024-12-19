import { db } from "../../config/admin.config.js";

export const createCategory = async (props, authDocId) => {
  const { name, categoryID, status } = props;
  try {
    await db.collection("admin").doc(authDocId).collection("category").add({
      name,
      status,
      categoryID,
      createdAt: new Date(),
    });

    return { message: "Category created successfully" };
  } catch (error) {
    throw new Error(error.message || "Error creating user");
  }
};

export const getAllCategory = (authDocId) => {
  try {
    const usersSnapshot = db
      .collection("admin")
      .doc(authDocId)
      .collection("category");

    return usersSnapshot;
  } catch (error) {
    throw new Error(error.message || "Error fetching categories");
  }
};

export const getCategoryById = async (categoryId, authDocId) => {
  try {
    const categoryIdAsNumber = Number(categoryId);
    const categorySnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("category")
      .where("categoryID", "==", categoryIdAsNumber)
      .get();

    if (!categorySnapshot.empty) {
      const categoryDoc = categorySnapshot.docs[0];
      return categoryDoc.data();
    } else {
      throw new Error("No category found with that categoryID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error fetching user");
  }
};
