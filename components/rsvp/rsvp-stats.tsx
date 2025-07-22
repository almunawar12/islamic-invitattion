interface RSVPStatsProps {
  attendingCount: number
  notAttendingCount: number
}

export default function RSVPStats({ attendingCount, notAttendingCount }: RSVPStatsProps) {
  const totalCount = attendingCount + notAttendingCount

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-green-600/20 border border-green-600/30 rounded-lg p-3">
        <div className="text-2xl font-bold text-green-400">{attendingCount}</div>
        <div className="text-green-300 text-sm">Akan Hadir</div>
      </div>
      <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3">
        <div className="text-2xl font-bold text-red-400">{notAttendingCount}</div>
        <div className="text-red-300 text-sm">Tidak Hadir</div>
      </div>

      {totalCount === 0 && (
        <div className="col-span-2 text-center py-2">
          <p className="text-white/50 text-sm">🎯 Mulai konfirmasi kehadiran untuk melihat statistik</p>
        </div>
      )}
    </div>
  )
}
