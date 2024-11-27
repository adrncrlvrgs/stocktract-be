import { signInWithEmailAndPassword, signUpUser, getUserProfile } from './service.js';

export const signUp = async (req, res) => {
  try {
    const result = await signUpUser(req.body);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log(password)

  try {
    const { token, userData } = await signInWithEmailAndPassword(email, password);
    return res.status(200).json({ token, userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export const getUserProfileController = async (req, res) => {
  try {
    const email = req.user.email;  // `email` is available after the `authenticate` middleware

    const result = await getUserProfile(email);
    return res.status(200).json(result);  // Return the user data
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
