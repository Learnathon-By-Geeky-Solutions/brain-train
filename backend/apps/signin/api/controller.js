import { decodeFirebaseIdToken } from '../../../libraries/firebase.js';
import { getUser } from '../db.js';

export const signinController = async (req, res) => {
  try {
    const { authorization } = req.headers;

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const idToken = authorization.split(' ')[1];
    const userInfo = await decodeFirebaseIdToken(idToken);
    const user = await getUser({
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    });

    return res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
