import {
  signInWithEmailAndPassword,
  signUpUser,
  getUserProfile,
  refreshUserToken,
} from "./service.js";

export const signUp = async (req, res) => {
  try {
    const result = await signUpUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, userData } = await signInWithEmailAndPassword(
      email,
      password
    );
    return res.status(200).json({ token, userData });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getUserProfileController = async (req, res) => {
  try {
    const email = req.user.email;

    const { userData } = await getUserProfile(email);
    return res.status(200).json({ userData });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const refreshToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token must be provided" });
  }
  try {
    const { token: newToken, userData } = await refreshUserToken(token);

    return res.status(200).json({
      token: newToken,
      userData,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
};
