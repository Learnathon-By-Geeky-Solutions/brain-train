import { findUserByUsername } from "../../../libraries/models/users.js";

export const usernameValidator = (req, res) => {
  let { username } = req.body;
  username = username.toString().trim();
  const isValidUsername = /^[a-zA-Z][a-zA-Z0-9 _-]{3,29}$/.test(username);
  if (!isValidUsername) {
    return res.status(400).json({ error: 'Invalid username format', available: false });
  }

  findUserByUsername(username)
    .then(user => {
      if (user) {
        return res.status(409).json({ error: 'Username already exists', available: false });
      }
      res.status(200).json({ message: 'Username available', available: true });
    })
    .catch(error => {
      console.error('Username validation error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    });
};
