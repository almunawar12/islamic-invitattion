import { Suspense } from "react"
import InvitationContent from "@/components/invitation-content"

interface PageProps {
  params: {
    name: string
  }
}

export default function PersonalizedInvitation({ params }: PageProps) {
  const decodedName = decodeURIComponent(params.name)

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center">
          <div className="text-white text-xl">Memuat undangan...</div>
        </div>
      }
    >
      <InvitationContent guestName={decodedName} />
    </Suspense>
  )
}
