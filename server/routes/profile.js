import express from 'express';
import { dataStore } from '../lib/data-store.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/profile
router.get('/', verifyToken, (req, res) => {
    try {
        const user = dataStore.findUserById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({
            profile: user.emergencyProfile,
            user: {
                name: user.name,
                email: user.email,
                accountType: user.accountType,
                familyMembers: user.familyMembers,
            },
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({ error: 'Failed to get profile' });
    }
});

// PUT /api/profile
router.put('/', verifyToken, (req, res) => {
    try {
        const { emergencyProfile } = req.body;
        const user = dataStore.updateUser(req.user.id, { emergencyProfile });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ profile: user.emergencyProfile });
    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({ error: 'Failed to update profile' });
    }
});

export default router;
