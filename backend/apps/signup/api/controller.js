import { createUser } from '../db.js';

export const signupController = async (req, res) => {
  try {
    const data = req.body;
    const username = data.username;
    const email = data.email;
    await createUser({ email, username });
    return res.status(201).json({ message: 'User created', username: username });
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
