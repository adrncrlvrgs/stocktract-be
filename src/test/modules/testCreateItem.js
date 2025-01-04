import { createItem } from "../../../src/modules/items/service.js";
import dotenv from "dotenv";

dotenv.config();

const testCreateItem = async () => {
  const authDocId = "NSKkqMZw5g2PesFKuMTu"; 

  const props = {
    itemID: 101010,
    quantity: 10,
    stockID: 820062,
    imagePaths: ["./1x1_pic.png", "./update.png"], 
    item: "Test Item",
    description: "This is a test item",
    price: 100
  };

  try {
    const result = await createItem(props, authDocId);
    console.log(result);
  } catch (error) {
    console.error("Error creating item:", error.message);
  }
};

testCreateItem();