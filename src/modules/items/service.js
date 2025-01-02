import { db } from "../../config/admin.config.js";
import { updateStockQuantity } from "../stocks/service.js";

export const createItem = async (props, authDocId) => {
  const { itemID, quantity, stockID } = props;

  try {
    await db
      .collection("admin")
      .doc(authDocId)
      .collection("items")
      .add({
        itemID,
        quantity: Number(quantity),
        ...props,
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
