"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

export default function EventDetails() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20 h-full">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
              <Calendar className="text-yellow-300" />
              Detail Acara
            </h3>
            <div className="space-y-3 text-white">
              <div className="flex items-start gap-3">
                <Calendar size={20} className="text-yellow-300 mt-1" />
                <div>
                  <p className="font-semibold">Tanggal</p>
                  <p>Sabtu, 26 Juli 2025</p>
                  <p className="text-sm text-white/80">1 Muharram 1446 H</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-yellow-300 mt-1" />
                <div>
                  <p className="font-semibold">Waktu</p>
                  <p>08:00 - Selesai</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-yellow-300 mt-1" />
                <div>
                  <p className="font-semibold">Tempat</p>
                  <p>Kompleks Yayasan Alghifari Banyuresmi</p>
                  <p className="text-sm text-white/80">
                    Jl. KH. hasan Arief KM. 10, Banyuresmi, Garut
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20 h-full">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
              <Users className="text-yellow-300" />
              Rundown Acara
            </h3>
            <div className="space-y-3 text-white text-sm">
              <div className="flex justify-between">
                <span>08:00 - 08:30</span>
                <span>Registrasi </span>
              </div>
              <div className="flex justify-between">
                <span>08:30 - 09:00</span>
                <span>Pembukaan & Tilawah</span>
              </div>
              <div className="flex justify-between">
                <span>09:00 - 10:30</span>
                <span>Ceramah 1 Muharram</span>
              </div>
              <div className="flex justify-between">
                <span>10:30 - 12:00</span>
                <span>Reuni & Sharing Session</span>
              </div>
              <div className="flex justify-between">
                <span>12:00 - 13:00</span>
                <span>Ishoma</span>
              </div>
              <div className="flex justify-between">
                <span>13:00 - 15:00</span>
                <span>Pengajian Alumni</span>
              </div>
              <div className="flex justify-between">
                <span>15:00 - 16:00</span>
                <span>Santunan Anak Yatim</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
