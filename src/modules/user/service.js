import { db } from "../../config/admin.config.js";
import bcrypt from "bcrypt";
import {
  uploadImageToCloudinary,
  updateImageInCloudinary,
  deleteImageFromCloudinary,
} from "../../core/utils/imageHandler.js";

export const createUser = async (props, user, file) => {
  const { email, password, name, userID, firstName, lastName } = props;
  const authDocId = user.userId;

  const formattedFirstName =
  firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
const formattedLastName =
  lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImageUrl = "";
    if (file) {
      profileImageUrl = await uploadImageToCloudinary(
        file.buffer,
        "profileImages",
        userID
      );
    }
    await db.collection("users").add({
      email,
      password: hashedPassword,
      firstName: formattedFirstName,
      lastName: formattedLastName,
      role: "user",
      status: "Active",
      userID: Number(userID),
      adminDoc: authDocId,
      profileImageUrl,
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
      .collection("users")
      .where("adminDoc", "==", authDocId);

    return usersSnapshot;
  } catch (error) {
    throw new Error(error.message || "Error fetching users");
  }
};

export const getUserById = async (userId, user) => {
  const authDocId = user.userId;
  try {
    const userIdAsNumber = Number(userId);
    const userSnapshot = await db
      .collection("users")
      .where("adminDoc", "==", authDocId)
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

export const updateUser = async (user, userId, props, file) => {
  const { name, email, password } = props;
  const authDocId = user.userId;

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
      .collection("users")
      .where("adminDoc", "==", authDocId)
      .where("userID", "==", userIdAsNumber)
      .get();

    if (userSnapshot.empty) {
      throw new Error("No user found with that userID.");
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    if (file) {
      const publicId = userData.profileImageUrl
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

      const newProfileImageUrl = await updateImageInCloudinary(
        publicId,
        file.buffer
      );
      updateFields.profileImageUrl = newProfileImageUrl;
    }

    await userDoc.ref.update(updateFields);

    return { message: "User updated successfully" };
  } catch (error) {
    throw new Error(error.message || "Error updating user");
  }
};

export const deleteUser = async (user, userId) => {
  const authDocId = user.userId;
  try {
    const userIdAsNumber = Number(userId);

    const userSnapshot = await db
      .collection("users")
      .where("adminDoc", "==", authDocId)
      .where("userID", "==", userIdAsNumber)
      .get();

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

      if (userData.profileImageUrl) {
        const publicId = userData.profileImageUrl
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        await deleteImageFromCloudinary(publicId);
      }

      await userDoc.ref.delete();

      return { message: "User and profile image deleted successfully" };
    } else {
      throw new Error("No user found with that userID.");
    }
  } catch (error) {
    throw new Error(error.message || "Error deleting user");
  }
};
