import { signInWithEmailAndPassword, signUpUser } from './service.js';

// Controller to handle user sign-up
export const signUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await signUpUser(email, password);
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

// Controller to handle user login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, userData } = await signInWithEmailAndPassword(email, password);
    return res.status(200).json({ token, userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};
