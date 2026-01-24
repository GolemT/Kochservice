import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  // Falls Username fehlt, Fehler zurückgeben
  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }
  try {
    // Get cookies from the request
    const token = request.cookies.get("token")?.value;

    // Check if we have a token
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE;
    if (!baseUrl) {
      return NextResponse.json(
        { error: "API base URL is not configured" },
        { status: 500 }
      );
    }

    // Correct URL for backend - using /user/ not /api/user/
    const url = `${baseUrl}/user/${username}`;

    // Forward the token to the backend
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      // Disable caching to always get fresh data
      cache: "no-store",
    });
    if (!response.ok) {
      const errorMessage = `Error fetching user: ${response.status} ${response.statusText}`;
      console.error(errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in user API route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  // Falls Username fehlt, Fehler zurückgeben
  if (!username) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  try {
    // Get cookies from the request
    const token = request.cookies.get("token")?.value;

    // Check if we have a token
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE;
    if (!baseUrl) {
      return NextResponse.json(
        { error: "API base URL is not configured" },
        { status: 500 }
      );
    }

    // Correct URL for backend - using /user/ not /api/user/
    const url = `${baseUrl}/user/${username}`;

    // Forward the token to the backend
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "DELETE",
      credentials: "include",
      // Disable caching to always get fresh data
    });

    if (!response.ok) {
      const errorMessage = `Error deleting user: ${response.status} ${response.statusText}`;
      console.error(errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in user API route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
