"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"
import RSVPForm from "@/components/rsvp/rsvp-form"
import RSVPList from "@/components/rsvp/rsvp-list"
import RSVPStats from "@/components/rsvp/rsvp-stats"
import RSVPButtons from "@/components/rsvp/rsvp-buttons"
import RSVPUserCard from "@/components/rsvp/rsvp-user-card"
import type { RSVPEntry } from "@/types/rsvp"
import { loadFromStorage, saveToStorage, loadCurrentUserFromStorage, saveCurrentUserToStorage } from "@/utils/storage"

export default function RSVPSection() {
  const [rsvpStatus, setRsvpStatus] = useState<"pending" | "attending" | "not-attending">("pending")
  const [showRSVPForm, setShowRSVPForm] = useState(false)
  const [rsvpEntries, setRsvpEntries] = useState<RSVPEntry[]>([])
  const [currentUserRSVP, setCurrentUserRSVP] = useState<RSVPEntry | null>(null)

  const handleRSVP = (status: "attending" | "not-attending") => {
    setRsvpStatus(status)
    setShowRSVPForm(true)
  }

  const handleFormSubmit = (formData: { name: string; address: string; angkatan: string }) => {
    const newEntry: RSVPEntry = {
      id: Date.now().toString(),
      ...formData,
      status: rsvpStatus,
      timestamp: new Date(),
    }

    const updatedEntries = [newEntry, ...rsvpEntries]
    setRsvpEntries(updatedEntries)
    setCurrentUserRSVP(newEntry)
    setShowRSVPForm(false)

    // Save to localStorage
    saveToStorage(updatedEntries)
    saveCurrentUserToStorage(newEntry)
  }

  const resetRSVP = () => {
    if (currentUserRSVP) {
      const updatedEntries = rsvpEntries.filter((entry) => entry.id !== currentUserRSVP.id)
      setRsvpEntries(updatedEntries)
      saveToStorage(updatedEntries)
    }
    setRsvpStatus("pending")
    setCurrentUserRSVP(null)
    setShowRSVPForm(false)

    // Clear from localStorage
    saveCurrentUserToStorage(null)
  }

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedEntries = loadFromStorage()
    const storedCurrentUser = loadCurrentUserFromStorage()

    setRsvpEntries(storedEntries)

    if (storedCurrentUser) {
      setCurrentUserRSVP(storedCurrentUser)
      setRsvpStatus(storedCurrentUser.status)
    }
  }, [])

  const attendingCount = rsvpEntries.filter((entry) => entry.status === "attending").length
  const notAttendingCount = rsvpEntries.filter((entry) => entry.status === "not-attending").length

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="text-center mb-8"
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center justify-center gap-2">
            <MessageCircle className="text-yellow-300" />
            Konfirmasi Kehadiran
          </h3>

          {/* Statistics */}
          <RSVPStats attendingCount={attendingCount} notAttendingCount={notAttendingCount} />

          {currentUserRSVP ? (
            // Display Current User's RSVP
            <RSVPUserCard currentUserRSVP={currentUserRSVP} onReset={resetRSVP} />
          ) : showRSVPForm ? (
            // RSVP Form
            <RSVPForm rsvpStatus={rsvpStatus} onSubmit={handleFormSubmit} onCancel={() => setShowRSVPForm(false)} />
          ) : (
            // Initial RSVP Buttons
            <RSVPButtons onRSVP={handleRSVP} />
          )}

          {/* RSVP List */}
          <RSVPList rsvpEntries={rsvpEntries} currentUserRSVP={currentUserRSVP} />
        </CardContent>
      </Card>
    </motion.div>
  )
}
