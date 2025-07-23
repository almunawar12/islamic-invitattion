import { type NextRequest, NextResponse } from "next/server";

// In a real application, you would use a database
const rsvpData: any[] = [];

export async function GET(request: NextRequest) {
  try {
    // In production, load from your database here
    return NextResponse.json({
      success: true,
      entries: rsvpData || [],
    });
  } catch (error) {
    console.error("Error loading RSVP data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load data", entries: [] },
      { status: 500 }
    );
  }
}
