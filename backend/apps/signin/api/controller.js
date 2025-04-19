import { decodeFirebaseIdToken } from "../../../libraries/services/firebase.js";
import {
  findUserByEmail,
  createUser,
} from "../../../libraries/models/users.js";

export const signinController = (req, res) => {
  decodeFirebaseIdToken(req.headers.authorization)
    .then((userInfo) => {
      if (!userInfo) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }

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
            .status(200)
            .json({ message: "Login successful", username: newUser.username }),
        ),
      );
    })
    .catch((error) => {
      console.error("Login error:", error.message);
      res.status(500).json({ error: "Internal server error" });
    });
};
