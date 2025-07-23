import { type NextRequest, NextResponse } from "next/server";

// Simple in-memory storage for user data
const userData: { [key: string]: any } = {};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (userId && userData[userId]) {
      return NextResponse.json({
        success: true,
        user: userData[userId],
      });
    }

    return NextResponse.json({
      success: true,
      user: null,
    });
  } catch (error) {
    console.error("Error loading user data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load user data", user: null },
      { status: 500 }
    );
  }
}
