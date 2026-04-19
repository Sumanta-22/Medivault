import fs from 'fs';
import path from 'path';

/**
 * File-based data store for development/demo without MongoDB.
 * Provides a simple CRUD interface that mirrors the MongoDB models.
 * Saves to a JSON file in the project directory to ensure persistence 
 * across Next.js API route completely isolated environments.
 */

const DB_FILE = path.join(process.cwd(), 'medivault-db.json');

function readStore() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading store:', error);
    }
    return {
        users: [],
        folders: [],
        documents: [],
        idCounter: { users: 1, folders: 1, documents: 1 }
    };
}

function writeStore(store) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing store:', error);
    }
}

function generateId(store, type) {
    const id = `${type}_${Date.now()}_${store.idCounter[type]++}`;
    writeStore(store);
    return id;
}

export const dataStore = {
    // --- Users ---
    createUser(userData) {
        const store = readStore();
        const user = {
            _id: generateId(store, 'users'),
            ...userData,
            emergencyProfile: userData.emergencyProfile || {
                bloodGroup: '',
                allergies: [],
                medications: [],
                emergencyContacts: [],
            },
            familyMembers: userData.familyMembers || [],
            createdAt: new Date().toISOString(),
        };
        store.users.push(user);
        writeStore(store);
        return user;
    },

    findUserByEmail(email) {
        const store = readStore();
        return store.users.find((u) => u.email === email) || null;
    },

    findUserById(id) {
        const store = readStore();
        return store.users.find((u) => u._id === id) || null;
    },

    updateUser(id, updates) {
        const store = readStore();
        const idx = store.users.findIndex((u) => u._id === id);
        if (idx === -1) return null;
        store.users[idx] = { ...store.users[idx], ...updates };
        writeStore(store);
        return store.users[idx];
    },

    // --- Folders ---
    createFolder(folderData) {
        const store = readStore();
        const folder = {
            _id: generateId(store, 'folders'),
            ...folderData,
            documents: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        store.folders.push(folder);
        writeStore(store);
        return folder;
    },

    getFoldersByUser(userId) {
        const store = readStore();
        return store.folders.filter((f) => f.userId === userId);
    },

    getFolderById(id) {
        const store = readStore();
        return store.folders.find((f) => f._id === id) || null;
    },

    updateFolder(id, updates) {
        const store = readStore();
        const idx = store.folders.findIndex((f) => f._id === id);
        if (idx === -1) return null;
        store.folders[idx] = { ...store.folders[idx], ...updates, updatedAt: new Date().toISOString() };
        writeStore(store);
        return store.folders[idx];
    },

    deleteFolder(id) {
        const store = readStore();
        const idx = store.folders.findIndex((f) => f._id === id);
        if (idx === -1) return false;
        // Remove all documents in this folder
        store.documents = store.documents.filter((d) => d.folderId !== id);
        store.folders.splice(idx, 1);
        writeStore(store);
        return true;
    },

    // --- Documents ---
    createDocument(docData) {
        const store = readStore();
        const doc = {
            _id: generateId(store, 'documents'),
            ...docData,
            summary: null,
            createdAt: new Date().toISOString(),
        };
        store.documents.push(doc);
        // Also add to folder
        const folder = store.folders.find((f) => f._id === docData.folderId);
        if (folder) {
            folder.documents.push(doc._id);
        }
        writeStore(store);
        return doc;
    },

    getDocumentsByFolder(folderId) {
        const store = readStore();
        return store.documents.filter((d) => d.folderId === folderId);
    },

    getDocumentById(id) {
        const store = readStore();
        return store.documents.find((d) => d._id === id) || null;
    },

    updateDocument(id, updates) {
        const store = readStore();
        const idx = store.documents.findIndex((d) => d._id === id);
        if (idx === -1) return null;
        store.documents[idx] = { ...store.documents[idx], ...updates };
        writeStore(store);
        return store.documents[idx];
    },

    deleteDocument(id) {
        const store = readStore();
        const idx = store.documents.findIndex((d) => d._id === id);
        if (idx === -1) return false;
        store.documents.splice(idx, 1);
        writeStore(store);
        return true;
    },

    // Seed some demo data
    seed(userId) {
        const defaultFolders = [
            { name: 'Blood Tests', icon: '🩸', color: '#dc2626' },
            { name: 'Prescriptions', icon: '💊', color: '#0d9488' },
            { name: 'X-Rays', icon: '🦴', color: '#0284c7' },
            { name: 'MRI Scans', icon: '🧠', color: '#7c3aed' },
            { name: 'Vaccinations', icon: '💉', color: '#16a34a' },
            { name: 'Dental Records', icon: '🦷', color: '#f59e0b' },
        ];

        defaultFolders.forEach((f) => {
            this.createFolder({
                name: f.name,
                icon: f.icon,
                color: f.color,
                userId,
                type: 'folder',
            });
        });
    },

    getAllUsers() {
        return readStore().users;
    }
};
