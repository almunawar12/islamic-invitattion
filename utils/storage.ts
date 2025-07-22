import type { RSVPEntry } from "@/types/rsvp"

const STORAGE_KEY = "islamic-invitation-rsvp"
const CURRENT_USER_KEY = "islamic-invitation-current-user"

export const saveToStorage = (data: RSVPEntry[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

export const loadFromStorage = (): RSVPEntry[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Convert timestamp strings back to Date objects
        return parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }))
      } catch (error) {
        console.error("Error parsing stored RSVP data:", error)
        return []
      }
    }
  }
  return []
}

export const saveCurrentUserToStorage = (data: RSVPEntry | null) => {
  if (typeof window !== "undefined") {
    if (data) {
      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({
          ...data,
          timestamp: data.timestamp.toISOString(),
        }),
      )
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  }
}

export const loadCurrentUserFromStorage = (): RSVPEntry | null => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(CURRENT_USER_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return {
          ...parsed,
          timestamp: new Date(parsed.timestamp),
        }
      } catch (error) {
        console.error("Error parsing stored current user data:", error)
        return null
      }
    }
  }
  return null
}

// Function to clear all RSVP data (for testing/reset purposes)
export const clearAllRSVPData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

// Function to check if this is first visit
export const isFirstVisit = (): boolean => {
  if (typeof window !== "undefined") {
    const hasData = localStorage.getItem(STORAGE_KEY) !== null
    return !hasData
  }
  return true
}
