import { db } from "../../config/admin.config.js";

export const createUser = async (props) => {
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

export const getAllUsers = async () => {
  try {
    const usersSnapshot = await db.collection("users").get();
    const users = usersSnapshot.docs.map(doc => doc.data());
    return users;
  } catch (error) {
    throw new Error(error.message || "Error fetching users");
  }
};

export const getUserById = async (userId) => {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      throw new Error("User not found");
    }
    return userDoc.data();
  } catch (error) {
    throw new Error(error.message || "Error fetching user");
  }
};

export const updateUser = async (userId, props) => {
  const { name, role } = props;

  try {
    await db.collection("users").doc(userId).update({
      name,
      role,
      updatedAt: new Date(),
    });

    return { message: "User updated successfully" };
  } catch (error) {
    throw new Error(error.message || "Error updating user");
  }
};

export const deleteUser = async (userId) => {
  try {
    await db.collection("users").doc(userId).delete();
    return { message: "User deleted successfully" };
  } catch (error) {
    throw new Error(error.message || "Error deleting user");
  }
};
