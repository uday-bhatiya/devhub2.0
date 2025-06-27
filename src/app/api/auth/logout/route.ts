import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {

   (await cookies()).set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });

  return NextResponse.json({ message: 'Logged out successfully' });
}
