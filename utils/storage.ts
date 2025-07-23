import type { RSVPEntry } from "@/types/rsvp";

const STORAGE_KEY = "islamic-invitation-rsvp";
const CURRENT_USER_KEY = "islamic-invitation-current-user";
const API_BASE_URL = "/api/rsvp"; // We'll create API endpoints

// Local Storage Functions (fallback)
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

// Server-side storage functions
export const saveToServer = async (data: RSVPEntry[]): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ entries: data }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error saving to server:", error);
    return false;
  }
};

export const loadFromServer = async (): Promise<RSVPEntry[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/load`);
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

export const saveCurrentUserToServer = async (
  data: RSVPEntry | null
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/save-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: data }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error saving user to server:", error);
    return false;
  }
};

export const loadCurrentUserFromServer = async (
  identifier: string
): Promise<RSVPEntry | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/load-user?id=${encodeURIComponent(identifier)}`
    );
    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        return {
          ...data.user,
          timestamp: new Date(data.user.timestamp),
        };
      }
    }
  } catch (error) {
    console.error("Error loading user from server:", error);
  }
  return null;
};

// Hybrid storage functions (try server first, fallback to localStorage)
export const hybridSave = async (
  entries: RSVPEntry[],
  currentUser: RSVPEntry | null
) => {
  // Save to localStorage immediately for instant feedback
  saveToStorage(entries);
  saveCurrentUserToStorage(currentUser);

  // Try to save to server in background
  try {
    await saveToServer(entries);
    if (currentUser) {
      await saveCurrentUserToServer(currentUser);
    }
  } catch (error) {
    console.warn("Server save failed, using localStorage only:", error);
  }
};

export const hybridLoad = async (): Promise<{
  entries: RSVPEntry[];
  currentUser: RSVPEntry | null;
}> => {
  // Try to load from server first
  try {
    const serverEntries = await loadFromServer();
    const localCurrentUser = loadCurrentUserFromStorage();

    if (serverEntries.length > 0) {
      // Sync server data to localStorage
      saveToStorage(serverEntries);
      return { entries: serverEntries, currentUser: localCurrentUser };
    }
  } catch (error) {
    console.warn("Server load failed, using localStorage:", error);
  }

  // Fallback to localStorage
  const localEntries = loadFromStorage();
  const localCurrentUser = loadCurrentUserFromStorage();

  return { entries: localEntries, currentUser: localCurrentUser };
};

// Clear all data
export const clearAllRSVPData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Generate unique identifier for user session
export const generateUserIdentifier = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `user_${timestamp}_${random}`;
};

// Check if user has a stored identifier
export const getUserIdentifier = (): string => {
  if (typeof window !== "undefined") {
    let identifier = localStorage.getItem("user-identifier");
    if (!identifier) {
      identifier = generateUserIdentifier();
      localStorage.setItem("user-identifier", identifier);
    }
    return identifier;
  }
  return generateUserIdentifier();
};
