import express from 'express';
import bcrypt from 'bcryptjs';
import { dataStore } from '../lib/data-store.js';
import { signToken, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, accountType, familyMembers } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        const existingUser = dataStore.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'An account with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = dataStore.createUser({
            name,
            email,
            password: hashedPassword,
            accountType: accountType || 'individual',
            familyMembers: familyMembers || [],
        });

        // Seed default folders
        dataStore.seed(user._id);

        return res.status(201).json({
            message: 'Account created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                accountType: user.accountType,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = dataStore.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = signToken({
            id: user._id,
            email: user.email,
            name: user.name,
            accountType: user.accountType,
        });

        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                accountType: user.accountType,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

// GET /api/auth/me
router.get('/me', verifyToken, (req, res) => {
    const user = dataStore.findUserById(req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            accountType: user.accountType,
            familyMembers: user.familyMembers,
        },
    });
});

export default router;
