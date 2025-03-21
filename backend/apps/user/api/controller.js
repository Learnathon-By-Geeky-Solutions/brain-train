import { findUserByUsername } from "../../../libraries/models/users.js";

export const usernameValidator = (req, res) => {
  const { username } = req.body;

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
