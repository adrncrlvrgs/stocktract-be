import { deleteUser } from "../../modules/user/service.js";
import dotenv from "dotenv";
dotenv.config();

const testDeleteUser = async () => {
  const authDocId = "NSKkqMZw5g2PesFKuMTu"; // Replace with a valid authDocId
  const userId = "101010"; // Replace with the userID of the user to delete

  try {
    const result = await deleteUser(authDocId, userId);
    console.log(result);
  } catch (error) {
    console.error("Error deleting user:", error.message);
  }
};

testDeleteUser();