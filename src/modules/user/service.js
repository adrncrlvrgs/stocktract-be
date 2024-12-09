import { db } from "../../config/admin.config.js";
import bcrypt from "bcrypt";
export const createUser = async (props, authDocId) => {
  const { email, password, name, userID, role } = props;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("admin").doc(authDocId).collection("users").add({
      email,
      password: hashedPassword,
      name,
      role: "User",
      status: "Active",
      userID,
      createdAt: new Date(),
    });

    return { message: "User created successfully" };
  } catch (error) {
    throw new Error(error.message || "Error creating user");
  }
};

export const getAllUsers = (authDocId) => {
  try {
    const usersSnapshot = db
      .collection("admin")
      .doc(authDocId)
      .collection("users");

    return usersSnapshot;
  } catch (error) {
    throw new Error(error.message || "Error fetching users");
  }
};

export const getUserById = async (userId, authDocId) => {
  try {
    const userIdAsNumber = Number(userId);
    const userSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("users")
      .where("userID", "==", userIdAsNumber)
      .get();

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      return userDoc.data();
    } else {
      throw new Error("No user found with that userID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error fetching user");
  }
};

export const updateUser = async (authDocId, userId, props) => {
  const { name, email, password } = props;

  try {
    const updateFields = {
      name,
      email,
      updatedAt: new Date(),
    };

    if (password && password !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const userIdAsNumber = Number(userId);
    const userSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("users")
      .where("userID", "==", userIdAsNumber)
      .get();

    if (userSnapshot.empty) {
      throw new Error("No user found with that userID.");
    }

    const userDoc = userSnapshot.docs[0];

    await userDoc.ref.update(updateFields);

    return { message: "User updated successfully" };
  } catch (error) {
    throw new Error(error.message || "Error updating user");
  }
};

export const deleteUser = async (authDocId, userId) => {
  try {
    const userIdAsNumber = Number(userId);

    const userSnapshot = await db
      .collection("admin")
      .doc(authDocId)
      .collection("users")
      .where("userID", "==", userIdAsNumber)
      .get();

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];

      await userDoc.ref.delete();

      return { message: "User deleted successfully" };
    } else {
      throw new Error("No user found with that userID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error deleting user");
  }
};
