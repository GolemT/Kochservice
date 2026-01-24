import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE;

        if (token) {
            // Call backend to blacklist the token
            const response = await fetch(`${baseUrl}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Even if the backend call fails, we still clear cookies
            if (!response.ok) {
                console.error('Backend logout failed', await response.text());
            }
        }

        // Clear cookies
        cookieStore.delete('token');
        cookieStore.delete('refreshToken');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);

        // Always clear cookies even if there's an error
        const cookieStore = await cookies();
        cookieStore.delete('token');
        cookieStore.delete('refreshToken');

        return NextResponse.json(
            { error: 'Internal server error', success: true },
            { status: 500 }
        );
    }
}