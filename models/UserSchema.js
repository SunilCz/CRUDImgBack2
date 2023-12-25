import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  // If you don't need password anymore, you can remove the following lines
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", userSchema);

export default User;
