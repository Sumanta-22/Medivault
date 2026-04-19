import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Record from '@/models/Record';

export async function GET(request) {
    try {
        await connectDB();

        const DB_FILE = path.join(process.cwd(), 'medivault-db.json');

        if (!fs.existsSync(DB_FILE)) {
            return NextResponse.json({ error: 'medivault-db.json not found' }, { status: 404 });
        }

        const rawData = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(rawData);

        const { users = [], folders = [], documents = [] } = data;

        let migratedUsers = 0;
        let migratedFolders = 0;
        let migratedDocuments = 0;

        // 1. Migrate Users
        for (const u of users) {
            // Check if user already exists in Mongo by email
            const existing = await User.findOne({ email: u.email });
            if (!existing) {
                await User.create({
                    _id: u._id, // Keep the same ID if possible, or let Mongo generate one. But we need to link folders.
                    // Since Mongoose might complain about string IDs for ObjectId, let's keep the original IDs if the schema allows it.
                    // Wait, User model doesn't specify _id type, so it uses ObjectId by default. If we force a string _id, it might fail if not configured.
                    // Let's create new users and keep a map of oldId -> newId
                    name: u.name,
                    email: u.email,
                    password: u.password,
                    accountType: u.accountType,
                    familyMembers: u.familyMembers || [],
                    emergencyProfile: u.emergencyProfile || {},
                    createdAt: u.createdAt
                });
            }
        }

        // Fetch all users from Mongo to map old IDs
        // Actually, we need a way to map old string IDs to new ObjectIds, OR we just find the user by email!
        // foldes have 'userId'. Since users in medivault-db.json don't have the real Mongo ID, we can look up the user by email (Wait, folder in JSON has userId which is the string ID).
        // Let's create a map: old string ID -> email
        const oldUserIdToEmail = {};
        for (const u of users) {
            oldUserIdToEmail[u._id] = u.email;
        }

        // 2. Migrate Folders
        const mongoFolders = [];
        const oldFolderIdToNewId = {};

        for (const f of folders) {
            const userEmail = oldUserIdToEmail[f.userId];
            const mongoUser = userEmail ? await User.findOne({ email: userEmail }) : null;

            if (mongoUser) {
                // Check if folder already exists
                const existingFolder = await Record.findOne({ name: f.name, userId: mongoUser._id, type: 'folder' });
                if (!existingFolder) {
                    const newFolder = await Record.create({
                        name: f.name,
                        icon: f.icon,
                        color: f.color,
                        userId: mongoUser._id,
                        type: 'folder',
                        createdAt: f.createdAt,
                        updatedAt: f.updatedAt
                    });
                    oldFolderIdToNewId[f._id] = newFolder._id;
                    migratedFolders++;
                } else {
                    oldFolderIdToNewId[f._id] = existingFolder._id;
                }
            }
        }

        // 3. Migrate Documents
        for (const d of documents) {
            const newFolderId = oldFolderIdToNewId[d.folderId];
            if (newFolderId) {
                // Find user from folder
                const folder = await Record.findById(newFolderId);

                // Check if doc exists
                const existingDoc = await Record.findOne({ name: d.name, folderId: newFolderId, type: 'document' });
                if (!existingDoc) {
                    await Record.create({
                        name: d.name,
                        type: 'document',
                        folderId: newFolderId,
                        userId: folder.userId, // Link to user
                        fileUrl: d.data, // base64 data
                        fileType: d.fileType,
                        createdAt: d.createdAt,
                        updatedAt: d.createdAt
                    });
                    migratedDocuments++;
                }
            }
        }

        return NextResponse.json({
            message: 'Migration completed successfully!',
            stats: {
                usersProcessed: users.length,
                foldersMigrated: migratedFolders,
                documentsMigrated: migratedDocuments
            }
        });

    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: 'Migration failed: ' + error.message }, { status: 500 });
    }
}
