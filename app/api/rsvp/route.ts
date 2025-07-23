import { type NextRequest, NextResponse } from "next/server";

// Simple in-memory storage for demo purposes
// In production, use a proper database like Supabase, MongoDB, etc.
let globalRSVPData: any[] = [];

// GET - Load all RSVP data
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      entries: globalRSVPData || [],
    });
  } catch (error) {
    console.error("Error loading RSVP data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load data",
        entries: [],
      },
      { status: 500 }
    );
  }
}

// POST - Save RSVP data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entries } = body;

    if (entries && Array.isArray(entries)) {
      // Convert timestamp strings back to Date objects for processing
      const processedEntries = entries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));

      // Update global storage
      globalRSVPData = processedEntries;

      console.log(
        "RSVP data saved successfully:",
        globalRSVPData.length,
        "entries"
      );

      return NextResponse.json({
        success: true,
        message: "Data saved successfully",
        count: globalRSVPData.length,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid data format",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error saving RSVP data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save data",
      },
      { status: 500 }
    );
  }
}
