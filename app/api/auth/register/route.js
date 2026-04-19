import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Record from '@/models/Record';

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const { name, email, password, accountType, familyMembers } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            accountType: accountType || 'individual',
            familyMembers: familyMembers || [],
        });

        // Seed default folders
        const defaultFolders = [
            { name: 'Blood Tests', icon: '🩸', color: '#dc2626' },
            { name: 'Prescriptions', icon: '💊', color: '#0d9488' },
            { name: 'X-Rays', icon: '🦴', color: '#0284c7' },
            { name: 'MRI Scans', icon: '🧠', color: '#7c3aed' },
            { name: 'Vaccinations', icon: '💉', color: '#16a34a' },
            { name: 'Dental Records', icon: '🦷', color: '#f59e0b' },
        ];

        await Record.insertMany(
            defaultFolders.map((f) => ({
                ...f,
                userId: user._id.toString(),
                type: 'folder',
            }))
        );

        return NextResponse.json(
            {
                message: 'Account created successfully',
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    accountType: user.accountType,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        );
    }
}

