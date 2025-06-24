const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    console.log('Registering user:', req.body);
  const { username, email } = req.body;

  if (!username) return res.status(400).json({ error: 'Username is required' });

  const existing = await User.findOne({ username });
  if (existing) return res.status(409).json({ error: 'Username already taken' });

  const user = await User.create({ username, email });
  res.status(201).json(user);
});

// Login route
router.post('/login', async (req, res) => {
  const { username } = req.body;

  if (!username) return res.status(400).json({ error: 'Username is required' });

  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json(user);
});

module.exports = router;

