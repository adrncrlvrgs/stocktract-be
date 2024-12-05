import { db } from "../../config/admin.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const signUpUser = async (data) => {
  const { userID, email, password, name, role } = data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("users").add({
      userID: userID,
      email,
      password: hashedPassword,
      name,
      role,
      status: "Active",
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
      .collection("admin")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      throw new Error("User not found");
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    const validPassword = await bcrypt.compare(password, userData.password);

    if (!validPassword) {
      console.log("Password comparison failed");
      throw new Error("Invalid credentials");
    }

    const payload = {
      userId: userDoc.id,
      email,
      role: userData.role || "user",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...otherData } = userData;

    return { token, userData: otherData };
  } catch (error) {
    throw new Error(error.message || "Failed to sign in");
  }
};

export const getUserProfile = async (email) => {
  try {
    const userDoc = await db.collection("users").doc(email).get();

    if (!userDoc.exists) {
      throw new Error("User not found");
    }

    const { password: _, ...otherData } = userData;

    return { userData: otherData };
  } catch (error) {
    throw new Error(error.message || "Error retrieving user profile");
  }
};

export const refreshUserToken = async (oldToken) => {
  try {
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET);
    const userSnapshot = await db
      .collection("admin")
      .where("email", "==", decoded.email)
      .get();

    if (userSnapshot.empty) {
      throw new Error("User not found");
    }

    const userData = userSnapshot.docs[0].data();
    const newToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password, ...otherData } = userData;
    return { token: newToken, userData: otherData };
  } catch (error) {
    throw new Error(error.message || "Failed to refresh token");
  }
};
