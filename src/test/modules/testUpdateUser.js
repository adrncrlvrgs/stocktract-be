import { updateUser } from "../../../src/modules/user/service.js";
import dotenv from "dotenv";

dotenv.config();

const testUpdateUser = async () => {
  const authDocId = "NSKkqMZw5g2PesFKuMTu"; // Replace with a valid authDocId
  const userId = "101010"; // Replace with the userID of the user to update

  const props = {
    name: "Updated Test User",
    email: "updatedtestuser@example.com",
    password: "newpassword123",
    profileImagePath: "./pic.png" // Replace with the path to a new test image
  };

  try {
    const result = await updateUser(authDocId, userId, props);
    console.log(result);
  } catch (error) {
    console.error("Error updating user:", error.message);
  }
};

testUpdateUser();