  import { db } from "../../config/admin.config.js";
  import bcrypt from "bcrypt";
  import jwt from "jsonwebtoken";
  import dotenv from "dotenv";
  import { uploadImageToCloudinary } from "../../core/utils/imageHandler.js";

  dotenv.config();

  export const signUpUser = async (data, file) => {
    const { userID, email, password, firstName, lastName } = data;

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
      await db.collection("admin").add({
        userID: Number(userID),
        email,
        password: hashedPassword,
        firstName: formattedFirstName,
        lastName: formattedLastName,
        role: "admin",
        status: "Active",
        profileImageUrl,
        createdAt: new Date(),
      });

      return { message: "User created successfully" };
    } catch (error) {
      throw new Error(error.message || "Error creating user");
    }
  };

  export const signInWithEmailAndPassword = async (email, password, role) => {
    try {
      let userSnapshot;
      switch (role) {
        case "admin":
          userSnapshot = await db
            .collection("admin")
            .where("email", "==", email)
            .get();
          break;

        case "user":
          userSnapshot = await db
            .collection("users")
            .where("email", "==", email)
            .get();
          break;

        default:
          throw new Error("Invalid role specified");
      }

      if (userSnapshot.empty) {
        throw new Error("User not found");
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

      const validPassword = await bcrypt.compare(password, userData.password);

      if (!validPassword) {
        throw new Error("Invalid credentials");
      }

      const payload = {
        userId: role === "admin" ? userDoc.id : userData.adminDoc,
        id: userData.userID,
        email,
        role: userData.role,
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

      let userSnapshot;

      switch (decoded.role) {
        case "admin":
          userSnapshot = await db
            .collection("admin")
            .where("email", "==", decoded.email)
            .get();
          break;

        case "user":
          userSnapshot = await db
            .collection("users")
            .where("email", "==", decoded.email)
            .get();
          break;

        default:
          throw new Error("Invalid role specified");
      }

      if (userSnapshot.empty) {
        throw new Error("User not found");
      }

      const userData = userSnapshot.docs[0].data();
      const newToken = jwt.sign(
        {
          userId: decoded.userId,
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const { password, ...otherData } = userData;
      return { token: newToken, userData: otherData };
    } catch (error) {
      throw new Error(error.message || "Failed to refresh token");
    }
  };
