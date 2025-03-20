import { findUserByUsername } from "../../../libraries/models/users.js";

export const usernameValidator = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await findUserByUsername(username);
    if (user) {
      return res.status(409).json({ error: 'Username already exists', available: false });
    }
    return res.status(200).json({ message: 'Username available', available: true });
  } catch (error) {
    console.error('Username validation error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}