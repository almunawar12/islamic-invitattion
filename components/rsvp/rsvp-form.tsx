"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { checkUserExists } from "@/utils/storage";

interface RSVPFormProps {
  rsvpStatus: "attending" | "not-attending";
  onSubmit: (formData: {
    name: string;
    address: string;
    angkatan: string;
  }) => void;
  onCancel: () => void;
}

export default function RSVPForm({
  rsvpStatus,
  onSubmit,
  onCancel,
}: RSVPFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    angkatan: "",
  });
  const [isChecking, setIsChecking] = useState(false);
  const [existingUser, setExistingUser] = useState<any>(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Reset warnings when user changes input
    if (field === "name" || field === "angkatan") {
      setExistingUser(null);
      setShowWarning(false);
    }
  };

  const checkExistingUser = async () => {
    if (formData.name.trim() && formData.angkatan.trim()) {
      setIsChecking(true);
      try {
        const existing = await checkUserExists(
          formData.name.trim(),
          formData.angkatan.trim()
        );
        if (existing) {
          setExistingUser(existing);
          setShowWarning(true);
        } else {
          setExistingUser(null);
          setShowWarning(false);
        }
      } catch (error) {
        console.error("Error checking existing user:", error);
      } finally {
        setIsChecking(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.address && formData.angkatan) {
      onSubmit(formData);
    }
  };

  const handleProceedWithExisting = () => {
    if (existingUser) {
      // Update existing user's status
      onSubmit({
        name: existingUser.name,
        address: existingUser.address,
        angkatan: existingUser.angkatan,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mb-6">
      <div className="text-left">
        <Label htmlFor="name" className="text-white mb-2 block">
          Nama Lengkap *
        </Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          onBlur={checkExistingUser}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          placeholder="Masukkan nama lengkap"
          required
        />
      </div>

      <div className="text-left">
        <Label htmlFor="angkatan" className="text-white mb-2 block">
          Angkatan *
        </Label>
        <Input
          id="angkatan"
          type="text"
          value={formData.angkatan}
          onChange={(e) => handleInputChange("angkatan", e.target.value)}
          onBlur={checkExistingUser}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          placeholder="Contoh: 2010, 2015, dll"
          required
        />
      </div>

      <div className="text-left">
        <Label htmlFor="address" className="text-white mb-2 block">
          Alamat Lengkap *
        </Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px]"
          placeholder="Masukkan alamat lengkap"
          required
        />
      </div>

      {/* Checking indicator */}
      {isChecking && (
        <div className="text-center text-white/70 text-sm">
          <div className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"></div>
          Memeriksa data...
        </div>
      )}

      {/* Existing user warning */}
      {showWarning && existingUser && (
        <div className="bg-orange-600/20 border border-orange-600/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-orange-400 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="text-orange-300 font-semibold mb-2">
                Data Sudah Ada
              </h4>
              <p className="text-orange-200 text-sm mb-3">
                Nama "{existingUser.name}" angkatan {existingUser.angkatan}{" "}
                sudah terdaftar dengan status:{" "}
                <strong
                  className={
                    existingUser.status === "attending"
                      ? "text-green-300"
                      : "text-red-300"
                  }
                >
                  {existingUser.status === "attending"
                    ? "Akan Hadir"
                    : "Tidak Hadir"}
                </strong>
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleProceedWithExisting}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2"
                >
                  Update Status
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowWarning(false)}
                  variant="outline"
                  className="border-orange-600/30 text-orange-300 hover:bg-orange-600/10 text-sm px-4 py-2"
                >
                  Batal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit buttons - only show if no warning or user chooses to proceed */}
      {!showWarning && (
        <div className="flex gap-4 justify-center pt-4">
          <Button
            type="submit"
            className={`px-6 py-2 rounded-full flex items-center gap-2 ${
              rsvpStatus === "attending"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            <CheckCircle size={16} />
            Konfirmasi {rsvpStatus === "attending" ? "Hadir" : "Tidak Hadir"}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 px-6 py-2 rounded-full bg-transparent"
          >
            Batal
          </Button>
        </div>
      )}
    </form>
  );
}
