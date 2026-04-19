import express from 'express';
import { dataStore } from '../lib/data-store.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All folder routes require auth
router.use(verifyToken);

// GET /api/folders
router.get('/', (req, res) => {
    try {
        const folders = dataStore.getFoldersByUser(req.user.id);
        return res.json({ folders });
    } catch (error) {
        console.error('Get folders error:', error);
        return res.json({ folders: [] });
    }
});

// POST /api/folders
router.post('/', (req, res) => {
    try {
        const { name, icon, color } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Folder name is required' });
        }
        const folder = dataStore.createFolder({
            name,
            icon: icon || '📁',
            color: color || '#0d9488',
            userId: req.user.id,
            type: 'folder',
        });
        return res.status(201).json({ folder });
    } catch (error) {
        console.error('Create folder error:', error);
        return res.status(500).json({ error: 'Failed to create folder' });
    }
});

// GET /api/folders/:id
router.get('/:id', (req, res) => {
    try {
        const folder = dataStore.getFolderById(req.params.id);
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        const documents = dataStore.getDocumentsByFolder(req.params.id);
        return res.json({ folder, documents });
    } catch (error) {
        console.error('Get folder error:', error);
        return res.status(500).json({ error: 'Failed to get folder' });
    }
});

// PUT /api/folders/:id
router.put('/:id', (req, res) => {
    try {
        const { name, icon, color } = req.body;
        const folder = dataStore.updateFolder(req.params.id, { name, icon, color });
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        return res.json({ folder });
    } catch (error) {
        console.error('Update folder error:', error);
        return res.status(500).json({ error: 'Failed to update folder' });
    }
});

// DELETE /api/folders/:id
router.delete('/:id', (req, res) => {
    try {
        const deleted = dataStore.deleteFolder(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        return res.json({ message: 'Folder and its contents deleted' });
    } catch (error) {
        console.error('Delete folder error:', error);
        return res.status(500).json({ error: 'Failed to delete folder' });
    }
});

export default router;
