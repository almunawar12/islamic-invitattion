import { type NextRequest, NextResponse } from "next/server";

// In a real application, you would use a database
// For this example, we'll use a simple in-memory storage
// In production, replace this with your preferred database (Supabase, MongoDB, etc.)

let rsvpData: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { entries } = await request.json();

    // In production, save to your database here
    rsvpData = entries;

    return NextResponse.json({
      success: true,
      message: "Data saved successfully",
    });
  } catch (error) {
    console.error("Error saving RSVP data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save data" },
      { status: 500 }
    );
  }
}
