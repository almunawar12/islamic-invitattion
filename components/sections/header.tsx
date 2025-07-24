/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2 } from "lucide-react";

interface HeaderProps {
  guestName?: string;
  onShare: () => void;
}

export default function Header({ guestName, onShare }: HeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-2 mb-4"
        >
          <Button
            onClick={onShare}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Share2 size={16} className="mr-2" />
            Bagikan
          </Button>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          🌙 1 Muharram 1447 H 🌙
        </h1>
        <p className="text-xl md:text-2xl text-yellow-300 font-semibold mb-2">
          Tahun Baru Islam
        </p>
        <p className="text-lg md:text-xl text-white/90 font-medium">
          & Reuni Akbar IKASAN ke-3
        </p>
      </div>

      {/* Personal Greeting */}
      {guestName && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 inline-block">
            <CardContent className="p-6">
              <p className="text-white text-lg mb-2">
                Assalamu'alaikum Warahmatullahi Wabarakatuh
              </p>
              <p className="text-yellow-300 text-xl font-bold">
                Kepada Yth. Bapak/Ibu/Saudara/i
              </p>
              <p className="text-white text-2xl font-bold mt-2">{guestName}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Invitation Message */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-8"
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🕌</div>

            <div className="space-y-4 text-white">
              <p className="text-lg leading-relaxed">
                Dengan ini kami mengundang{" "}
                {guestName ? `Yth. ${guestName}` : "Bapak/Ibu/Saudara/i"} untuk
                menghadiri acara
              </p>

              <div className="bg-white/5 rounded-lg p-4 my-4">
                <h3 className="text-xl font-bold text-yellow-300 mb-2">
                  🌙 PERINGATAN 1 MUHARRAM 1447 H 🌙
                </h3>
                <p className="text-lg font-semibold text-white mb-1">
                  "Menyambut Tahun Baru Islam dengan Penuh Berkah"
                </p>
                <p className="text-white/90">
                  & Reuni Akbar IKASAN (Ikatan Alumni Santri Habiburrahman) ke-3
                </p>
              </div>

              <div className="space-y-2 text-white/90">
                <p className="flex items-center justify-center gap-2">
                  <span className="text-yellow-300">📅</span>
                  <strong>Sabtu, 26 Juli 2025</strong>
                  <span className="text-sm">(1 Safar 1447 H)</span>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="text-yellow-300">🕐</span>
                  <strong>08:00 - Selesai</strong>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span className="text-yellow-300">📍</span>
                  <strong>Kompleks Yayasn Alghifari Banyuresmi</strong>
                </p>
                <p className="text-sm text-white/70">
                  Jl. KH. hasan Arief KM. 10, Banyuresmi, Garut
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-400/20 to-green-400/20 rounded-lg p-4 mt-6">
                <p className="text-white font-medium leading-relaxed">
                  Acara ini akan diisi dengan{" "}
                  <strong className="text-yellow-300">
                    pengajian orang tua
                  </strong>{" "}
                  tentang "dengan semangat berhijrah kuatkan ukhuwah",
                  <strong className="text-yellow-300">
                    {" "}
                    sharing session
                  </strong>{" "}
                  alumni, dan berbagai kegiatan menarik lainnya.
                </p>
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-lg border border-yellow-400/30">
                <p className="text-yellow-300 font-semibold mb-2">
                  Kehadiran Bapak/Ibu/Saudara/i sangat kami harapkan
                </p>
                <p className="text-white/90 text-sm">
                  Mari bersama-sama menyambut tahun baru Hijriah dengan penuh
                  syukur dan mempererat tali silaturahmi sesama alumni.
                </p>
              </div>

              <div className="text-center mt-6">
                <p className="text-white/80 text-sm italic">
                  "Barangsiapa yang menghidupkan sunnah-Ku, maka dia telah
                  mencintai-Ku. Dan barangsiapa yang mencintai-Ku, dia akan
                  bersamaku di surga."
                </p>
                <p className="text-yellow-300 text-sm font-semibold mt-2">
                  - HR. Tirmidzi -
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mb-8"
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-3xl">🤝</div>
              <h3 className="text-xl font-bold text-yellow-300">
                Mari Bergabung Bersama Kami
              </h3>
              <p className="text-white/90">
                Jangan lewatkan kesempatan emas ini untuk berkumpul, berbagi
                ilmu, dan mempererat persaudaraan dalam menyambut tahun baru
                Hijriah 1447 H.
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <span className="bg-green-600/30 text-green-300 px-3 py-1 rounded-full">
                  ✨ Ceramah Inspiratif
                </span>
                <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full">
                  🎯 Sharing Session
                </span>
                <span className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full">
                  🎁 Santunan Anak Yatim
                </span>
                <span className="bg-orange-600/30 text-orange-300 px-3 py-1 rounded-full">
                  🍽️ Makan Bersama
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
