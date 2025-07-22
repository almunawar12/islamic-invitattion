"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, MapPin } from "lucide-react";

export default function MapSection() {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.1 }}
      className="mb-8"
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold text-yellow-300 mb-6 text-center flex items-center justify-center gap-2">
            <Map className="text-yellow-300" />
            Lokasi Acara
          </h3>

          <div className="space-y-4">
            <div className="text-center text-white">
              <h4 className="text-xl font-bold mb-2">
                Kompleks Yayasan Alghifari Banyuresmi
              </h4>
              <p className="text-white/80 mb-4">
                Jl. KH. Hasan Arief KM. 10, Banyuresmi, Garut
              </p>
            </div>

            {/* Embedded Map */}
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.812452384574!2d107.94726837499864!3d-7.1476728928566295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68b6a6d9f2d11b%3A0xd8a52e01deed2cf5!2sAl%20Ghifari%20Banyuresmi!5e0!3m2!1sen!2sid!4v1753168891444!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </div>

            {/* Location Details */}
            {/* <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h5 className="text-yellow-300 font-semibold mb-2">
                  🚗 Akses Transportasi
                </h5>
                <ul className="text-white/90 text-sm space-y-1">
                  <li>• TransJakarta: Halte Cipayung</li>
                  <li>• KRL: Stasiun Cipayung (10 menit jalan kaki)</li>
                  <li>• Angkot: Jurusan Cipayung - Cililitan</li>
                  <li>• Parkir tersedia di area masjid</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h5 className="text-yellow-300 font-semibold mb-2">
                  📍 Landmark Terdekat
                </h5>
                <ul className="text-white/90 text-sm space-y-1">
                  <li>• Seberang SMA Negeri 87 Jakarta</li>
                  <li>• 200m dari Pasar Cipayung</li>
                  <li>• Dekat dengan Puskesmas Cipayung</li>
                  <li>• Area Perumahan Cipayung Indah</li>
                </ul>
              </div>
            </div> */}

            <div className="text-center mt-4">
              <Button
                onClick={() =>
                  window.open(
                    "https://maps.app.goo.gl/u4GMcnqdZoHmdLJ77",
                    "_blank"
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
              >
                <MapPin size={16} className="mr-2" />
                Buka di Google Maps
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
