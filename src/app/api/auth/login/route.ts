import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
        }

        // JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        // Cookie
        (await
            cookies()).set('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60,
                path: '/',
            });

        return NextResponse.json({
            message: 'Login successful',
            user: {
                _id: user._id,
                email: user.email,
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
