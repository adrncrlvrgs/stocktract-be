import { db } from "../../config/admin.config.js";

export const createSale = async (props, authDocId) => {
  const { saleID, item, quantity, totalAmount } = props;

  try {
    await db.collection("admin").doc(authDocId).collection("sales").add({
      saleID,
      item,
      quantity,
      totalAmount,
      status: "Active",
      createdAt: new Date(),
    });

    return { message: "Sale created successfully" };
  } catch (error) {
    throw new Error(error.message || "Error creating sale");
  }
};

export const getAllSales = (authDocId) => {
  try {
    const salesSnapshot = db
      .collection("admin")
      .doc(authDocId)
      .collection("sales");

    return salesSnapshot;
  } catch (error) {
    throw new Error(error.message || "Error fetching sales");
  }
};

export const getSaleById = async (saleId, authDocId) => {
  try {
    const saleIdAsNumber = Number(saleId);
    const saleSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("sales")
      .where("saleID", "==", saleIdAsNumber)
      .get();

    if (!saleSnapshot.empty) {
      const saleDoc = saleSnapshot.docs[0];
      return saleDoc.data();
    } else {
      throw new Error("No sale found with that saleID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error fetching sale");
  }
};

export const updateSale = async (authDocId, saleId, props) => {
  const { item, quantity, totalAmount } = props;

  try {
    const updateFields = {
      item,
      quantity,
      totalAmount,
    };

    const saleIdAsNumber = Number(saleId);
    const saleSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("sales")
      .where("saleID", "==", saleIdAsNumber)
      .get();

    if (!saleSnapshot.empty) {
      const saleDoc = saleSnapshot.docs[0];
      await saleDoc.ref.update(updateFields);
      return { message: "Sale updated successfully" };
    } else {
      throw new Error("No sale found with that saleID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error updating sale");
  }
};

export const deleteSale = async (authDocId, saleId) => {
  try {
    const saleIdAsNumber = Number(saleId);
    const saleSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("sales")
      .where("saleID", "==", saleIdAsNumber)
      .get();

    if (!saleSnapshot.empty) {
      const saleDoc = saleSnapshot.docs[0];
      await saleDoc.ref.update({ status: "Deleted" });
      return { message: "Sale deleted successfully" };
    } else {
      throw new Error("No sale found with that saleID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error deleting sale");
  }
};
