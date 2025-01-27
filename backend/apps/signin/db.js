import User from "../../libraries/models/users.js";

/**
 * Finds a user by email.
 * @param {string} email - The email of the user.
 * @returns {Object} The user object.
 */
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Creates a new user
 * @param {Object} userInfo - Contains user information: email, name, and picture.
 */
export const createUser = async (userInfo) => {
  const { email, name, picture } = userInfo;
  const user = new User({
    email: email,
    username: name,
    picture,
  });
  await user.save();
};