import { updateItem } from "../../../src/modules/items/service.js";
import dotenv from "dotenv";

dotenv.config();

const testUpdateItem = async () => {
  const authDocId = "NSKkqMZw5g2PesFKuMTu"; 
  const itemId = 101010; 

  const props = {
    item: "Updated Test Item",
    description: "This is an updated test item",
    price: 150,
    quantity: 20,
    imagePaths: ["./download.png"] 
  };

  try {
    const result = await updateItem(authDocId, itemId, props);
    console.log(result);
  } catch (error) {
    console.error("Error updating item:", error.message);
  }
};

testUpdateItem();