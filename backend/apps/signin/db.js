import Users from "../../libraries/models/users.js";

/**
 * Finds a user by email. If the user does not exist, creates one.
 * Returns only the username of the user.
 * @param {Object} userInfo - Contains user information: email, name, and picture.
 * @returns {Object} An object containing the username of the user.
 */
export const getUser = async (userInfo) => {
  const { email } = userInfo;
  let user = await Users.findOne({ email });
  if (!user) {
    user = await createUser(userInfo);
  }
  return { username: user.username };
};

/**
 * Creates a new user in the database.
 * @param {Object} userInfo - Contains user information: email, name, and picture.
 * @returns {Object} The newly created user.
 */
export const createUser = async (userInfo) => {
  const { email, name, picture } = userInfo;
  const user = new Users({
    email: email,
    username: name || "Anonymous",
    picture: picture || "",
  });
  await user.save();
  return user;
};
