"use client";

import { useState } from "react";

export default function ContactOwnerForm({ propertyId }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, message }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setIsError(true);
      setStatus(data.error);
      return;
    }

    setIsError(false);
    setStatus("Message sent successfully!");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="I'm interested in this property..."
        className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl p-3"
        rows={3}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl mt-2 transition-colors disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
      {status && (
        <p
          className={`text-sm mt-2 text-center ${
            isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {status}
        </p>
      )}
    </form>
  );
}