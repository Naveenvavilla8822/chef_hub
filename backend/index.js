import express from 'express';
import cors from 'cors';
import db from './db.js';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));

// Register with more fields
app.post('/api/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('phone_number').notEmpty(),
  body('address').notEmpty(),
  body('role').isIn(['customer', 'chef', 'admin'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, phone_number, address, role } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(409).json({ msg: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, email, password, phone_number, address, role) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashed, phone_number, address, role]
    );

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Login (no change here)
app.post('/api/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, users[0].password);
    if (!match) return res.status(401).json({ msg: 'Invalid credentials' });

    res.json({
      msg: 'Login successful',
      user: {
        id: users[0].user_id,
        name: users[0].name,
        email: users[0].email,
        role: users[0].role
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


app.get('/api/dashboard/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const [bookings] = await db.query('SELECT COUNT(*) AS total FROM bookings WHERE user_id = ?', [userId]);
    const [favorites] = await db.query('SELECT COUNT(*) AS total FROM favorites WHERE user_id = ?', [userId]);
    const [orders] = await db.query('SELECT COUNT(*) AS total FROM orders WHERE user_id = ?', [userId]);

    res.json({
      bookings: bookings[0].total,
      favorites: favorites[0].total,
      orders: orders[0].total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to load dashboard stats' });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { user_id, chef_id, booking_date, meal_instructions } = req.body;

  if (!user_id || !chef_id || !booking_date) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    await db.query(
      'INSERT INTO bookings (user_id, chef_id, booking_date, meal_instructions) VALUES (?, ?, ?, ?)',
      [user_id, chef_id, booking_date, meal_instructions]
    );
    res.status(201).json({ msg: 'Booking created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// List All Chefs
app.get('/api/chefs', async (req, res) => {
  try {
    const [chefs] = await db.query(
      'SELECT chef_id, name, cuisine_specialties AS specialty FROM chefs INNER JOIN users ON chefs.user_id = users.user_id'
    );
    res.json(chefs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch chefs' });
  }
});



// User’s Bookings
app.get('/api/bookings/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const [bookings] = await db.query(
      `SELECT b.booking_id, b.booking_date, b.meal_instructions, b.status,
              c.chef_id, u.name AS chef_name, c.cuisine_specialties AS specialty
       FROM bookings b
       JOIN chefs c ON b.chef_id = c.chef_id
       JOIN users u ON c.user_id = u.user_id
       WHERE b.user_id = ?
       ORDER BY b.booking_date DESC`,
      [userId]
    );
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch bookings' });
  }
});


// Get single chef by ID
app.get('/api/chefs/:id', async (req, res) => {
  const chefId = req.params.id;
  try {
    const [results] = await db.query(
      `SELECT chefs.chef_id, users.name, users.address AS location, 
              chefs.cuisine_specialties AS specialty, chefs.experience_years
       FROM chefs 
       INNER JOIN users ON chefs.user_id = users.user_id
       WHERE chefs.chef_id = ?`,
      [chefId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: 'Chef not found' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error', message: err.message });
  }
});

// POST /api/favorites
app.post('/api/favorites', async (req, res) => {
  const { user_id, chef_id } = req.body;
  try {
    await db.query(
      'INSERT INTO favorites (user_id, chef_id, saved_at) VALUES (?, ?, NOW())',
      [user_id, chef_id]
    );
    res.status(201).json({ msg: 'Added to favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to add favorite' });
  }
});

app.get('/api/favorites/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const [favorites] = await db.query(
      `SELECT f.favorite_id, f.saved_at,
       c.chef_id, c.cuisine_specialties AS specialty,
       u.name AS chef_name
FROM favorites f
JOIN chefs c ON f.chef_id = c.chef_id
JOIN users u ON c.user_id = u.user_id
WHERE f.user_id = ?
ORDER BY f.saved_at DESC
`,
      [userId]
    );
    res.json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch favorites' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await db.query(
      'SELECT name, email, phone_number, address FROM users WHERE user_id = ?',
      [userId]
    );
    if (rows.length === 0) return res.status(404).json({ msg: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone_number, address } = req.body;

  try {
    await db.query(
      'UPDATE users SET name = ?, email = ?, phone_number = ?, address = ? WHERE user_id = ?',
      [name, email, phone_number, address, userId]
    );
    res.json({ msg: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update profile' });
  }
});

app.get('/api/chef/stats/:chefId', async (req, res) => {
  const chefId = req.params.chefId;
  try {
    const [result] = await db.query(
      'SELECT COUNT(*) AS totalBookings FROM bookings WHERE chef_id = ?',
      [chefId]
    );
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to load stats' });
  }
});

app.get('/api/chef/bookings/:chefId', async (req, res) => {
  const chefId = req.params.chefId;
  try {
    const [rows] = await db.query(
      `SELECT b.booking_id, b.booking_date, b.meal_instructions, b.status,
              u.name AS customer_name
       FROM bookings b
       JOIN users u ON b.user_id = u.user_id
       WHERE b.chef_id = ?
       ORDER BY b.booking_date DESC
       LIMIT 5`,
      [chefId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to load bookings' });
  }
});

app.put('/api/chef/bookings/:bookingId/status', async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    await db.query('UPDATE bookings SET status = ? WHERE booking_id = ?', [status, bookingId]);
    res.json({ msg: 'Booking status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update status' });
  }
});

// Add a new menu item
app.post('/api/menu/add', upload.single('image'), async (req, res) => {
  const { chef_id, name, description, price, available } = req.body;
  const image = req.file?.filename;

  try {
    await db.query(
      'INSERT INTO chef_menu (chef_id, name, description, price, image, available) VALUES (?, ?, ?, ?, ?, ?)',
      [chef_id, name, description, price, image, available === 'true']
    );
    res.status(201).json({ msg: 'Menu item added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to add menu item' });
  }
});


// Delete menu item
app.delete('/api/menu/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM chef_menu WHERE id = ?', [id]);
    res.json({ msg: 'Menu item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to delete item' });
  }
});

app.put('/api/menu/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, available } = req.body;
  const image = req.file?.filename;

  try {
    const updateFields = [];
    const values = [];

    if (name) { updateFields.push('name = ?'); values.push(name); }
    if (description) { updateFields.push('description = ?'); values.push(description); }
    if (price) { updateFields.push('price = ?'); values.push(price); }
    if (typeof available !== 'undefined') { updateFields.push('available = ?'); values.push(available === 'true'); }
    if (image) { updateFields.push('image = ?'); values.push(image); }

    if (updateFields.length === 0) {
      return res.status(400).json({ msg: 'No fields to update' });
    }

    values.push(id);
    const sql = `UPDATE chef_menu SET ${updateFields.join(', ')} WHERE id = ?`;
    await db.query(sql, values);

    res.json({ msg: 'Menu item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update item' });
  }
});

// Get all menu items for a chef
app.get('/api/menu/:chefId', async (req, res) => {
  const { chefId } = req.params;
  const { available, category } = req.query;

  try {
    let query = 'SELECT * FROM chef_menu WHERE chef_id = ?';
    const params = [chefId];

    if (available) {
      query += ' AND available = ?';
      params.push(available === 'true');
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to filter menu' });
  }
});


app.get('/api/menus', async (req, res) => {
  const { category, available } = req.query;

  try {
    let query = `SELECT m.*, u.name AS chef_name FROM chef_menu m 
                 JOIN chefs c ON m.chef_id = c.chef_id 
                 JOIN users u ON c.user_id = u.user_id WHERE 1`;
    const params = [];

    if (category) {
      query += ' AND m.category = ?';
      params.push(category);
    }

    if (available) {
      query += ' AND m.available = ?';
      params.push(available === 'true');
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to load menu items' });
  }
});



// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Server error', message: err.message });
});


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
