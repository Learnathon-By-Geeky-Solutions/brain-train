import { decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';
import { findUserByEmail, createUser } from '../../../libraries/models/users.js';

export const signinController = async (req, res) => {
  try {
    const userInfo = await decodeFirebaseIdToken(req.headers.authorization);  // Now the method handles the Bearer extraction

    if (!userInfo) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    let user = await findUserByEmail(userInfo.email);
    if (!user) {
      await createUser(userInfo);
      user = await findUserByEmail(userInfo.email);  
    }

    return res.status(200).json({ message: 'Login successful', username: user.username });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
