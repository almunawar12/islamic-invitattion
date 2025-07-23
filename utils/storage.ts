import type { RSVPEntry } from "@/types/rsvp";

const STORAGE_KEY = "islamic-invitation-rsvp";
const CURRENT_USER_KEY = "islamic-invitation-current-user";
const USER_ID_KEY = "islamic-invitation-user-id";

// Generate unique identifier for user
export const generateUserIdentifier = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `user_${timestamp}_${random}`;
};

// Get or create user identifier
export const getUserIdentifier = (): string => {
  if (typeof window !== "undefined") {
    let identifier = localStorage.getItem(USER_ID_KEY);
    if (!identifier) {
      identifier = generateUserIdentifier();
      localStorage.setItem(USER_ID_KEY, identifier);
    }
    return identifier;
  }
  return generateUserIdentifier();
};

// Local Storage Functions (for caching and offline support)
export const saveToStorage = (data: RSVPEntry[]) => {
  if (typeof window !== "undefined") {
    try {
      const serializedData = JSON.stringify(
        data.map((entry) => ({
          ...entry,
          timestamp: entry.timestamp.toISOString(),
        }))
      );
      localStorage.setItem(STORAGE_KEY, serializedData);
      console.log("Data saved to localStorage:", data.length, "entries");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }
};

export const loadFromStorage = (): RSVPEntry[] => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const entries = parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        console.log(
          "Data loaded from localStorage:",
          entries.length,
          "entries"
        );
        return entries;
      }
    } catch (error) {
      console.error("Error parsing stored RSVP data:", error);
    }
  }
  return [];
};

export const saveCurrentUserToStorage = (data: RSVPEntry | null) => {
  if (typeof window !== "undefined") {
    try {
      if (data) {
        localStorage.setItem(
          CURRENT_USER_KEY,
          JSON.stringify({
            ...data,
            timestamp: data.timestamp.toISOString(),
          })
        );
        console.log("Current user saved to localStorage:", data.name);
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
        console.log("Current user removed from localStorage");
      }
    } catch (error) {
      console.error("Error saving current user to localStorage:", error);
    }
  }
};

export const loadCurrentUserFromStorage = (): RSVPEntry | null => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const user = {
          ...parsed,
          timestamp: new Date(parsed.timestamp),
        };
        console.log("Current user loaded from localStorage:", user.name);
        return user;
      }
    } catch (error) {
      console.error("Error parsing stored current user data:", error);
    }
  }
  return null;
};

// Server API functions with better error handling
export const saveToServer = async (entries: RSVPEntry[]): Promise<boolean> => {
  try {
    console.log("Saving to server:", entries.length, "entries");

    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entries: entries.map((entry) => ({
          ...entry,
          timestamp: entry.timestamp.toISOString(),
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Server responded with ${response.status}: ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Server save result:", result);
    return result.success;
  } catch (error) {
    console.error("Error saving to server:", error);
    return false;
  }
};

export const loadFromServer = async (): Promise<RSVPEntry[]> => {
  try {
    console.log("Loading from server...");

    const response = await fetch("/api/rsvp", {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Server responded with ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    const entries = data.entries.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));

    console.log("Server load result:", entries.length, "entries");
    return entries;
  } catch (error) {
    console.error("Error loading from server:", error);
    return [];
  }
};

// Main hybrid functions with improved error handling
export const hybridSave = async (
  entries: RSVPEntry[],
  currentUser: RSVPEntry | null
): Promise<boolean> => {
  console.log("Starting hybrid save...");

  // Always save to localStorage first for immediate feedback
  saveToStorage(entries);
  saveCurrentUserToStorage(currentUser);

  // Try to save to server
  const serverSuccess = await saveToServer(entries);

  if (serverSuccess) {
    console.log("Hybrid save successful");
  } else {
    console.warn("Server save failed, data saved locally only");
  }

  return serverSuccess;
};

export const hybridLoad = async (): Promise<{
  entries: RSVPEntry[];
  currentUser: RSVPEntry | null;
}> => {
  console.log("Starting hybrid load...");

  let entries: RSVPEntry[] = [];
  let currentUser: RSVPEntry | null = null;

  try {
    // Try to load from server first
    const serverEntries = await loadFromServer();

    if (serverEntries.length > 0) {
      console.log("Using server data");
      entries = serverEntries;
      // Cache server data to localStorage
      saveToStorage(entries);
    } else {
      console.log("Server data empty, trying localStorage");
      // Fallback to localStorage
      entries = loadFromStorage();
    }

    // Find current user
    const userId = getUserIdentifier();
    currentUser = entries.find((entry) => entry.id === userId) || null;

    // If not found by ID, check by localStorage current user data
    if (!currentUser) {
      const localCurrentUser = loadCurrentUserFromStorage();
      if (localCurrentUser) {
        currentUser =
          entries.find(
            (entry) =>
              entry.name.toLowerCase().trim() ===
                localCurrentUser.name.toLowerCase().trim() &&
              entry.angkatan === localCurrentUser.angkatan
          ) || null;

        // Update ID if found
        if (currentUser && currentUser.id !== userId) {
          currentUser.id = userId;
          const updatedEntries = entries.map((entry) =>
            entry.name.toLowerCase().trim() ===
              localCurrentUser.name.toLowerCase().trim() &&
            entry.angkatan === localCurrentUser.angkatan
              ? currentUser!
              : entry
          );
          entries = updatedEntries;
          // Save updated entries
          await saveToServer(entries);
          saveToStorage(entries);
        }
      }
    }

    console.log(
      "Hybrid load completed:",
      entries.length,
      "entries, current user:",
      currentUser?.name || "none"
    );
    return { entries, currentUser };
  } catch (error) {
    console.error("Error in hybrid load:", error);

    // Final fallback to localStorage only
    entries = loadFromStorage();
    currentUser = loadCurrentUserFromStorage();

    return { entries, currentUser };
  }
};

// Clear all data
export const clearAllRSVPData = async () => {
  console.log("Clearing all RSVP data...");

  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }

  try {
    await saveToServer([]);
    console.log("All data cleared successfully");
  } catch (error) {
    console.warn("Could not clear server data:", error);
  }
};
