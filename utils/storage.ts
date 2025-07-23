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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const loadFromStorage = (): RSVPEntry[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
      } catch (error) {
        console.error("Error parsing stored RSVP data:", error);
        return [];
      }
    }
  }
  return [];
};

export const saveCurrentUserToStorage = (data: RSVPEntry | null) => {
  if (typeof window !== "undefined") {
    if (data) {
      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
          ...data,
          timestamp: data.timestamp.toISOString(),
        })
      );
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }
};

export const loadCurrentUserFromStorage = (): RSVPEntry | null => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          timestamp: new Date(parsed.timestamp),
        };
      } catch (error) {
        console.error("Error parsing stored current user data:", error);
        return null;
      }
    }
  }
  return null;
};

// Server API functions
export const saveToServer = async (
  entries: RSVPEntry[],
  currentUser?: RSVPEntry | null
): Promise<boolean> => {
  try {
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
        user: currentUser
          ? {
              ...currentUser,
              timestamp: currentUser.timestamp.toISOString(),
            }
          : null,
      }),
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Error saving to server:", error);
    return false;
  }
};

export const loadFromServer = async (): Promise<RSVPEntry[]> => {
  try {
    const response = await fetch("/api/rsvp", {
      method: "GET",
      cache: "no-store", // Always get fresh data
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.entries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));
    }
  } catch (error) {
    console.error("Error loading from server:", error);
  }
  return [];
};

// Main hybrid functions
export const hybridSave = async (
  entries: RSVPEntry[],
  currentUser: RSVPEntry | null
): Promise<boolean> => {
  // Save to localStorage immediately for instant feedback
  saveToStorage(entries);
  saveCurrentUserToStorage(currentUser);

  // Save to server (shared across all browsers)
  const serverSuccess = await saveToServer(entries, currentUser);

  if (!serverSuccess) {
    console.warn("Server save failed, data saved locally only");
  }

  return serverSuccess;
};

export const hybridLoad = async (): Promise<{
  entries: RSVPEntry[];
  currentUser: RSVPEntry | null;
}> => {
  let entries: RSVPEntry[] = [];
  let currentUser: RSVPEntry | null = null;

  try {
    // Always try to load from server first to get shared data
    const serverEntries = await loadFromServer();
    entries = serverEntries;

    // Cache server data to localStorage for offline access
    saveToStorage(entries);

    // Check if current user exists in the shared data
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
      }
    }

    return { entries, currentUser };
  } catch (error) {
    console.warn("Server load failed, using localStorage:", error);

    // Fallback to localStorage (offline mode)
    entries = loadFromStorage();
    currentUser = loadCurrentUserFromStorage();

    return { entries, currentUser };
  }
};

// Clear all data
export const clearAllRSVPData = async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }

  try {
    await saveToServer([], null);
  } catch (error) {
    console.warn("Could not clear server data:", error);
  }
};
