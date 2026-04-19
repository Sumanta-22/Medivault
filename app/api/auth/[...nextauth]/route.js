import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter email and password');
                }

                await connectDB();
                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error('No account found with this email');
                }
                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error('Invalid password');
                }

                return {
                    id: user._id.toString(),

                    name: user.name,
                    email: user.email,
                    accountType: user.accountType,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.accountType = user.accountType;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.accountType = token.accountType;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/login',
    },
    secret: process.env.NEXTAUTH_SECRET || 'medivault-dev-secret-key-change-in-production',
});

export { handler as GET, handler as POST };
