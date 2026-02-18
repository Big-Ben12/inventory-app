// controllers/categoryController.js
const db = require('../db/queries');

// GET all categories
exports.categoryList = async (req, res) => {
  try {
    const categories = await db.getAllCategories();
    res.render('categories/list', { title: 'All Categories', categories });
  } catch (error) {
    console.error('categoryList error:', error);
    // expose minimal message in response, full details in logs
    res.status(500).send('Error fetching categories');
  }
};

// GET category detail
exports.categoryDetail = async (req, res) => {
  try {
    const category = await db.getCategoryById(req.params.id);
    const items = await db.getItemsByCategory(req.params.id);

    if (!category) {
      return res.status(404).send('Category not found');
    }

    res.render('categories/detail', { 
      title: category.name, 
      category, 
      items 
    });
  } catch (error) {
    res.status(500).send('Error fetching category');
  }
};

// GET create category form
exports.categoryCreateGet = async (req, res) => {
  res.render('categories/form', { 
    title: 'Create Category', 
    category: null,
    errors: []
  });
};

// POST create category
exports.categoryCreatePost = async (req, res) => {
  const { name, description } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Category name is required');
  }

  if (errors.length > 0) {
    return res.render('categories/form', { 
      title: 'Create Category', 
      category: { name, description },
      errors 
    });
  }

  try {
    await db.createCategory(name, description);
    res.redirect('/categories');
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      errors.push('Category name already exists');
      return res.render('categories/form', { 
        title: 'Create Category', 
        category: { name, description },
        errors 
      });
    }
    res.status(500).send('Error creating category');
  }
};

// GET update category form
exports.categoryUpdateGet = async (req, res) => {
  try {
    const category = await db.getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).send('Category not found');
    }

    res.render('categories/form', { 
      title: 'Update Category', 
      category,
      errors: []
    });
  } catch (error) {
    res.status(500).send('Error fetching category');
  }
};

// POST update category
exports.categoryUpdatePost = async (req, res) => {
  const { name, description } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Category name is required');
  }

  if (errors.length > 0) {
    const category = { id: req.params.id, name, description };
    return res.render('categories/form', { 
      title: 'Update Category', 
      category,
      errors 
    });
  }

  try {
    await db.updateCategory(req.params.id, name, description);
    res.redirect(`/categories/${req.params.id}`);
  } catch (error) {
    if (error.code === '23505') {
      errors.push('Category name already exists');
      const category = { id: req.params.id, name, description };
      return res.render('categories/form', { 
        title: 'Update Category', 
        category,
        errors 
      });
    }
    res.status(500).send('Error updating category');
  }
};

// GET delete category confirmation
exports.categoryDeleteGet = async (req, res) => {
  try {
    const category = await db.getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).send('Category not found');
    }

    res.render('categories/delete', { 
      title: 'Delete Category', 
      category 
    });
  } catch (error) {
    res.status(500).send('Error fetching category');
  }
};

// POST delete category
exports.categoryDeletePost = async (req, res) => {
  try {
    await db.deleteCategory(req.params.id);
    res.redirect('/categories');
  } catch (error) {
    res.status(500).send('Error deleting category');
  }
};