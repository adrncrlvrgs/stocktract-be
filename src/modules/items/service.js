import { db } from "../../config/admin.config.js";
import { updateStockQuantity } from "../stocks/service.js";
import { uploadImageToCloudinary } from "../../core/utils/imageHandler.js";

export const createItem = async (props, authDocId) => {
  const { itemID, stockID, quantity, imagePaths, ...rest } = props;

  try {
    let imageUrls = [];

    if (imagePaths && imagePaths.length > 0) {
      imageUrls = await Promise.all(
        imagePaths.map((imagePath) =>
          uploadImageToCloudinary(imagePath, "itemImages")
        )
      );
    }
    await db
      .collection("admin")
      .doc(authDocId)
      .collection("items")
      .add({
        itemID,
        imageUrls,        
        quantity: Number(quantity),
        ...rest,
        status: "Active",
        createdAt: new Date(),
      });

    await updateStockQuantity(authDocId, stockID, -Number(quantity));
    return { message: "Item created successfully" };
  } catch (error) {
    throw new Error(error.message || "Error creating item");
  }
};

export const getAllItems = (authDocId) => {
  try {
    const itemsSnapshot = db
      .collection("admin")
      .doc(authDocId)
      .collection("items");

    return itemsSnapshot;
  } catch (error) {
    throw new Error(error.message || "Error fetching items");
  }
};

export const getItemById = async (itemId, authDocId) => {
  try {
    const itemIdAsNumber = Number(itemId);
    const itemSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("items")
      .where("itemID", "==", itemIdAsNumber)
      .get();

    if (!itemSnapshot.empty) {
      const itemDoc = itemSnapshot.docs[0];
      return itemDoc.data();
    } else {
      throw new Error("No item found with that itemID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error fetching item");
  }
};

export const updateItem = async (authDocId, itemId, props) => {
  const { name, category, quantity } = props;

  try {
    const updateFields = {
      ...props,
      updatedAt: new Date(),
    };

    const itemIdAsNumber = Number(itemId);
    const itemSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("items")
      .where("itemID", "==", itemIdAsNumber)
      .get();

    if (!itemSnapshot.empty) {
      const itemDoc = itemSnapshot.docs[0];
      await itemDoc.ref.update(updateFields);
      return { message: "Item updated successfully" };
    } else {
      throw new Error("No item found with that itemID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error updating item");
  }
};

export const deleteItem = async (authDocId, itemId) => {
  try {
    const itemIdAsNumber = Number(itemId);
    const itemSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("items")
      .where("itemID", "==", itemIdAsNumber)
      .get();

    if (!itemSnapshot.empty) {
      const itemDoc = itemSnapshot.docs[0];
      await itemDoc.ref.delete();
      return { message: "Item deleted successfully" };
    } else {
      throw new Error("No item found with that itemID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error deleting item");
  }
};
