/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4 }}
      className="text-center mt-8 text-white/80"
    >
      <p className="mb-2">Wassalamu'alaikum Warahmatullahi Wabarakatuh</p>
      <p className="font-semibold">
        Panitia Acara PHBI Tahun Baru Islam & Reuni IKASAN ke-3
      </p>
      <div className="mt-4 text-sm">
        <p>Contact Person:</p>
        <p>📱 +62 878-2876-6807 (Ust. Eep Saepuloh)</p>
        <p>📱 +62 815-7282-1255 (Ust. Andrian Ahmad Shodikin)</p>
      </div>
    </motion.div>
  );
}
