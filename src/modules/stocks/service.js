import { db } from "../../config/admin.config.js";

export const createStock = async (props, authDocId) => {
  const { stockID,companyName, item, quantity, category, price } = props;

  try {
    await db.collection("admin").doc(authDocId).collection("stocks").add({
      stockID,
      companyName,
      item,
      category,
      quantity,
      price,
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
  const { companyName, item, quantity, price } = props;

  try {
    const updateFields = {
      companyName,
      item,
      quantity,
      price,
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
