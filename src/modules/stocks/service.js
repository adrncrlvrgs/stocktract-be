import { db } from "../../config/admin.config.js";
import { logActivity } from "../activity-logs/service.js";
import generateId from "../../core/utils/generateID.js";

export const createStock = async (props, authDocId, id) => {
  const { stockID, item, category, totalQuantity, totalCost, ...rest } = props;

  console.log(props);
  try {
    const logID = generateId();
    await db
      .collection("admin")
      .doc(authDocId)
      .collection("stocks")
      .add({
        stockID,
        item,
        totalQuantity: Number(totalQuantity),
        totalCost: Number(totalCost),
        ...rest,
        createdAt: new Date(),
      });

    await logActivity(
      {
        logID: logID,
        userID: id,
        action: "CREATE_STOCK",
        details: `Stock '${item}' with ID ${stockID} created in category '${category}'.`,
      },
      authDocId
    );

    return { message: "Stock created successfully" };
  } catch (error) {
    throw new Error(error.message || "Error creating stock");
  }
};

export const getAllStocks = (authDocId) => {
  try {
    const stocksSnapshot = db
      .collection("admin")
      .doc(authDocId)
      .collection("stocks");

    return stocksSnapshot;
  } catch (error) {
    throw new Error(error.message || "Error fetching stocks");
  }
};

export const getStockById = async (stockId, authDocId) => {
  try {
    const stockIdAsNumber = Number(stockId);
    const stockSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("stocks")
      .where("stockID", "==", stockIdAsNumber)
      .get();

    if (!stockSnapshot.empty) {
      const stockDoc = stockSnapshot.docs[0];
      return stockDoc.data();
    } else {
      throw new Error("No stock found with that stockID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error fetching stock");
  }
};

export const updateStock = async (authDocId, stockId, props, id) => {
  try {
    const logID = generateId();
    const updateFields = {
      ...props,
      updatedAt: new Date(),
    };

    const stockSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("stocks")
      .where("stockID", "==", Number(stockId))
      .get();

    if (!stockSnapshot.empty) {
      const stockDoc = stockSnapshot.docs[0];
      await stockDoc.ref.update(updateFields);
      await logActivity(
        {
          logID,
          userID: id,
          action: "UPDATE_STOCK",
          details: `Stock with ID ${stockId} updated.`,
        },
        authDocId
      );
      return { message: "Stock updated successfully" };
    } else {
      throw new Error("No stock found with that stockID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error updating stock");
  }
};

export const deleteStock = async (authDocId, stockId, id) => {
  try {
    const logID = generateId();
    const stockSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("stocks")
      .where("stockID", "==", Number(stockId))
      .get();

    if (!stockSnapshot.empty) {
      const stockDoc = stockSnapshot.docs[0];
      const stockData = stockDoc.data();
      await stockDoc.ref.delete();

      await logActivity(
        {
          logID,
          userID: id,
          action: "DELETE_STOCK",
          details: `Stock '${stockData.item}' with ID ${stockId} deleted.`,
        },
        authDocId
      );
      return { message: "Stock deleted successfully" };
    } else {
      throw new Error("No stock found with that stockID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error deleting stock");
  }
};

export const updateStockQuantity = async (authDocId, stockId, quantity) => {
  try {
    const stockSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("stocks")
      .where("stockID", "==", Number(stockId))
      .get();

    if (!stockSnapshot.empty) {
      const stockDoc = stockSnapshot.docs[0];
      const currentStock = stockDoc.data().totalQuantity;
      const newStock = (currentStock || 0) + quantity;

      if (newStock < 0) {
        throw new Error("Insufficient stock available");
      }

      await stockDoc.ref.update({ totalQuantity: newStock });
    } else {
      throw new Error("Stock item not found");
    }
  } catch (error) {
    throw new Error(error.message || "Error updating stock quantity");
  }
};
