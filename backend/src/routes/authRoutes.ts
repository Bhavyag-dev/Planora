import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Public: Sign up
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ 
      name, 
      email: normalizedEmail, 
      password
    });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Public: Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').trim().toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '7d' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Authenticated: Get profile
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Authenticated: Update Profile
router.patch('/update-profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;

    if (currentPassword && newPassword) {
      const isMatch = await (user as any).comparePassword(currentPassword);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });
      user.password = newPassword;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
