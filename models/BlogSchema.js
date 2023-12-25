import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model("blog", blogSchema);

export default Blog;
