import Users from "../../libraries/models/users.js";

export const createUser = async (userInfo) => {
  const { email, username } = userInfo;
  let user = new Users({
    email: email,
    username: username || 'Anonymous',
    picture: ''
  });
  await user.save();
  return user;
}