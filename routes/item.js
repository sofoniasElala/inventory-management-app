const express = require('express');
const router = express.Router();
const item_controller = require('../controllers/itemController');

// GET all items
router.get('/all', item_controller.item_list);

// GET item form view
router.get('/create', item_controller.item_create_get);

// POST create form
router.post('/create', item_controller.item_create_post);

// GET specific item
router.get('/:id', item_controller.item_detail);

// GET update form
router.get('/:id/update', item_controller.item_update_get);

// POST update form
router.post('/:id/update', item_controller.item_update_post);

// GET delete form 
router.get('/:id/delete', item_controller.item_delete_get);

// POST delete form
router.post('/:id/delete', item_controller.item_delete_post);

module.exports = router;