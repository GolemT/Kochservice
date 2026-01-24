import {cookies} from 'next/headers';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, name, email, password } = body;
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE;

        const response = await fetch(`${baseUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, name, email, password }),
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Registration failed' },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Set cookies
        const cookieStore = await cookies();
        cookieStore.set('token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: data.expiresIn,
            path: '/',
        });

        if (data.refreshToken) {
            cookieStore.set('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
            });
        }

        return NextResponse.json({
            success: true,
            expiresIn: data.expiresIn
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}