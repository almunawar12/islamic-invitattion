"use client"

import { Button } from "@/components/ui/button"
import type { RSVPEntry } from "@/types/rsvp"

interface RSVPUserCardProps {
  currentUserRSVP: RSVPEntry
  onReset: () => void
}

export default function RSVPUserCard({ currentUserRSVP, onReset }: RSVPUserCardProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="text-4xl mb-4">{currentUserRSVP.status === "attending" ? "✅" : "❌"}</div>

      <div className="bg-white/5 rounded-lg p-4 text-left max-w-md mx-auto border-2 border-yellow-400/50">
        <h4 className="text-yellow-300 font-semibold mb-3 text-center">Konfirmasi Anda</h4>
        <div className="space-y-2 text-white">
          <div className="flex justify-between">
            <span className="text-white/70">Nama:</span>
            <span className="font-semibold">{currentUserRSVP.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Status:</span>
            <span
              className={`font-semibold ${currentUserRSVP.status === "attending" ? "text-green-400" : "text-red-400"}`}
            >
              {currentUserRSVP.status === "attending" ? "Hadir" : "Tidak Hadir"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Angkatan:</span>
            <span className="font-semibold">{currentUserRSVP.angkatan}</span>
          </div>
        </div>
      </div>

      <p className="text-white text-lg">
        {currentUserRSVP.status === "attending"
          ? "Terima kasih! Kami menunggu kehadiran Anda."
          : "Terima kasih atas konfirmasinya."}
      </p>

      <Button
        onClick={onReset}
        variant="outline"
        size="sm"
        className="mt-3 border-white/20 text-white hover:bg-white/10 bg-transparent"
      >
        Ubah Konfirmasi
      </Button>
    </div>
  )
}
