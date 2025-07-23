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

// Find user RSVP by name and angkatan (for cross-browser recognition)
export const findUserRSVPByDetails = (
  entries: RSVPEntry[],
  name: string,
  angkatan: string
): RSVPEntry | null => {
  return (
    entries.find(
      (entry) =>
        entry.name.toLowerCase().trim() === name.toLowerCase().trim() &&
        entry.angkatan === angkatan
    ) || null
  );
};

// Local Storage Functions
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
      cache: "no-store",
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

// Check if user exists by name and angkatan
export const checkUserExists = async (
  name: string,
  angkatan: string
): Promise<RSVPEntry | null> => {
  try {
    const response = await fetch(
      `/api/rsvp/check-user?name=${encodeURIComponent(
        name
      )}&angkatan=${encodeURIComponent(angkatan)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.exists && data.user) {
        return {
          ...data.user,
          timestamp: new Date(data.user.timestamp),
        };
      }
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
  }
  return null;
};

// Main hybrid functions
export const hybridSave = async (
  entries: RSVPEntry[],
  currentUser: RSVPEntry | null
): Promise<boolean> => {
  // Save to localStorage immediately for instant feedback
  saveToStorage(entries);
  saveCurrentUserToStorage(currentUser);

  // Try to save to server
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
    // Load all entries from server
    const serverEntries = await loadFromServer();
    entries = serverEntries;

    // Sync server data to localStorage
    saveToStorage(entries);

    // Check if current user exists in server data by ID first
    const userId = getUserIdentifier();
    let userFromServer: RSVPEntry | undefined = entries.find(
      (entry) => entry.id === userId
    );

    // If not found by ID, check localStorage for current user data
    if (!userFromServer) {
      const localCurrentUser = loadCurrentUserFromStorage();
      if (localCurrentUser) {
        // Try to find by name and angkatan
        userFromServer =
          findUserRSVPByDetails(
            entries,
            localCurrentUser.name,
            localCurrentUser.angkatan
          ) || undefined;

        if (userFromServer) {
          // Update the user ID to match current browser
          userFromServer.id = userId;
          // Update the entry in the list
          const entryIndex = entries.findIndex(
            (entry) =>
              entry.name.toLowerCase().trim() ===
                localCurrentUser.name.toLowerCase().trim() &&
              entry.angkatan === localCurrentUser.angkatan
          );
          if (entryIndex !== -1) {
            entries[entryIndex] = userFromServer;
            // Save updated entries back to server
            await saveToServer(entries, userFromServer);
          }
        }
      }
    }

    if (userFromServer) {
      currentUser = userFromServer;
      saveCurrentUserToStorage(currentUser);
    }

    return { entries, currentUser };
  } catch (error) {
    console.warn("Server load failed, using localStorage:", error);

    // Fallback to localStorage
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
