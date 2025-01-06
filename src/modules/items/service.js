import { db } from "../../config/admin.config.js";
import { updateStockQuantity } from "../stocks/service.js";
import {
  uploadImageToCloudinary,
  updateImageInCloudinary,
  deleteImageFromCloudinary,
} from "../../core/utils/imageHandler.js";
import path from "path";

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
  const { imagePaths, ...rest } = props;

  try {
    const updateFields = {
      ...rest,
      updatedAt: new Date(),
    };

    const itemIdAsNumber = Number(itemId);
    const itemSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("items")
      .where("itemID", "==", itemIdAsNumber)
      .get();

    if (itemSnapshot.empty) {
      throw new Error("No item found with that itemID.");
    }

    const itemDoc = itemSnapshot.docs[0];
    const itemData = itemDoc.data();

    if (imagePaths && imagePaths.length > 0) {
      const existingImageUrls = itemData.imageUrls || [];
      const publicIds = existingImageUrls.map(
        (url) => url.split("/").slice(-2).join("/").split(".")[0]
      );

      const newImageUrls = await Promise.all(
        imagePaths.map((imagePath, index) => {
          if (index < publicIds.length) {
            return updateImageInCloudinary(publicIds[index], imagePath);
          } else {
            return uploadImageToCloudinary(imagePath, "itemImages");
          }
        })
      );

      if (imagePaths.length < existingImageUrls.length) {
        const extraPublicIds = publicIds.slice(imagePaths.length);
        await Promise.all(
          extraPublicIds.map((publicId) => deleteImageFromCloudinary(publicId))
        );
      }

      updateFields.imageUrls = newImageUrls;
    }

    await itemDoc.ref.update(updateFields);

    return { message: "Item updated successfully" };
  } catch (error) {
    console.error("Error updating item:", error.message);
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
      const itemData = itemDoc.data();

      if (itemData.imageUrls && itemData.imageUrls.length > 0) {
        const publicIds = itemData.imageUrls.map(
          (url) => url.split("/").slice(-2).join("/").split(".")[0]
        );
        await Promise.all(
          publicIds.map((publicId) => deleteImageFromCloudinary(publicId))
        );
      }

      await itemDoc.ref.delete();

      return { message: "Item and images deleted successfully" };
    } else {
      throw new Error("No item found with that itemID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error deleting item");
  }
};

export const updateItemQuantity = async (authDocId, itemId, quantity) => {
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
      const itemData = itemDoc.data();
      const currentQuantity = itemData.quantity;
      const newQuantity = (Number(currentQuantity) || 0) + Number(quantity);

      if (newQuantity < 0) {
        throw new Error("Insufficient quantity available");
      }

      await itemDoc.ref.update({ quantity: newQuantity });
    } else {
      throw new Error("Item not found");
    }
  } catch (error) {
    throw new Error(error.message || "Error updating item quantity");
  }
}
