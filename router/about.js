// routes/about.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('about', { 
        user: req.user || {
            fullName: 'Pranav Dwivedi',
            email: 'pranav01dev@gmail.com',
            phone: '+918770676950'
        }
    });
});

module.exports = router;