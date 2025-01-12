import { db } from "../../config/admin.config.js";
import { logActivity } from "../activity-logs/service.js";
import generateId from "../../core/utils/generateID.js";

export const createCategory = async (props, authDocId, id) => {
  const { name, categoryID, status } = props;
  console.log(id)
  try {
    const logID = generateId()
    await db.collection("admin").doc(authDocId).collection("category").add({
      name,
      status: "Active",
      categoryID,
      createdAt: new Date(),
    });

    await logActivity(
      {
        logID: logID,
        userID: id,
        action: "CREATE_CATEGORY",
        details: `Category '${name}' with ID ${categoryID} created.`,
      },
      authDocId
    );

    return { message: "Category created successfully" };
  } catch (error) {
    throw new Error(error.message || "Error creating user");
  }
};

export const getAllCategory = (authDocId) => {
  try {
    const categorySnapshot = db
      .collection("admin")
      .doc(authDocId)
      .collection("category");

    return categorySnapshot;
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

export const updateCategory = async (authDocId, categoryId, props, id) => {
  const { name } = props;
  try {
    const logID = generateId();
    const updateFields = {
      name,
      updatedAt: new Date(),
    };

    const categoryIdAsNumber = Number(categoryId);
    const categorySnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("category")
      .where("categoryID", "==", categoryIdAsNumber)
      .get();

    if (!categorySnapshot.empty) {
      const categoryDoc = categorySnapshot.docs[0];

      await categoryDoc.ref.update(updateFields);

      await logActivity(
        {
          logID: logID,
          userID: id,
          action: "UPDATE_CATEGORY",
          details: `Category '${name}' with ID ${categoryId} updated.`,
        },
        authDocId
      );
      return { message: "Category updated successfully" };
    } else {
      throw new Error("No category found with that categoryID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error updating category");
  }
};

export const deleteCategory = async (authDocId, categoryId, id) => {
  try {
    const logID = generateId();
    const categoryIdAsNumber = Number(categoryId);
    const categorySnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("category")
      .where("categoryID", "==", categoryIdAsNumber)
      .get();

    if (!categorySnapshot.empty) {
      const categoryDoc = categorySnapshot.docs[0];
      const categoryData = categoryDoc.data();

      await categoryDoc.ref.delete();

      await logActivity(
        {
          logID: logID,
          userID: id,
          action: "DELETE_CATEGORY",
          details: `Category '${categoryData.name}' with ID ${categoryId} deleted.`,
        },
        authDocId
      );

      return { message: "Category deleted successfully" };
    } else {
      throw new Error("No Category found with that categoryID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error deleting Category");
  }
};
