import { db } from "../../config/admin.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signUpUser = async (props) => {
  const { email, password, name, role } = props;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("users").add({
      email,
      password: hashedPassword,
      name,
      role,
      createdAt: new Date(),
    });

    return { message: "User created successfully" };
  } catch (error) {
    throw new Error(error.message || "Error creating user");
  }
};

export const signInWithEmailAndPassword = async (email, password) => {
  try {
    // Query Firestore collection for the user based on email
    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      throw new Error("User not found");
    }

    const userDoc = userSnapshot.docs[0]; // Get the first matching document
    const userData = userDoc.data();

    const validPassword = await bcrypt.compare(password, userData.password);

    if (!validPassword) {
      console.log("Password comparison failed");
      throw new Error("Invalid credentials");
    }

    const payload = {
      email,
      role: userData.role || "user",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return { token, userData };
  } catch (error) {
    console.error("Error signing in: ", error);
    throw new Error(error.message || "Failed to sign in");
  }
};

export const getUserProfile = async (email) => {
  try {
    const userDoc = await db.collection("users").doc(email).get();

    if (!userDoc.exists) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    return { userData };
  } catch (error) {
    throw new Error(error.message || "Error retrieving user profile");
  }
};
