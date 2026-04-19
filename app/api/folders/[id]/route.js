import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Record from '@/models/Record';

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = params;
        
        const folder = await Record.findById(id);
        if (!folder || folder.type !== 'folder') {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
        }

        const documents = await Record.find({ folderId: id, type: 'document' });

        return NextResponse.json({ folder, documents });
    } catch (error) {
        console.error('Get folder error:', error);
        return NextResponse.json({ error: 'Failed to get folder' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const body = await request.json();

        const folder = await Record.findByIdAndUpdate(
            id,
            {
                name: body.name,
                icon: body.icon,
                color: body.color,
                updatedAt: Date.now(),
            },
            { new: true }
        );

        if (!folder || folder.type !== 'folder') {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
        }

        return NextResponse.json({ folder });
    } catch (error) {
        console.error('Update folder error:', error);
        return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const folder = await Record.findByIdAndDelete(id);
        if (!folder || folder.type !== 'folder') {
            return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
        }

        // Also delete all documents in this folder
        await Record.deleteMany({ folderId: id });

        return NextResponse.json({ message: 'Folder and its contents deleted' });
    } catch (error) {
        console.error('Delete folder error:', error);
        return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
    }
}

