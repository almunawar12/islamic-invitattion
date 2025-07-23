import { type NextRequest, NextResponse } from "next/server";

// Simple in-memory storage for user data
const userData: { [key: string]: any } = {};

export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json();

    if (user && user.id) {
      // In production, save to your database here
      userData[user.id] = user;
    }

    return NextResponse.json({
      success: true,
      message: "User data saved successfully",
    });
  } catch (error) {
    console.error("Error saving user data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save user data" },
      { status: 500 }
    );
  }
}
