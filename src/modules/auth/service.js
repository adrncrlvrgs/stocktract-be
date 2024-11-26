import { db } from "../../config/admin.config.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// Function to verify the Firebase ID token and return user data
export const signUpUser = async (email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password with salt rounds
    const userRef = db.collection('users').doc(email); // Store using email as document ID
    await userRef.set({
      email,
      password: hashedPassword,
    });

    return { message: 'User created successfully' };
  } catch (error) {
    throw new Error(error.message || 'Error creating user');
  }
};

// Sign in user - validate email and password
export const signInWithEmailAndPassword = async (email, password) => {
  try {
    const userDoc = await db.collection('users').doc(email).get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const validPassword = await bcrypt.compare(password, userData.password); 

    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    // Create JWT token payload
    const payload = {
      email,
      role: userData.role || 'user', // Example role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, userData };
  } catch (error) {
    throw new Error(error.message || 'Failed to sign in');
  }
};
