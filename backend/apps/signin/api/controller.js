import { decodeFirebaseIdToken } from '../../../libraries/firebase.js';
import { findUserByEmail, createUser } from '../db.js';

export const signinController = async (req, res) => {
  try {
    const { authorization } = req.headers;

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const idToken = authorization.split(' ')[1];
    const userInfo = await decodeFirebaseIdToken(idToken);
    if (!userInfo) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    let user = await findUserByEmail(userInfo.email);
    if (!user) {
      await createUser(userInfo);
      user = await findUserByEmail(userInfo.email);  
    }
    console.log("🚀 ~ signinController ~ username:", user.username)
    return res.status(200).json({ message: 'Login successful', username: user.username });
    
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
