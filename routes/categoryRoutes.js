// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET all categories
router.get('/', categoryController.categoryList);

// GET create category form
router.get('/create', categoryController.categoryCreateGet);

// POST create category
router.post('/create', categoryController.categoryCreatePost);

// GET category detail
router.get('/:id', categoryController.categoryDetail);

// GET update category form
router.get('/:id/update', categoryController.categoryUpdateGet);

// POST update category
router.post('/:id/update', categoryController.categoryUpdatePost);

// GET delete category confirmation
router.get('/:id/delete', categoryController.categoryDeleteGet);

// POST delete category
router.post('/:id/delete', categoryController.categoryDeletePost);

module.exports = router;