// controllers/itemController.js
const db = require('../db/queries');

// GET all items or search results
exports.itemList = async (req, res) => {
  try {
    const searchTerm = req.query.search;
    let items;

    if (searchTerm) {
      items = await db.searchItems(searchTerm);
    } else {
      items = await db.getAllItems();
    }

    res.render('items/list', { 
      title: 'All Items', 
      items,
      searchTerm: searchTerm || ''
    });
  } catch (error) {
    res.status(500).send('Error fetching items');
  }
};

// GET item detail
exports.itemDetail = async (req, res) => {
  try {
    const item = await db.getItemById(req.params.id);

    if (!item) {
      return res.status(404).send('Item not found');
    }

    res.render('items/detail', { 
      title: item.name, 
      item 
    });
  } catch (error) {
    res.status(500).send('Error fetching item');
  }
};

// GET create item form
exports.itemCreateGet = async (req, res) => {
  try {
    const categories = await db.getAllCategories();
    res.render('items/form', { 
      title: 'Create Item', 
      item: null,
      categories,
      errors: []
    });
  } catch (error) {
    res.status(500).send('Error loading form');
  }
};

// POST create item
exports.itemCreatePost = async (req, res) => {
  const { name, description, category_id, price, quantity, sku } = req.body;
  const errors = [];

  // Validation
  if (!name || name.trim() === '') {
    errors.push('Item name is required');
  }
  if (!category_id) {
    errors.push('Category is required');
  }
  if (!price || isNaN(price) || parseFloat(price) < 0) {
    errors.push('Valid price is required');
  }
  if (!quantity || isNaN(quantity) || parseInt(quantity) < 0) {
    errors.push('Valid quantity is required');
  }

  if (errors.length > 0) {
    const categories = await db.getAllCategories();
    return res.render('items/form', { 
      title: 'Create Item', 
      item: { name, description, category_id, price, quantity, sku },
      categories,
      errors 
    });
  }

  try {
    await db.createItem(name, description, category_id, price, quantity, sku);
    res.redirect('/items');
  } catch (error) {
    const categories = await db.getAllCategories();
    if (error.code === '23505') {
      errors.push('SKU already exists');
      return res.render('items/form', { 
        title: 'Create Item', 
        item: { name, description, category_id, price, quantity, sku },
        categories,
        errors 
      });
    }
    res.status(500).send('Error creating item');
  }
};

// GET update item form
exports.itemUpdateGet = async (req, res) => {
  try {
    const item = await db.getItemById(req.params.id);
    const categories = await db.getAllCategories();

    if (!item) {
      return res.status(404).send('Item not found');
    }

    res.render('items/form', { 
      title: 'Update Item', 
      item,
      categories,
      errors: []
    });
  } catch (error) {
    res.status(500).send('Error fetching item');
  }
};

// POST update item
exports.itemUpdatePost = async (req, res) => {
  const { name, description, category_id, price, quantity, sku } = req.body;
  const errors = [];

  // Validation
  if (!name || name.trim() === '') {
    errors.push('Item name is required');
  }
  if (!category_id) {
    errors.push('Category is required');
  }
  if (!price || isNaN(price) || parseFloat(price) < 0) {
    errors.push('Valid price is required');
  }
  if (!quantity || isNaN(quantity) || parseInt(quantity) < 0) {
    errors.push('Valid quantity is required');
  }

  if (errors.length > 0) {
    const categories = await db.getAllCategories();
    const item = { id: req.params.id, name, description, category_id, price, quantity, sku };
    return res.render('items/form', { 
      title: 'Update Item', 
      item,
      categories,
      errors 
    });
  }

  try {
    await db.updateItem(req.params.id, name, description, category_id, price, quantity, sku);
    res.redirect(`/items/${req.params.id}`);
  } catch (error) {
    const categories = await db.getAllCategories();
    if (error.code === '23505') {
      errors.push('SKU already exists');
      const item = { id: req.params.id, name, description, category_id, price, quantity, sku };
      return res.render('items/form', { 
        title: 'Update Item', 
        item,
        categories,
        errors 
      });
    }
    res.status(500).send('Error updating item');
  }
};

// GET delete item confirmation
exports.itemDeleteGet = async (req, res) => {
  try {
    const item = await db.getItemById(req.params.id);

    if (!item) {
      return res.status(404).send('Item not found');
    }

    res.render('items/delete', { 
      title: 'Delete Item', 
      item 
    });
  } catch (error) {
    res.status(500).send('Error fetching item');
  }
};

// POST delete item
exports.itemDeletePost = async (req, res) => {
  try {
    await db.deleteItem(req.params.id);
    res.redirect('/items');
  } catch (error) {
    res.status(500).send('Error deleting item');
  }
};