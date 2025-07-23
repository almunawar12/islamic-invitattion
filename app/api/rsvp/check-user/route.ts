import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "rsvp.json");

async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return { entries: [], users: {} };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const angkatan = searchParams.get("angkatan");

    if (!name || !angkatan) {
      return NextResponse.json({ exists: false, user: null });
    }

    const data = await readData();
    const entries = data.entries || [];

    // Find user by name and angkatan
    const existingUser = entries.find(
      (entry: any) =>
        entry.name.toLowerCase().trim() === name.toLowerCase().trim() &&
        entry.angkatan === angkatan
    );

    if (existingUser) {
      return NextResponse.json({
        exists: true,
        user: existingUser,
      });
    }

    return NextResponse.json({ exists: false, user: null });
  } catch (error) {
    console.error("Error checking user existence:", error);
    return NextResponse.json({ exists: false, user: null }, { status: 500 });
  }
}
