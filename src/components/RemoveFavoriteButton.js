"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RemoveFavoriteButton({ propertyId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId }),
    });
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title="Remove from favorites"
      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center text-lg shadow hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      ❤️
    </button>
  );
}