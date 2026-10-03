"use client";

import { useState } from "react";

export default function ImageUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setError("");
    setUploading(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    try {
      const uploaded = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", preset);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error?.message || "Upload failed");
        }

        uploaded.push(data.secure_url);
      }

      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err.message || "Something went wrong while uploading");
    }

    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl py-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-colors">
        <span className="text-3xl mb-2">📷</span>
        <span className="text-sm font-medium text-slate-600">
          {uploading ? "Uploading..." : "Click to upload photos"}
        </span>
        <span className="text-xs text-slate-400 mt-1">
          First photo will be the cover image
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {error && (
        <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mt-3">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
          {images.map((url, i) => (
            <div key={url + i} className="relative group">
              <img
                src={url}
                alt={`Property ${i + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-slate-200"
              />
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-sm leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}