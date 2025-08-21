const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const generateToken = (userId) => jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const safeUser = await User.findById(user._id).select('-password');
    res.status(201).json({ token: generateToken(user._id), user: safeUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if(user && await user.matchPassword(req.body.password)){
      const safeUser = await User.findById(user._id).select('-password');
      res.json({ token: generateToken(user._id), user: safeUser });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
