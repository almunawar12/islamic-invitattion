"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import RSVPForm from "@/components/rsvp/rsvp-form";
import RSVPList from "@/components/rsvp/rsvp-list";
import RSVPStats from "@/components/rsvp/rsvp-stats";
import RSVPButtons from "@/components/rsvp/rsvp-buttons";
import RSVPUserCard from "@/components/rsvp/rsvp-user-card";
import type { RSVPEntry } from "@/types/rsvp";
import { hybridSave, hybridLoad, getUserIdentifier } from "@/utils/storage";

export default function RSVPSection() {
  const [rsvpStatus, setRsvpStatus] = useState<
    "pending" | "attending" | "not-attending"
  >("pending");
  const [showRSVPForm, setShowRSVPForm] = useState(false);
  const [rsvpEntries, setRsvpEntries] = useState<RSVPEntry[]>([]);
  const [currentUserRSVP, setCurrentUserRSVP] = useState<RSVPEntry | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const handleRSVP = (status: "attending" | "not-attending") => {
    setRsvpStatus(status);
    setShowRSVPForm(true);
  };

  const handleFormSubmit = async (formData: {
    name: string;
    address: string;
    angkatan: string;
  }) => {
    const userIdentifier = getUserIdentifier();
    if (rsvpStatus === "pending") {
      throw new Error('Cannot submit RSVP with status "pending".');
    }
    const newEntry: RSVPEntry = {
      id: userIdentifier,
      ...formData,
      status: rsvpStatus,
      timestamp: new Date(),
    };

    // Update local state immediately
    const updatedEntries = [
      newEntry,
      ...rsvpEntries.filter((entry) => entry.id !== userIdentifier),
    ];
    setRsvpEntries(updatedEntries);
    setCurrentUserRSVP(newEntry);
    setShowRSVPForm(false);

    // Save to hybrid storage (localStorage + server)
    try {
      await hybridSave(updatedEntries, newEntry);
      setLastSync(new Date());
    } catch (error) {
      console.error("Error saving RSVP:", error);
    }
  };

  const resetRSVP = async () => {
    if (currentUserRSVP) {
      const updatedEntries = rsvpEntries.filter(
        (entry) => entry.id !== currentUserRSVP.id
      );
      setRsvpEntries(updatedEntries);

      // Save to hybrid storage
      try {
        await hybridSave(updatedEntries, null);
        setLastSync(new Date());
      } catch (error) {
        console.error("Error resetting RSVP:", error);
      }
    }
    setRsvpStatus("pending");
    setCurrentUserRSVP(null);
    setShowRSVPForm(false);
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const { entries, currentUser } = await hybridLoad();
      setRsvpEntries(entries);

      // Check if current user has RSVP'd
      const userIdentifier = getUserIdentifier();
      const userRSVP =
        entries.find((entry) => entry.id === userIdentifier) || currentUser;

      if (userRSVP) {
        setCurrentUserRSVP(userRSVP);
        setRsvpStatus(userRSVP.status);
      }

      setLastSync(new Date());
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const { entries, currentUser } = await hybridLoad();
        setRsvpEntries(entries);

        // Check if current user has RSVP'd using identifier
        const userIdentifier = getUserIdentifier();
        const userRSVP =
          entries.find((entry) => entry.id === userIdentifier) || currentUser;

        if (userRSVP) {
          setCurrentUserRSVP(userRSVP);
          setRsvpStatus(userRSVP.status);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      refreshData(); // Sync when coming back online
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const attendingCount = rsvpEntries.filter(
    (entry) => entry.status === "attending"
  ).length;
  const notAttendingCount = rsvpEntries.filter(
    (entry) => entry.status === "not-attending"
  ).length;

  if (isLoading) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center mb-8"
      >
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-2 text-white">
              <RefreshCw className="animate-spin" size={20} />
              <span>Memuat data RSVP...</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="text-center mb-8"
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-6">
          {/* Header with sync status */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-islamic-accent flex items-center gap-2">
              <MessageCircle className="text-islamic-accent" />
              Konfirmasi Kehadiran
            </h3>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi size={16} className="text-green-400" />
              ) : (
                <WifiOff size={16} className="text-red-400" />
              )}
              <Button
                onClick={refreshData}
                variant="outline"
                size="sm"
                className="bg-transparent border-white/20 text-white/70 hover:bg-white/10 text-xs"
              >
                <RefreshCw size={12} className="mr-1" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Sync status */}
          {lastSync && (
            <div className="text-xs text-white/50 mb-4">
              Terakhir disinkronkan: {lastSync.toLocaleTimeString("id-ID")}
            </div>
          )}

          {/* Statistics */}
          <RSVPStats
            attendingCount={attendingCount}
            notAttendingCount={notAttendingCount}
          />

          {currentUserRSVP ? (
            // Display Current User's RSVP
            <RSVPUserCard
              currentUserRSVP={currentUserRSVP}
              onReset={resetRSVP}
            />
          ) : showRSVPForm &&
            (rsvpStatus === "attending" || rsvpStatus === "not-attending") ? (
            // RSVP Form
            <RSVPForm
              rsvpStatus={rsvpStatus}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowRSVPForm(false)}
            />
          ) : (
            // Initial RSVP Buttons
            <RSVPButtons onRSVP={handleRSVP} />
          )}

          {/* RSVP List */}
          <RSVPList
            rsvpEntries={rsvpEntries}
            currentUserRSVP={currentUserRSVP}
          />

          {/* Offline notice */}
          {!isOnline && (
            <div className="mt-4 p-3 bg-orange-600/20 border border-orange-600/30 rounded-lg">
              <p className="text-orange-300 text-sm">
                📱 Anda sedang offline. Data akan disinkronkan ketika koneksi
                kembali.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
