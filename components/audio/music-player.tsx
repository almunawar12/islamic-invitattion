"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Music } from "lucide-react";
import { motion } from "framer-motion";

interface MusicPlayerProps {
  autoPlay?: boolean;
}

export default function MusicPlayer({ autoPlay = false }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Auto-play when component mounts and autoPlay is true
  useEffect(() => {
    if (autoPlay && audioRef.current && !isPlaying) {
      const playAudio = async () => {
        try {
          await audioRef.current?.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Auto-play failed:", error);
          setIsPlaying(false);
        }
      };

      // Small delay to ensure audio is loaded
      setTimeout(playAudio, 500);
    }
  }, [autoPlay]);

  // Update audio element when state changes
  useEffect(() => {
    if (audioRef.current && isLoaded) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.log("Audio play failed:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isLoaded]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAudioLoad = () => {
    setIsLoaded(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set default volume to 30%
    }
  };

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="/audio/song.mp3"
        preload="auto"
        loop
        onLoadedData={handleAudioLoad}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          console.error("Audio failed to load");
          setIsPlaying(false);
        }}
      />

      {/* Floating Music Player - Bottom Right */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-28 right-4 z-[60] md:bottom-8 md:right-6"
      >
        <Button
          onClick={togglePlay}
          className={`w-12 h-12 md:w-14 md:h-14 rounded-full p-0 shadow-lg transition-all duration-300 transform hover:scale-110 ${
            isPlaying
              ? "bg-islamic-accent text-islamic-primary hover:bg-yellow-400 animate-pulse"
              : "bg-islamic-primary text-white hover:bg-islamic-primary/80"
          }`}
        >
          <motion.div
            animate={isPlaying ? { rotate: [0, 360] } : {}}
            transition={{
              duration: 3,
              repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
              ease: "linear",
            }}
          >
            {isPlaying ? (
              <Pause size={20} className="md:w-6 md:h-6" />
            ) : (
              <Play size={20} className="md:w-6 md:h-6 ml-0.5" />
            )}
          </motion.div>
        </Button>

        {/* Music Wave Animation */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-2 -right-2 pointer-events-none"
          >
            <div className="flex items-end space-x-0.5">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [4, 12, 4],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                  className="w-1 bg-islamic-accent rounded-full"
                  style={{ height: 4 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isPlaying ? 1 : 0, y: isPlaying ? 0 : 10 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        >
          <div className="bg-islamic-primary/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            <Music size={10} className="inline mr-1" />
            Musik Islami
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
