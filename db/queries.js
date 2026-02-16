// db/queries.js
const pool = require('./pool');

// ============ CATEGORY QUERIES ============

// Get all categories
async function getAllCategories() {
  const { rows } = await pool.query(
    'SELECT * FROM categories ORDER BY name'
  );
  return rows;
}

// Get category by ID with item count
async function getCategoryById(id) {
  const { rows } = await pool.query(
    `SELECT c.*, COUNT(i.id) as item_count 
     FROM categories c 
     LEFT JOIN items i ON c.id = i.category_id 
     WHERE c.id = $1 
     GROUP BY c.id`,
    [id]
  );
  return rows[0];
}

// Create category
async function createCategory(name, description) {
  const { rows } = await pool.query(
    'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return rows[0];
}

// Update category
async function updateCategory(id, name, description) {
  const { rows } = await pool.query(
    'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  return rows[0];
}

// Delete category (CASCADE will delete associated items)
async function deleteCategory(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM categories WHERE id = $1',
    [id]
  );
  return rowCount;
}

// ============ ITEM QUERIES ============

// Get all items
async function getAllItems() {
  const { rows } = await pool.query(
    `SELECT i.*, c.name as category_name 
     FROM items i 
     LEFT JOIN categories c ON i.category_id = c.id 
     ORDER BY i.name`
  );
  return rows;
}

// Get items by category
async function getItemsByCategory(categoryId) {
  const { rows } = await pool.query(
    `SELECT i.*, c.name as category_name 
     FROM items i 
     LEFT JOIN categories c ON i.category_id = c.id 
     WHERE i.category_id = $1 
     ORDER BY i.name`,
    [categoryId]
  );
  return rows;
}

// Get item by ID
async function getItemById(id) {
  const { rows } = await pool.query(
    `SELECT i.*, c.name as category_name 
     FROM items i 
     LEFT JOIN categories c ON i.category_id = c.id 
     WHERE i.id = $1`,
    [id]
  );
  return rows[0];
}

// Create item
async function createItem(name, description, categoryId, price, quantity, sku) {
  const { rows } = await pool.query(
    `INSERT INTO items (name, description, category_id, price, quantity, sku) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [name, description, categoryId, price, quantity, sku]
  );
  return rows[0];
}

// Update item
async function updateItem(id, name, description, categoryId, price, quantity, sku) {
  const { rows } = await pool.query(
    `UPDATE items 
     SET name = $1, description = $2, category_id = $3, price = $4, 
         quantity = $5, sku = $6, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $7 RETURNING *`,
    [name, description, categoryId, price, quantity, sku, id]
  );
  return rows[0];
}

// Delete item
async function deleteItem(id) {
  const { rowCount } = await pool.query(
    'DELETE FROM items WHERE id = $1',
    [id]
  );
  return rowCount;
}

// Search items
async function searchItems(searchTerm) {
  const { rows } = await pool.query(
    `SELECT i.*, c.name as category_name 
     FROM items i 
     LEFT JOIN categories c ON i.category_id = c.id 
     WHERE i.name ILIKE $1 OR i.description ILIKE $1 OR i.sku ILIKE $1
     ORDER BY i.name`,
    [`%${searchTerm}%`]
  );
  return rows;
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllItems,
  getItemsByCategory,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  searchItems
};