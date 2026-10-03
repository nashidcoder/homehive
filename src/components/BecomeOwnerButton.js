"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BecomeOwnerButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/become-owner", { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div>
      {error && (
        <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
          {error}
        </p>
      )}
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
      >
        {loading ? "Switching..." : "Switch to Owner Account"}
      </button>
    </div>
  );
}