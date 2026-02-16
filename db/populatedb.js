// db/populatedb.js
require('dotenv').config();
const { Client } = require('pg');

const SQL = `
-- Insert Categories
INSERT INTO categories (name, description) VALUES
  ('Laptops', 'Portable computers for work and gaming'),
  ('Smartphones', 'Mobile devices and accessories'),
  ('Tablets', 'Touchscreen portable devices'),
  ('Monitors', 'Display screens for computers'),
  ('Accessories', 'Computer and mobile accessories'),
  ('Audio', 'Headphones, speakers, and audio equipment'),
  ('Storage', 'Hard drives, SSDs, and storage solutions'),
  ('Networking', 'Routers, switches, and network equipment');

-- Insert Items
INSERT INTO items (name, description, category_id, price, quantity, sku) VALUES
  -- Laptops
  ('MacBook Pro 16"', 'Apple M3 Max, 36GB RAM, 1TB SSD', 1, 2499.00, 15, 'LAP-MBP16-001'),
  ('Dell XPS 15', 'Intel i9, 32GB RAM, 1TB SSD, RTX 4060', 1, 1899.00, 20, 'LAP-XPS15-002'),
  ('Lenovo ThinkPad X1', 'Intel i7, 16GB RAM, 512GB SSD', 1, 1499.00, 25, 'LAP-X1-003'),
  ('ASUS ROG Zephyrus', 'AMD Ryzen 9, 32GB RAM, RTX 4080', 1, 2299.00, 12, 'LAP-ROG-004'),
  ('HP Spectre x360', '2-in-1 Convertible, Intel i7, 16GB RAM', 1, 1399.00, 18, 'LAP-HP-005'),

  -- Smartphones
  ('iPhone 15 Pro', '256GB, Titanium Blue', 2, 1099.00, 50, 'PHN-IP15P-001'),
  ('Samsung Galaxy S24 Ultra', '512GB, Titanium Gray', 2, 1299.00, 40, 'PHN-S24U-002'),
  ('Google Pixel 8 Pro', '256GB, Obsidian', 2, 999.00, 35, 'PHN-PIX8-003'),
  ('OnePlus 12', '256GB, Silky Black', 2, 799.00, 30, 'PHN-OP12-004'),

  -- Tablets
  ('iPad Pro 12.9"', 'M2 Chip, 512GB, Space Gray', 3, 1199.00, 25, 'TAB-IPADP-001'),
  ('Samsung Galaxy Tab S9', '256GB with S Pen', 3, 899.00, 30, 'TAB-S9-002'),
  ('Microsoft Surface Pro 9', 'Intel i7, 16GB RAM', 3, 1299.00, 20, 'TAB-SURF-003'),

  -- Monitors
  ('LG UltraGear 27"', '4K 144Hz Gaming Monitor', 4, 699.00, 40, 'MON-LG27-001'),
  ('Dell UltraSharp 32"', '4K USB-C Hub Monitor', 4, 799.00, 35, 'MON-DELL32-002'),
  ('Samsung Odyssey G9', '49" Curved Gaming Monitor', 4, 1299.00, 15, 'MON-ODY-003'),
  ('ASUS ProArt 27"', '4K HDR Professional Display', 4, 899.00, 25, 'MON-ASUS-004'),

  -- Accessories
  ('Logitech MX Master 3S', 'Wireless Mouse', 5, 99.00, 100, 'ACC-MXMS-001'),
  ('Keychron K8 Pro', 'Mechanical Keyboard', 5, 119.00, 75, 'ACC-KEY-002'),
  ('Apple Magic Trackpad', 'Wireless Trackpad', 5, 129.00, 60, 'ACC-TRACK-003'),
  ('Webcam 4K Pro', 'USB-C 4K Webcam', 5, 149.00, 50, 'ACC-CAM-004'),

  -- Audio
  ('Sony WH-1000XM5', 'Noise Cancelling Headphones', 6, 399.00, 45, 'AUD-SONY-001'),
  ('AirPods Pro 2', 'Active Noise Cancellation', 6, 249.00, 80, 'AUD-AIRP-002'),
  ('Bose QuietComfort 45', 'Wireless Headphones', 6, 329.00, 40, 'AUD-BOSE-003'),
  ('JBL Charge 5', 'Portable Bluetooth Speaker', 6, 179.00, 65, 'AUD-JBL-004'),

  -- Storage
  ('Samsung 990 Pro 2TB', 'NVMe SSD', 7, 199.00, 70, 'STO-SAM2T-001'),
  ('WD Black 4TB', 'External Hard Drive', 7, 149.00, 55, 'STO-WD4T-002'),
  ('SanDisk Extreme 1TB', 'Portable SSD', 7, 129.00, 90, 'STO-SAND-003'),
  ('Seagate IronWolf 8TB', 'NAS Hard Drive', 7, 229.00, 40, 'STO-SEA8T-004'),

  -- Networking
  ('TP-Link Archer AX6000', 'WiFi 6 Router', 8, 249.00, 35, 'NET-TPL-001'),
  ('Netgear Nighthawk', 'Gaming Router', 8, 299.00, 30, 'NET-NIGHT-002'),
  ('Ubiquiti UniFi Dream', 'Network Gateway', 8, 379.00, 20, 'NET-UBI-003'),
  ('ASUS RT-AX88U', 'Dual-Band WiFi Router', 8, 279.00, 25, 'NET-ASUS-004');
`;

async function main() {
  console.log('Populating database...');

  const client = new Client({
     connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log('✅ Database populated successfully!');
  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await client.end();
  }
}

main();