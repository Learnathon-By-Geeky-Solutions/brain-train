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
    }
  }, 
  { 
    timestamps: true 
  }
);

const Users = mongoose.model('User', userSchema);

export default Users;
