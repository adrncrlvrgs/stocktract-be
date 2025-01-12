import { db } from "../../config/admin.config.js";
import { updateItemQuantity } from "../items/service.js";
import { logActivity } from "../activity-logs/service.js";
import generateId from "../../core/utils/generateID.js";

export const createSale = async (props, authDocId, id) => {
  const { saleID, itemID, item, quantity, totalAmount } = props;

  try {
    const logID = generateId();
    await db.collection("admin").doc(authDocId).collection("sales").add({
      saleID,
      item,
      quantity,
      totalAmount,
      status: "Active",
      createdAt: new Date(),
    });

    await updateItemQuantity(authDocId, itemID, -Number(quantity));

    await logActivity(
      {
        logID: logID,
        userID: id,
        action: "CREATE_SALE",
        details: `Sale '${saleID}' created for item '${item}' `,
      },
      authDocId
    );

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
    const logID = generateId();
    const updateFields = {
      item,
      quantity,
      totalAmount,
      updatedAt: new Date(),
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

      await logActivity(
        {
          logID: logID,
          userID: id,
          action: "UPDATE_SALE",
          details: `Sale '${saleId}' updated with new item '${item}', quantity ${quantity}.`,
        },
        authDocId
      );
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
    const logID = generateId();
    const saleIdAsNumber = Number(saleId);
    const saleSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("sales")
      .where("saleID", "==", saleIdAsNumber)
      .get();

    if (!saleSnapshot.empty) {
      const saleDoc = saleSnapshot.docs[0];
      const saleData = saleDoc.data();
      await saleDoc.ref.delete();

      await logActivity(
        {
          logID: logID,
          userID: id,
          action: "DELETE_SALE",
          details: `Sale '${saleData.saleID}' for item '${saleData.item}' deleted.`,
        },
        authDocId
      );
      
      return { message: "Sale deleted successfully" };
    } else {
      throw new Error("No sale found with that saleID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error deleting sale");
  }
};
