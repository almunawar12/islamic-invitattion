"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export default function IslamicMessage() {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.0 }}
      className="text-center mb-8"
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-6">
          <div className="text-4xl mb-4">☪</div>
          <p className="text-white text-lg mb-4 italic">
            "Dan Allah menjadikan pergantian malam dan siang itu sebagai pelajaran bagi orang-orang yang ingin mengambil
            pelajaran atau yang ingin bersyukur."
          </p>
          <p className="text-yellow-300 font-semibold">- QS. Al-Furqan: 62 -</p>
          <div className="mt-4 p-4 bg-white/5 rounded-lg">
            <p className="text-white/90">
              Mari kita sambut tahun baru Hijriah dengan penuh syukur dan tekad untuk menjadi muslim yang lebih baik.
              Sekaligus mempererat silaturahmi melalui reuni akbar IKASAN ke-3.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
