import { decodeFirebaseIdToken } from "../../../libraries/services/firebase.js";
import {
  findUserByEmail,
  createUser,
} from "../../../libraries/models/users.js";

export const signinController = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then((userInfo) => {
      return findUserByEmail(userInfo.email).then((user) => ({
        user,
        userInfo,
      }));
    })
    .then(({ user, userInfo }) => {
      if (user) {
        return res
          .status(200)
          .json({ message: "Login successful", username: user.username });
      }

      return createUser(userInfo).then(() =>
        findUserByEmail(userInfo.email).then((newUser) =>
          res
            .status(201)
            .json({ message: "Login successful", username: newUser.username }),
        ),
      );
    })
    .catch((error) => {
      res.status(401).json({ error: error.message });
    });
};
