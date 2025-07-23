"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.address && formData.angkatan) {
      onSubmit(formData);
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
    </form>
  );
}
