const express = require('express');
const router = express.Router();
const category_controller = require('../controllers/categoryController');

// GET all categories
router.get('/all', category_controller.category_list);

// GET category form view
router.get('/create', category_controller.category_create_get);

// GET specific category
router.get('/:id', category_controller.category_detail);

//POST date from form
router.post('/create', category_controller.category_create_post);

// GET update form
router.get('/:id/update', category_controller.category_update_get);

// POST update form
router.post('/:id/update', category_controller.category_update_post);

// GET delete form 
router.get('/:id/delete', category_controller.category_delete_get);

// POST delete form
router.post('/:id/delete', category_controller.category_delete_post);

module.exports = router;