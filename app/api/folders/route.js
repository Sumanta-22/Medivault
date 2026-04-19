import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Record from '@/models/Record';

export async function GET(request) {
    try {
        await connectDB();
        const session = await getServerSession();
        
        if (!session?.user?.email) {
            return NextResponse.json({ folders: [] });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ folders: [] });
        }

        const folders = await Record.find({ userId: user._id.toString(), type: 'folder' });
        return NextResponse.json({ folders });
    } catch (error) {
        console.error('Get folders error:', error);
        return NextResponse.json({ folders: [] });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const session = await getServerSession();
        const body = await request.json();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const folder = await Record.create({
            name: body.name,
            icon: body.icon || '📁',
            color: body.color || '#0d9488',
            userId: user._id.toString(),
            type: 'folder',
        });

        return NextResponse.json({ folder }, { status: 201 });
    } catch (error) {
        console.error('Create folder error:', error);
        return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
    }
}

