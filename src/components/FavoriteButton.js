"use client";

import { useState } from "react";

export default function FavoriteButton({ propertyId, initialSaved = false }) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async () => {
    setLoading(true);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId }),
    });

    if (res.ok) {
      const data = await res.json();
      setSaved(data.saved);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`text-2xl transition ${saved ? "scale-110" : ""}`}
      title={saved ? "Remove from favorites" : "Save to favorites"}
    >
      {saved ? "❤️" : "🤍"}
    </button>
  );
}