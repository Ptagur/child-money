const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { apiLimiter } = require('./middleware/rateLimiter');

dotenv.config();

// Initialize Firebase (must be before any route imports)
require('./firebase');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Child Money Management API is running (Firebase)' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/parent', require('./routes/parent'));
app.use('/api/child', require('./routes/child'));
app.use('/api/transactions', require('./routes/transaction'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with Firebase Firestore`);
});
