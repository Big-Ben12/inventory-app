
// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// GET all items (with optional search)
router.get('/', itemController.itemList);

// GET create item form
router.get('/create', itemController.itemCreateGet);

// POST create item
router.post('/create', itemController.itemCreatePost);

// GET item detail
router.get('/:id', itemController.itemDetail);

// GET update item form
router.get('/:id/update', itemController.itemUpdateGet);

// POST update item
router.post('/:id/update', itemController.itemUpdatePost);

// GET delete item confirmation
router.get('/:id/delete', itemController.itemDeleteGet);

// POST delete item
router.post('/:id/delete', itemController.itemDeletePost);

module.exports = router;