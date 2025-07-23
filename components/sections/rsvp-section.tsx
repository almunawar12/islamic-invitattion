"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
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
    "attending" | "not-attending" | "pending"
  >("pending");
  const [showRSVPForm, setShowRSVPForm] = useState(false);
  const [rsvpEntries, setRsvpEntries] = useState<RSVPEntry[]>([]);
  const [currentUserRSVP, setCurrentUserRSVP] = useState<RSVPEntry | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<
    "synced" | "syncing" | "error" | "offline"
  >("synced");

  const handleRSVP = (status: "attending" | "not-attending") => {
    setRsvpStatus(status);
    setShowRSVPForm(true);
  };

  const handleFormSubmit = async (formData: {
    name: string;
    address: string;
    angkatan: string;
  }) => {
    setSyncStatus("syncing");

    const userIdentifier = getUserIdentifier();
    if (rsvpStatus === "pending") {
      throw new Error("Cannot submit RSVP with status 'pending'");
    }
    const newEntry: RSVPEntry = {
      id: userIdentifier,
      ...formData,
      status: rsvpStatus as "attending" | "not-attending",
      timestamp: new Date(),
    };

    // Remove any existing entry with same name+angkatan to prevent duplicates
    const updatedEntries = [
      newEntry,
      ...rsvpEntries.filter(
        (entry) =>
          !(
            entry.name.toLowerCase().trim() ===
              formData.name.toLowerCase().trim() &&
            entry.angkatan === formData.angkatan
          )
      ),
    ];

    // Update local state immediately for instant feedback
    setRsvpEntries(updatedEntries);
    setCurrentUserRSVP(newEntry);
    setShowRSVPForm(false);

    // Save to server (this will be shared across all browsers)
    try {
      const success = await hybridSave(updatedEntries, newEntry);
      if (success) {
        setSyncStatus("synced");
        setLastSync(new Date());

        // Refresh data to ensure we have the latest from server
        await refreshData();
      } else {
        setSyncStatus("error");
      }
    } catch (error) {
      console.error("Error saving RSVP:", error);
      setSyncStatus("error");
    }
  };

  const resetRSVP = async () => {
    setSyncStatus("syncing");

    if (currentUserRSVP) {
      const updatedEntries = rsvpEntries.filter(
        (entry) => entry.id !== currentUserRSVP.id
      );
      setRsvpEntries(updatedEntries);

      try {
        const success = await hybridSave(updatedEntries, null);
        if (success) {
          setSyncStatus("synced");
          setLastSync(new Date());

          // Refresh data to ensure we have the latest from server
          await refreshData();
        } else {
          setSyncStatus("error");
        }
      } catch (error) {
        console.error("Error resetting RSVP:", error);
        setSyncStatus("error");
      }
    }

    setRsvpStatus("pending");
    setCurrentUserRSVP(null);
    setShowRSVPForm(false);
  };

  const refreshData = async () => {
    setSyncStatus("syncing");

    try {
      const { entries } = await hybridLoad();

      // Always load ALL entries from server (shared data)
      setRsvpEntries(entries);

      // Check if current user has RSVP'd by checking their user ID
      const userIdentifier = getUserIdentifier();
      const userRSVP = entries.find((entry) => entry.id === userIdentifier);

      if (userRSVP) {
        setCurrentUserRSVP(userRSVP);
        setRsvpStatus(userRSVP.status);
      } else {
        // Check if user has RSVP'd with different ID (by name from localStorage)
        const localCurrentUser = JSON.parse(
          localStorage.getItem("islamic-invitation-current-user") || "null"
        );
        if (localCurrentUser) {
          const existingRSVP = entries.find(
            (entry) =>
              entry.name.toLowerCase().trim() ===
                localCurrentUser.name.toLowerCase().trim() &&
              entry.angkatan === localCurrentUser.angkatan
          );

          if (existingRSVP) {
            // Update the existing RSVP with current user ID
            existingRSVP.id = userIdentifier;
            const updatedEntries = entries.map((entry) =>
              entry.name.toLowerCase().trim() ===
                localCurrentUser.name.toLowerCase().trim() &&
              entry.angkatan === localCurrentUser.angkatan
                ? existingRSVP
                : entry
            );

            setRsvpEntries(updatedEntries);
            setCurrentUserRSVP(existingRSVP);
            setRsvpStatus(existingRSVP.status);

            // Save updated entries back to server
            await hybridSave(updatedEntries, existingRSVP);
          }
        }
      }

      setSyncStatus("synced");
      setLastSync(new Date());
    } catch (error) {
      console.error("Error refreshing data:", error);
      setSyncStatus("error");
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await refreshData();
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Auto-refresh every 30 seconds to get latest data
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline && syncStatus !== "syncing") {
        refreshData();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isOnline, syncStatus]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus("synced");
      refreshData();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus("offline");
    };

    setIsOnline(navigator.onLine);
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

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case "syncing":
        return <RefreshCw className="animate-spin text-blue-400" size={16} />;
      case "synced":
        return <Wifi className="text-green-400" size={16} />;
      case "error":
        return <AlertCircle className="text-red-400" size={16} />;
      case "offline":
        return <WifiOff className="text-orange-400" size={16} />;
      default:
        return <Wifi className="text-gray-400" size={16} />;
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case "syncing":
        return "Menyinkronkan...";
      case "synced":
        return "Tersinkronisasi";
      case "error":
        return "Gagal sinkronisasi";
      case "offline":
        return "Offline";
      default:
        return "Tidak diketahui";
    }
  };

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
              {getSyncStatusIcon()}
              <Button
                onClick={refreshData}
                variant="outline"
                size="sm"
                className="bg-transparent border-white/20 text-white/70 hover:bg-white/10 text-xs"
                disabled={syncStatus === "syncing"}
              >
                <RefreshCw size={12} className="mr-1" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Sync status */}
          <div className="text-xs text-white/50 mb-4 flex items-center justify-center gap-2">
            <span>{getSyncStatusText()}</span>
            {lastSync && (
              <span>• Terakhir: {lastSync.toLocaleTimeString("id-ID")}</span>
            )}
            <span>• Auto-refresh setiap 30 detik</span>
          </div>

          {/* Statistics */}
          <RSVPStats
            attendingCount={attendingCount}
            notAttendingCount={notAttendingCount}
          />

          {currentUserRSVP ? (
            <RSVPUserCard
              currentUserRSVP={currentUserRSVP}
              onReset={resetRSVP}
            />
          ) : showRSVPForm &&
            (rsvpStatus === "attending" || rsvpStatus === "not-attending") ? (
            <RSVPForm
              rsvpStatus={rsvpStatus}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowRSVPForm(false)}
            />
          ) : (
            <RSVPButtons onRSVP={handleRSVP} />
          )}

          {/* RSVP List - Always show all entries */}
          <RSVPList
            rsvpEntries={rsvpEntries}
            currentUserRSVP={currentUserRSVP}
          />

          {/* Status messages */}
          {syncStatus === "error" && (
            <div className="mt-4 p-3 bg-red-600/20 border border-red-600/30 rounded-lg">
              <p className="text-red-300 text-sm">
                ⚠️ Gagal menyinkronkan data. Data tersimpan lokal, coba refresh
                untuk sinkronisasi ulang.
              </p>
            </div>
          )}

          {syncStatus === "offline" && (
            <div className="mt-4 p-3 bg-orange-600/20 border border-orange-600/30 rounded-lg">
              <p className="text-orange-300 text-sm">
                📱 Anda sedang offline. Data akan disinkronkan ketika koneksi
                kembali.
              </p>
            </div>
          )}

          {/* Info about shared data */}
          <div className="mt-4 p-3 bg-islamic-primary/20 border border-islamic-accent/30 rounded-lg">
            <p className="text-islamic-accent text-sm">
              📋 Daftar ini menampilkan semua konfirmasi kehadiran dari semua
              tamu undangan
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
