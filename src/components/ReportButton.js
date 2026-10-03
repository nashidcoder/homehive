"use client";

import { useState } from "react";

const reasons = [
  { value: "fake", label: "This listing looks fake" },
  { value: "sold_already", label: "Already sold / rented" },
  { value: "wrong_info", label: "Wrong information" },
  { value: "spam", label: "Spam or scam" },
  { value: "other", label: "Other" },
];

export default function ReportButton({ propertyId }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("fake");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, reason, message }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setStatus(data.message);
      setMessage("");
    } else {
      setStatus(data.error);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-slate-400 hover:text-red-600 mt-3 underline"
      >
        🚩 Report this listing
      </button>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3">
      {status ? (
        <p className="text-sm text-green-600">{status}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
          >
            {reasons.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Extra details (optional)"
            rows={2}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-60"
            >
              {loading ? "Sending..." : "Submit Report"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-slate-500 px-3"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}