"use client"

import type React from "react"

import { Home, Calendar, User, Map, MessageCircle, Phone } from "lucide-react"

interface BottomNavigationProps {
  activeSection: string
  onNavigate: (ref: React.RefObject<HTMLDivElement>, section: string) => void
  refs: {
    homeRef: React.RefObject<HTMLDivElement>
    eventRef: React.RefObject<HTMLDivElement>
    speakerRef: React.RefObject<HTMLDivElement>
    mapRef: React.RefObject<HTMLDivElement>
    rsvpRef: React.RefObject<HTMLDivElement>
    contactRef: React.RefObject<HTMLDivElement>
  }
}

export default function BottomNavigation({ activeSection, onNavigate, refs }: BottomNavigationProps) {
  const navItems = [
    { key: "home", icon: Home, label: "Home", ref: refs.homeRef },
    { key: "event", icon: Calendar, label: "Acara", ref: refs.eventRef },
    { key: "speaker", icon: User, label: "Pemateri", ref: refs.speakerRef },
    { key: "map", icon: Map, label: "Lokasi", ref: refs.mapRef },
    { key: "rsvp", icon: MessageCircle, label: "RSVP", ref: refs.rsvpRef },
    { key: "contact", icon: Phone, label: "Kontak", ref: refs.contactRef },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-emerald-900/95 backdrop-blur-md border-t border-white/20 z-50">
      <div className="flex justify-around items-center py-2 px-2 max-w-lg mx-auto">
        {navItems.map(({ key, icon: Icon, label, ref }) => (
          <button
            key={key}
            onClick={() => onNavigate(ref, key)}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
              activeSection === key
                ? "bg-yellow-400 text-emerald-900"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Icon size={18} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
