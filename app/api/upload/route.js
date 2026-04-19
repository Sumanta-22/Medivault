import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Record from '@/models/Record';

export async function POST(request) {
    try {
        await connectDB();
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { folderId, name, type, data, size } = body;

        if (!folderId || !name) {
            return NextResponse.json({ error: 'Folder and file name are required' }, { status: 400 });
        }

        const document = await Record.create({
            name,
            type: 'document',
            fileUrl: data, // base64 data for now
            fileType: type || 'image/jpeg',
            fileSize: size || 0,
            userId: user._id.toString(),
            folderId,
        });

        return NextResponse.json({ document }, { status: 201 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
        }

        const document = await Record.findByIdAndDelete(id);
        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Document deleted' });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}

