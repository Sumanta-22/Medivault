import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
    try {
        await connectDB();
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ profile: null });
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ profile: null });
        }

        return NextResponse.json({
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
        return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        await connectDB();
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { emergencyProfile: body.emergencyProfile },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ profile: user.emergencyProfile });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}

