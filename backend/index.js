import express from 'express';
import cors from 'cors';
import db from './db.js';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Register with more fields
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
      'SELECT booking_id, chef_id, booking_date, meal_instructions, status FROM bookings WHERE user_id = ? ORDER BY booking_date DESC',
      [userId]
    );
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch bookings' });
  }
});


// User’s Favorite Chefs
app.get('/api/favorites/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const [favorites] = await db.query(
      'SELECT favorite_id, chef_id, saved_at FROM favorites WHERE user_id = ? ORDER BY saved_at DESC',
      [userId]
    );
    res.json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch favorites' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
