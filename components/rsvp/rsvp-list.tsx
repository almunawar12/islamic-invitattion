"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Users } from "lucide-react"
import type { RSVPEntry } from "@/types/rsvp"

interface RSVPListProps {
  rsvpEntries: RSVPEntry[]
  currentUserRSVP: RSVPEntry | null
}

export default function RSVPList({ rsvpEntries, currentUserRSVP }: RSVPListProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Baru saja"
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
          <Users size={20} />
          Daftar Konfirmasi ({rsvpEntries.length})
        </h4>
        {rsvpEntries.length > 0 && <div className="text-sm text-white/70">Diurutkan berdasarkan terbaru</div>}
      </div>

      <div className="max-h-96 overflow-y-auto space-y-3 bg-white/5 rounded-lg p-4 border border-white/10">
        {rsvpEntries.length > 0 ? (
          rsvpEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 p-3 rounded-lg transition-all duration-200 ${
                entry.status === "attending"
                  ? "bg-green-600/10 border border-green-600/20"
                  : "bg-red-600/10 border border-red-600/20"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  entry.status === "attending" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {getInitials(entry.name)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-white text-sm">{entry.name}</h5>
                      <Badge
                        variant="secondary"
                        className={`text-xs px-2 py-0.5 ${
                          entry.status === "attending" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                        }`}
                      >
                        Angkatan {entry.angkatan}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-sm font-medium ${
                          entry.status === "attending" ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {entry.status === "attending" ? "✅ Akan Hadir" : "❌ Tidak Hadir"}
                      </span>
                    </div>

                    <p className="text-white/70 text-xs mb-1">📍 {entry.address}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-white/50 text-xs">{formatTimestamp(entry.timestamp)}</span>
                  {entry.id === currentUserRSVP?.id && (
                    <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-400">
                      Anda
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="mb-4">
              <MessageCircle size={64} className="mx-auto text-white/30" />
            </div>
            <h5 className="text-white/70 text-lg font-semibold mb-2">Belum Ada Konfirmasi</h5>
            <p className="text-white/50 text-sm mb-4">Belum ada yang melakukan konfirmasi kehadiran untuk acara ini.</p>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm">
                💡 <strong>Jadilah yang pertama!</strong> Konfirmasi kehadiran Anda dengan mengklik tombol di atas.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Load More Button (for future pagination) */}
      {rsvpEntries.length > 10 && (
        <div className="text-center mt-4">
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            Muat Lebih Banyak
          </Button>
        </div>
      )}
    </div>
  )
}
