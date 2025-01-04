import { deleteItem } from "../../../src/modules/items/service.js";
import dotenv from "dotenv";

dotenv.config();

const testDeleteItem = async () => {
  const authDocId = "NSKkqMZw5g2PesFKuMTu"; 
  const itemId = "101010";

  try {
    const result = await deleteItem(authDocId, itemId);
  } catch (error) {
    console.error("Error deleting item:", error.message);
  }
};

testDeleteItem();