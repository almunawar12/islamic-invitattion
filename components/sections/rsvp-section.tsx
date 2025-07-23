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
  CheckCircle,
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
  const [syncStatus, setSyncStatus] = useState<
    "synced" | "syncing" | "error" | "offline"
  >("synced");
  const [retryCount, setRetryCount] = useState(0);

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
    setRetryCount(0);

    const userIdentifier = getUserIdentifier();
    const newEntry: RSVPEntry = {
      id: userIdentifier,
      ...formData,
      status: rsvpStatus === "attending" ? "attending" : "not-attending",
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

    // Save to server with retry logic
    let success = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (!success && attempts < maxAttempts) {
      attempts++;
      console.log(`Save attempt ${attempts}/${maxAttempts}`);

      try {
        success = await hybridSave(updatedEntries, newEntry);

        if (success) {
          setSyncStatus("synced");
          setLastSync(new Date());
          console.log("RSVP saved successfully");

          // Refresh data to ensure consistency
          setTimeout(() => refreshData(), 1000);
          break;
        } else {
          console.warn(`Save attempt ${attempts} failed`);
          if (attempts < maxAttempts) {
            // Wait before retry
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * attempts)
            );
          }
        }
      } catch (error) {
        console.error(`Save attempt ${attempts} error:`, error);
        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
        }
      }
    }

    if (!success) {
      setSyncStatus("error");
      setRetryCount(attempts);
      console.error("All save attempts failed");
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
    console.log("Refreshing RSVP data...");
    setSyncStatus("syncing");

    try {
      const { entries, currentUser } = await hybridLoad();

      setRsvpEntries(entries);

      if (currentUser) {
        setCurrentUserRSVP(currentUser);
        setRsvpStatus(currentUser.status);
      } else {
        setCurrentUserRSVP(null);
        setRsvpStatus("pending");
      }

      setSyncStatus("synced");
      setLastSync(new Date());
      setRetryCount(0);
      console.log("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error);
      setSyncStatus("error");
    }
  };

  const retrySync = async () => {
    console.log("Retrying sync...");
    await refreshData();
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

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline && syncStatus !== "syncing") {
        refreshData();
      }
    }, 30000);

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
        return <CheckCircle className="text-green-400" size={16} />;
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
        return `Gagal sinkronisasi (${retryCount} percobaan)`;
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

          {/* RSVP List */}
          <RSVPList
            rsvpEntries={rsvpEntries}
            currentUserRSVP={currentUserRSVP}
          />

          {/* Status messages */}
          {syncStatus === "error" && (
            <div className="mt-4 p-3 bg-red-600/20 border border-red-600/30 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-red-300 text-sm">
                  ⚠️ Gagal menyinkronkan data setelah {retryCount} percobaan.
                  Data tersimpan lokal.
                </p>
                <Button
                  onClick={retrySync}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs"
                >
                  Coba Lagi
                </Button>
              </div>
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

          {syncStatus === "synced" && rsvpEntries.length > 0 && (
            <div className="mt-4 p-3 bg-green-600/20 border border-green-600/30 rounded-lg">
              <p className="text-green-300 text-sm">
                ✅ Data tersinkronisasi dengan server. Semua tamu dapat melihat
                daftar yang sama.
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
