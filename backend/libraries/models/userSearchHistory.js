import mongoose from "mongoose";
import searchSchema from "./searches.js";

const userSearhHistorySchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true
  },
  history: [searchSchema]
});

const UserSearchHistory = mongoose.model("UserSearchHistory", userSearhHistorySchema);

export default UserSearchHistory;