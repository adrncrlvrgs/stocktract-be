import { db } from "../../config/admin.config.js";

export const createItem = async (props, authDocId) => {
  const { categoryID, name, status } = props;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("admin").doc(authDocId).collection("items").add({
      category,
      createdAt: new Date(),
    });

    return { message: "Item created successfully" };
  } catch (error) {
    throw new Error(error.message || "Error creating item");
  }
};
