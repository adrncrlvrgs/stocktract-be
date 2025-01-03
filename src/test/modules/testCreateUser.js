import { createUser } from "../../modules/user/service.js";
import dotenv from "dotenv";

dotenv.config();

const testCreateUser = async () => {
  const props = {
    email: "testuser@example.com",
    password: "password123",
    name: "Test User",
    userID: "101010",
    role: "User",
    profileImagePath: "./1x1_pic.png" // Replace with the path to a test image
  };

  const authDocId = "NSKkqMZw5g2PesFKuMTu"; // Replace with a valid authDocId

  try {
    const result = await createUser(props, authDocId);
    console.log(result);
  } catch (error) {
    console.error("Error creating user:", error.message);
  }
};

testCreateUser();