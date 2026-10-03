"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminReportActions({ reportId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const markReviewed = async () => {
    setLoading(true);
    await fetch(`/api/admin/reports/${reportId}`, { method: "PATCH" });
    setLoading(false);
    router.refresh();
  };

  const remove = async () => {
    if (!window.confirm("Delete this report?")) return;
    setLoading(true);
    await fetch(`/api/admin/reports/${reportId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={markReviewed}
        disabled={loading}
        className="text-blue-600 text-xs font-semibold hover:underline disabled:opacity-50"
      >
        Mark Reviewed
      </button>
      <button
        onClick={remove}
        disabled={loading}
        className="text-red-600 text-xs font-semibold hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}