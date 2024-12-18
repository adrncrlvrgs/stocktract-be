import { db } from "../../config/admin.config.js";
import bcrypt from "bcrypt";

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
