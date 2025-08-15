const express = require('express');
const router = express.Router();
const Blog = require('../models/blogs'); // adjust path as needed

router.get('/search', async (req, res) => {
  const query = req.query.q;

  try {
    const blogs = await Blog.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    res.render('home', {
      blogs,
      user: req.user || null
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
