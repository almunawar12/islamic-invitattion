"use client"

import { Button } from "@/components/ui/button"
import { Heart, MessageCircle } from "lucide-react"

interface RSVPButtonsProps {
  onRSVP: (status: "attending" | "not-attending") => void
}

export default function RSVPButtons({ onRSVP }: RSVPButtonsProps) {
  return (
    <div className="space-y-4 mb-6">
      <p className="text-white mb-4">Mohon konfirmasi kehadiran Anda:</p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Button
          onClick={() => onRSVP("attending")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full flex items-center gap-2"
        >
          <Heart size={16} />
          Hadir
        </Button>
        <Button
          onClick={() => onRSVP("not-attending")}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full flex items-center gap-2"
        >
          <MessageCircle size={16} />
          Tidak Hadir
        </Button>
      </div>
    </div>
  )
}
