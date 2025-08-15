const { Router } = require("express");
const router = Router();
const userModel = require("../models/user");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { Schema, model } = require('mongoose');
const isLoggedIn = require('../middleware/isLoggedIn');
const upload = require('../middleware/multer');
const path = require('path');

const commentSchema = new Schema({
  blog: { type: Schema.Types.ObjectId, ref: 'blog', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  content: { type: String, required: true }
}, { timestamps: true });

module.exports = model('comment', commentSchema);

router.get("/signin", (req, res) => {
  return res.render("signin", { title: "signin" });
});

router.get("/signup", (req, res) => {
  return res.render("signup", { title: "signup" });
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log('Trying to sign in with:', email, password);
  if (!userModel) {
    console.error('userModel is undefined!');
    return res.status(500).send('Internal server error');
  }
  try {
    const user = await userModel.matchPassword(email, password);
    req.session.userId = user._id;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(401).send(err.message);
  }
});


router.post("/signup", async (req, res) => {
  console.log("REQ BODY:", req.body);

  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    console.log("Missing fields:", { fullName, email, password });
    return res.status(400).send("All fields are required");
  }

  try {
    const user = await userModel.create({ fullName, email, password });
    console.log("User created successfully:", user);
    req.session.userId = user._id;
    return res.redirect("/");
  } catch (err) {
    console.error("User creation error:", err);

    // Handle duplicate email error (MongoError code 11000)
    if (err.code === 11000) {
      return res.status(400).send("Email already registered. Please use another email.");
    }

    return res.status(500).send("Something went wrong. Please try again.");
  }
});

// DEBUG: List all users (for development only)
router.get('/debug/users', async (req, res) => {
  try {
    const users = await require('../models/user').find({}, '-password -salt');
    res.json(users);
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
});

// Profile Route
router.get('/profile', async (req, res) => {
  if (!req.user) {
    return res.redirect('/user/signin'); // Redirect to login if not logged in
  }

  try {
    const user = await userModel.findById(req.user._id);
    res.render('profile', { user });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('Logout error:', err);
      return res.status(500).send('Logout failed');
    }
    res.clearCookie('connect.sid'); // Optional: clear session cookie
    res.redirect('/');
  });
});

module.exports = router;



module.exports = router;