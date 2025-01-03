import { db } from "../../config/admin.config.js";

export const createStock = async (props, authDocId) => {
  const { stockID, supplier, item, totalQuantity, category, totalCost } = props;

  try {
    await db
      .collection("admin")
      .doc(authDocId)
      .collection("stocks")
      .add({
        stockID,
        supplier,
        item,
        category,
        totalQuantity: Number(totalQuantity),
        totalCost,
        status: "Active",
        createdAt: new Date(),
      });

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

export const updateStock = async (authDocId, stockId, props) => {
  try {
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
      return { message: "Stock updated successfully" };
    } else {
      throw new Error("No stock found with that stockID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error updating stock");
  }
};

export const deleteStock = async (authDocId, stockId) => {
  try {
    const stockSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("stocks")
      .where("stockID", "==", Number(stockId))
      .get();

    if (!stockSnapshot.empty) {
      const stockDoc = stockSnapshot.docs[0];
      await stockDoc.ref.delete();
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
      const newStock = currentStock + quantity;

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
