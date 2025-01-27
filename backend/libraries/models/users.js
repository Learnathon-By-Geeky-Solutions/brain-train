import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { 
      type: String, 
      required: true, 
      unique: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    picture: { 
      type: String, 
      default: '' 
    },
    firebaseUid: {
      type: String,
      required: true,
      unique: true
    },
    favouriteRecipes: {
      type: [
        {
          recipeId: { type: String, required: true },
          source: { 
            type: String, 
            required: true, 
            enum: ['spoonacular', 'upload'] // Either spoonacular or user uploaded recipes
          }
        }
      ],
      default: []
    }
  }
);

const User = mongoose.model('User', userSchema);

/**
 * Finds a user by email.
 * @param {string} email - The email of the user.
 * @returns {Object} The user object.
 */
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Finds a user by username.
 * @param {string} username - The username of the user.
 * @returns {Object} The user object.
 */
export const findUserByUsername = async (username) => {
  return await User.findOne({ username });
}

/**
 * Creates a new user
 * @param {Object} userInfo - Contains user information: email, name, picture and uid.
 */
export const createUser = async (userInfo) => {
  const { email, name, picture, uid } = userInfo;
  const user = new User({
    email: email,
    username: name,
    picture: picture,
    firebaseUid: uid,
    favouriteRecipes: []
  });
  await user.save();
};
