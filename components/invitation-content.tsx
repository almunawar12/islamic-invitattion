"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import Header from "@/components/sections/header";
import EventDetails from "@/components/sections/event-details";
import SpeakerSection from "@/components/sections/speaker-section";
import MapSection from "@/components/sections/map-section";
import IslamicMessage from "@/components/sections/islamic-message";
import RSVPSection from "@/components/sections/rsvp-section";
import Footer from "@/components/sections/footer";
import BottomNavigation from "@/components/sections/bottom-navigation";
import MusicPlayer from "@/components/audio/music-player";

interface InvitationContentProps {
  guestName?: string;
}

export default function InvitationContent({
  guestName,
}: InvitationContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const homeRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);
  const speakerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const rsvpRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const shareInvitation = () => {
    if (navigator.share) {
      navigator.share({
        title: "Undangan 1 Muharram & Reuni IKASAN ke-3",
        text: "Anda diundang untuk menghadiri acara peringatan 1 Muharram dan Reuni Akbar IKASAN ke-3",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link undangan telah disalin!");
    }
  };

  const scrollToSection = (
    sectionRef: React.RefObject<HTMLDivElement>,
    sectionName: string
  ) => {
    setActiveSection(sectionName);
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-islamic-gradient flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute -top-8 -right-8 text-islamic-accent opacity-30"
            >
              <Star size={64} />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute -bottom-8 -left-8 text-islamic-accent opacity-30"
            >
              <Star size={48} />
            </motion.div>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8 max-w-md mx-auto">
              <CardContent className="text-center space-y-6">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* buat ukuran gambar nya jadi lebih kecil */}
                  <div className="text-6xl mb-4">
                    <img
                      src="/image/logo3.png"
                      alt=""
                      className="w-20 mx-auto"
                    />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
                  </h1>
                  <p className="text-white/80 text-sm mb-4">
                    Bismillahirrahmanirrahim
                  </p>
                </motion.div>

                {guestName && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <Badge
                      variant="secondary"
                      className="bg-islamic-accent text-islamic-primary px-4 py-2 text-lg font-semibold"
                    >
                      Kepada Yth. {guestName}
                    </Badge>
                  </motion.div>
                )}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <h2 className="text-xl font-bold text-white">Undangan</h2>
                  <h3 className="text-lg text-islamic-accent font-semibold">
                    Peringatan 1 Muharram 1447 H
                  </h3>
                  <p className="text-white/90 font-medium">
                    & Reuni Akbar IKASAN ke-3
                  </p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                >
                  <Button
                    onClick={handleOpenInvitation}
                    className="bg-islamic-accent hover:bg-yellow-500 text-islamic-primary font-bold px-8 py-3 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105"
                  >
                    Buka Undangan
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-islamic-gradient relative overflow-hidden">
      {/* Music Player - Auto-play when invitation is opened */}
      <MusicPlayer autoPlay={true} />

      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  y: -100,
                  x: Math.random() * window.innerWidth,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 100,
                  rotate: 360,
                  transition: { duration: 3, delay: Math.random() * 2 },
                }}
                className="absolute w-3 h-3 bg-islamic-accent rounded-full"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-white text-8xl">☪</div>
        <div className="absolute top-20 right-20 text-white text-6xl">✦</div>
        <div className="absolute bottom-20 left-20 text-white text-7xl">❋</div>
        <div className="absolute bottom-10 right-10 text-white text-5xl">✧</div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header Section */}
          <div ref={homeRef}>
            <Header guestName={guestName} onShare={shareInvitation} />
          </div>

          {/* Event Details Section */}
          <div ref={eventRef}>
            <EventDetails />
          </div>

          {/* Speaker Section */}
          <div ref={speakerRef}>
            <SpeakerSection />
          </div>

          {/* Map Section */}
          <div ref={mapRef}>
            <MapSection />
          </div>

          {/* Islamic Message */}
          <IslamicMessage />

          {/* RSVP Section */}
          <div ref={rsvpRef}>
            <RSVPSection />
          </div>

          {/* Footer */}
          <div ref={contactRef}>
            <Footer />
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeSection={activeSection}
        onNavigate={scrollToSection}
        refs={{
          homeRef,
          eventRef,
          speakerRef,
          mapRef,
          rsvpRef,
          contactRef,
        }}
      />

      {/* Bottom padding to prevent content being hidden behind bottom nav */}
      <div className="h-20"></div>
    </div>
  );
}
