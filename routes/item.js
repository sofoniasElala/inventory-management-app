const express = require('express');
const router = express.Router();
const item_controller = require('../controllers/itemController');

// GET all items
router.get('/all', item_controller.item_list);

// GET specific item
router.get('/:id', item_controller.item_detail)

module.exports = router;