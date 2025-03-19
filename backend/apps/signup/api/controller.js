import { decodeFirebaseIdToken } from '../../../libraries/services/firebase.js';
import { createUser } from '../../../libraries/models/users.js';

export const signupController = async (req, res) => {
  try {
    const { uid } = await decodeFirebaseIdToken(req.headers.authorization);
    const { name, email } = req.body;
    const userInfo = {
      email: email,
      name: name,
      picture: '',
      uid: uid
    }
    await createUser(userInfo);
    return res.status(201).json({ message: 'User created' });
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
