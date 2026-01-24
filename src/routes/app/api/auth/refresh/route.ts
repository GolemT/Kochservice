import {cookies} from 'next/headers';
import { NextResponse} from 'next/server';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refreshToken')?.value;
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE;

        if (!refreshToken) {
            return NextResponse.json(
                { error: 'No refresh token found' },
                { status: 401 }
            );
        }

        const response = await fetch(`${baseUrl}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            // Clear cookies if refresh fails
            cookieStore.delete('token');
            cookieStore.delete('refreshToken');

            return NextResponse.json(
                { error: 'Token refresh failed' },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Set new tokens
        cookieStore.set('token', data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            // Use server-provided expiry if available, or default to 15 minutes
            maxAge: 60 * 15,
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

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Token refresh error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}