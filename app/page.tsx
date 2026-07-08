"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Screenshot = {
  id: string;
  file_url: string;
  file_name: string;
  created_at: string;
};

export default function Home() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadScreenshots() {
    const { data } = await supabase
      .from("screenshots")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      setScreenshots(data);
    }
  }

  useEffect(() => {
    loadScreenshots();
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      await fetch("/api/upload", { method: "POST", body: formData });
    }
    await loadScreenshots();
    setUploading(false);
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Stash</h1>
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="mb-8 rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload screenshots"}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {screenshots.map((s) => (
          <img
            key={s.id}
            src={s.file_url}
            alt={s.file_name}
            className="w-full rounded-lg object-cover"
          />
        ))}
      </div>
    </main>
  );
}