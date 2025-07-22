export interface RSVPEntry {
  id: string
  name: string
  address: string
  angkatan: string
  status: "attending" | "not-attending"
  timestamp: Date
  avatar?: string
}
