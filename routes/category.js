const express = require('express');
const router = express.Router();
const category_controller = require('../controllers/categoryController');

// GET all categories
router.get('/all', (req, res) => {
    res.render('index', {title: 'Express'})
});

// GET specific category
router.get('/:id', category_controller.category_detail);

module.exports = router;