import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    await connectDB();
    const { fullName, email, password } = await req.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

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
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
