require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo');
const Blog = require('./models/blogs');
const userModel = require('./models/user');
const userRoutes = require('./router/user');
const addBlogRoutes = require('./router/blog');
const aboutRouter = require('./router/about');
const contactRouter = require('./router/contact');
const searchRoutes = require('./router/search');
const PORT = process.env.PORT || 3000;

// Database connection
mongoose.connect(process.env.MONGO_Url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_Url }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// User authentication middleware
app.use(async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await userModel.findById(req.session.userId);
      req.user = user;
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
});

// Middleware to set currentPath for all views
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Other middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', async (req, res) => {
  try {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render('home', {
      user: req.user || null,
      blogs: allBlogs,
    });
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.use('/user', userRoutes);
app.use('/blog', addBlogRoutes);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/', searchRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.resolve('./public')));

// Start server only in development for local testing
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for Vercel deployment
module.exports = app;
