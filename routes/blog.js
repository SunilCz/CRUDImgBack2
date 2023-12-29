import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage: storage });

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

const BlogRouter = express.Router();
BlogRouter.use(express.json());

const response = (res, status, result) => {
  res.status(status).json(result);
};

BlogRouter.get("/", async (req, res) => {
  const { page = 1, perPage } = req.query;

  try {
    const currentPage = parseInt(page);
    const blogs = await Blog.find()
      .sort("-createdOn")
      .skip((currentPage - 1) * perPage)
      .limit(parseInt(perPage));

    const totalBlogs = await Blog.countDocuments();

    const totalPages = Math.ceil(totalBlogs / perPage);

    const blogsWithImages = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      content: blog.content,
      image: blog.image,
      createdOn: blog.createdOn,
    }));

    response(res, 200, { blogs: blogsWithImages, totalPages });
  } catch (err) {
    console.log(err);
    response(res, 400, { error: err });
  }
});



BlogRouter.get("/post/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.isValidObjectId(id)) {
      const blog = await Blog.findById(id);

      if (!blog) {
        return response(res, 404, { error: "Blog not found" });
      }

      const blogWithImage = {
        _id: blog._id,
        title: blog.title,
        content: blog.content,
        image: blog.image,
        createdOn: blog.createdOn,
      };

      response(res, 200, blogWithImage);
    } else {
      const results = await Blog.find({
        title: { $regex: new RegExp(id, "i") },
      });

      response(res, 200, results);
    }
  } catch (error) {
    console.error("Error fetching blog post or search:", error);
    response(res, 500, { error: "Internal Server Error" });
  }
});

BlogRouter.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return response(res, 400, { error: "Title and content are required" });
    }

    const image = req.file ? req.file.filename : undefined;

    const blog = new Blog({
      title,
      content,
      image,
    });

    await blog.save();
    response(res, 200, { msg: "Blog created", blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    response(res, 500, { error: "Internal Server Error" });
  }
});

BlogRouter.delete("/delete/:id", async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
    });
    if (!blog) {
      return response(res, 404, { error: "blog not found" });
    }
    response(res, 200, { msg: "blog deleted!" });
  } catch (error) {
    response(res, 400, { error: error });
  }
});

BlogRouter.put("/update/:id", upload.single("image"), async (req, res) => {
  const { title, content } = req.body;
  const newImage = req.file ? req.file.filename : undefined;

  try {
    const blog = await Blog.findOne({ _id: req.params.id });
    if (!blog) {
      return response(res, 404, { error: "blog not found" });
    }

    blog.title = title;
    blog.content = content;

    if (newImage) {
      if (blog.image) {
        fs.unlinkSync(`uploads/${blog.image}`);
      }
      blog.image = newImage;
    }

    await blog.save();

    response(res, 200, { msg: "blog updated", blog });
  } catch (error) {
    response(res, 400, { error: error });
  }
});

BlogRouter.get("/search", async (req, res) => {
  try {
    const { q: query } = req.query;

    if (!query) {
      return response(res, 400, { error: "Query parameter is required for search" });
    }

    const results = await Blog.find({
      title: { $regex: new RegExp(query, "i") },
    }).select('title image'); // Only select title and image fields

    response(res, 200, { query, results });
  } catch (error) {
    response(res, 400, { error: error.message });
  }
});

export default BlogRouter;
