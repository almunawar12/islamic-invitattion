import { Suspense } from "react"
import InvitationContent from "@/components/invitation-content"

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center">
          <div className="text-white text-xl">Memuat undangan...</div>
        </div>
      }
    >
      <InvitationContent />
    </Suspense>
  )
}
