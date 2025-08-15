const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Blog = require("../models/blogs");
const Comment = require("../models/comment");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userDir = path.resolve(`./public/uploads/${req.user._id}`);
    fs.mkdirSync(userDir, { recursive: true }); // Ensure directory exists
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpg, jpeg, png, webp)"));
    }
  },
});

// Render Add Blog Page
router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get('/:id',async (req, res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({blogId: req.params.id}).populate("createdBy")

  return res.render("blog", {
    user: req.user,
    blog,
    comments
  });
});


router.post('/comment/:blogId',async (req, res)=>{
const comment = await Comment.create({
  content: req.body.content,
  blogId: req.params.blogId,
  createdBy: req.user._id
})
return res.redirect(`/blog/${req.params.blogId}`);
});


// Handle Blog POST
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {


    const { title, body } = req.body;
    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.user._id}/${req.file.filename}`,
    });

    return res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error("Blog upload error:", err);
    return res.status(500).send("Error creating blog");
  }
});

module.exports = router;
