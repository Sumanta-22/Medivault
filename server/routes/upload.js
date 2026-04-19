import express from 'express';
import { dataStore } from '../lib/data-store.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/upload  — add document to a folder
router.post('/', verifyToken, (req, res) => {
    try {
        const { folderId, name, type, data, size } = req.body;

        if (!folderId || !name) {
            return res.status(400).json({ error: 'Folder ID and file name are required' });
        }

        const folder = dataStore.getFolderById(folderId);
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        const doc = dataStore.createDocument({
            name,
            type: 'document',
            fileUrl: data || '',
            fileType: type || 'image/jpeg',
            fileSize: size || 0,
            userId: req.user.id,
            folderId,
        });

        return res.status(201).json({ document: doc });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Upload failed' });
    }
});

// DELETE /api/upload?id=<docId>  — delete a document
router.delete('/', verifyToken, (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: 'Document ID required' });
        }

        const deleted = dataStore.deleteDocument(id);
        if (!deleted) {
            return res.status(404).json({ error: 'Document not found' });
        }

        return res.json({ message: 'Document deleted' });
    } catch (error) {
        console.error('Delete error:', error);
        return res.status(500).json({ error: 'Delete failed' });
    }
});

export default router;
