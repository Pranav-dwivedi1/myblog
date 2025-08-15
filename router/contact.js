const express = require('express');
const router = express.Router();

// GET: Show contact page
router.get('/', (req, res) => {
  res.render('contact', {
    user: req.user || null
  });
});


// POST: Handle contact form submission
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        console.log('New contact form submission:', { name, email, subject, message });

        res.status(200).json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.'
        });
    } catch (error) {
        console.error('Error handling contact form:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while sending your message.'
        });
    }
});

module.exports = router;
