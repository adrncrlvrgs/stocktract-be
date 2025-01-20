import { db } from "../../config/admin.config.js";
import { updateStockQuantity } from "../stocks/service.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  deleteFolderFromCloudinary,
} from "../../core/utils/imageHandler.js";
import { logActivity } from "../activity-logs/service.js";
import generateId from "../../core/utils/generateID.js";

export const createItem = async (props, user, files) => {
  const { itemID, stockID, quantity, price, imagePaths, tags, ...rest } = props;
  const tagsArray = typeof tags === "string" ? tags.split(",") : [];
  const authDocId = user.userId;
  const id = user.id;
  let imageUrls = [];

  try {
    const logID = generateId();

    if (files && files.length > 0) {
      imageUrls = await Promise.all(
        files.map(async (file, index) => {
          const publicId = `${itemID}_${index}`;
          const folder = `itemImages/${itemID}`;
          return await uploadImageToCloudinary(file.buffer, folder, publicId);
        })
      );
    }
    await db
      .collection("admin")
      .doc(authDocId)
      .collection("items")
      .add({
        itemID: Number(itemID),
        imageUrls,
        quantity: Number(quantity),
        price: Number(price),
        tags: tagsArray,
        ...rest,
        status: "Available",
        createdAt: new Date(),
      });

    await updateStockQuantity(authDocId, stockID, -Number(quantity));

    await logActivity(
      {
        logID: logID,
        userID: id,
        action: "CREATE_ITEM",
        details: `Item '${rest.item}' with ID ${itemID} created.`,
      },
      authDocId
    );
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

export const updateItem = async (authDocId, itemId, props, files, id) => {
  const { quantity, price, existingImages, ...rest } = props;

  try {
    const logID = generateId();
    const updateFields = {
      ...rest,
      quantity: Number(quantity),
      price: Number(price),
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

    const existingImageUrls = itemData.imageUrls || [];

    const lastIndex = existingImageUrls.reduce((maxIndex, url) => {
      const parts = url.split("/");
      const fileName = parts[parts.length - 1].split(".")[0];
      const index = parseInt(fileName.split("_")[1], 10);
      return Math.max(maxIndex, index);
    }, -1);

    let newImageUrls = [];
    if (files && files.length > 0) {
      newImageUrls = await Promise.all(
        files.map(async (file, index) => {
          const newIndex = lastIndex + 1 + index;
          const publicId = `${itemId}_${newIndex}`;
          const folder = `itemImages/${itemId}`;
          return await uploadImageToCloudinary(file.buffer, folder, publicId);
        })
      );
    }

    const updatedImageUrls = [...(existingImages || []), ...newImageUrls];

    const deletedImages = existingImageUrls.filter(
      (url) => !updatedImageUrls.includes(url)
    );

    const deletedPublicIds = deletedImages.map((url) => {
      const parts = url.split("/");
      const folder = parts[parts.length - 2];
      const fileName = parts[parts.length - 1].split(".")[0];
      return `itemImages/${folder}/${fileName}`;
    });

    if (deletedPublicIds.length > 0) {
      await deleteImageFromCloudinary(deletedPublicIds);
    }

    updateFields.imageUrls = updatedImageUrls;

    await itemDoc.ref.update(updateFields);

    await logActivity(
      {
        logID: logID,
        userID: id,
        action: "UPDATE_ITEM",
        details: `Item '${rest.item}' with ID ${itemId} updated.`,
      },
      authDocId
    );

    return { message: "Item updated successfully" };
  } catch (error) {
    throw new Error(error.message || "Error updating item");
  }
};

export const deleteItem = async (authDocId, itemId, id) => {
  const logID = generateId();
  const itemIdAsNumber = Number(itemId);

  try {
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

    if (itemData.imageUrls && itemData.imageUrls.length > 0) {
      const publicIds = itemData.imageUrls
        .map((url) => {
          try {
            if (!url.startsWith("http")) {
              throw new Error(`Invalid URL: ${url}`);
            }

            const parts = url.split("/");
            const folder = parts[parts.length - 2];
            const fileName = parts[parts.length - 1].split(".")[0];
            return `itemImages/${folder}/${fileName}`;
          } catch (error) {
            console.error(`Error parsing URL ${url}:`, error.message);
            return null;
          }
        })
        .filter((publicId) => publicId !== null);

      await deleteImageFromCloudinary(publicIds);

      const folderPath = publicIds[0].split("/").slice(0, 2).join("/");

      await deleteFolderFromCloudinary(folderPath);
    }

    await itemDoc.ref.delete();

    await logActivity(
      {
        logID: logID,
        userID: id,
        action: "DELETE_ITEM",
        details: `Item '${itemData.name}' with ID ${itemId} deleted.`,
      },
      authDocId
    );

    return { message: "Item, images, and folder deleted successfully" };
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
};
