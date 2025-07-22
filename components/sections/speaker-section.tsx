/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { User, Star, Heart } from "lucide-react";

export default function SpeakerSection() {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.0 }}
      className="mb-8"
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold text-yellow-300 mb-6 text-center flex items-center justify-center gap-2">
            <User className="text-yellow-300" />
            Mubaligh & Pemateri
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Mubaligh 1 */}
            <div className="text-center">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <img
                  src="/placeholder.svg?height=128&width=128"
                  alt="Kyai Asep Abdul Ghafur, S.Pd.I"
                  className="w-full h-full rounded-full object-cover border-4 border-yellow-300"
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-300 rounded-full p-2">
                  <Star size={16} className="text-emerald-900" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                Kyai Asep Abdul Ghafur, S.Pd.I
              </h4>
              <p className="text-yellow-300 font-semibold mb-2">
                Pimpinan Pesantren Habiburrahman
              </p>
              <p className="text-white/80 text-sm mb-3">
                Ketua Yayasan Alghifari Banyuresmi
              </p>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/90 text-sm italic">
                  "Opening Ceremony & Sambutan"
                </p>
              </div>
            </div>

            {/* Mubaligh 2 */}
            <div className="text-center">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <img
                  src="/placeholder.svg?height=128&width=128"
                  alt="KH. Badru Munir Gojali, M.Ag"
                  className="w-full h-full rounded-full object-cover border-4 border-yellow-300"
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-300 rounded-full p-2">
                  <Heart size={16} className="text-emerald-900" />
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                KH. Badru Munir Gojali, M.Ag
              </h4>
              <p className="text-yellow-300 font-semibold mb-2">Mubaligh</p>
              <p className="text-white/80 text-sm mb-3">
                Ketua MWC Nahdlatul Ulama Banyuresmi
              </p>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/90 text-sm italic">
                  "Peran Mubaligh dalam Masyarakat"
                </p>
              </div>
            </div>
          </div>

          {/* <div className="mt-6 text-center">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/90 text-sm">
                <strong className="text-yellow-300">Moderator:</strong> Ustadz
                Muhammad Ridwan, S.Ag
              </p>
              <p className="text-white/80 text-xs mt-1">Ketua IKASAN Pusat</p>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </motion.div>
  );
}
