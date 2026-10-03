"use client";

import { useState, useEffect } from "react";

function Stars({ value }) {
  return (
    <span className="text-amber-400">
      {"★".repeat(Math.round(value))}
      <span className="text-slate-300">{"★".repeat(5 - Math.round(value))}</span>
    </span>
  );
}

export default function ReviewsSection({ ownerId, canReview }) {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadReviews = async () => {
    const res = await fetch(`/api/reviews?ownerId=${ownerId}`);
    const data = await res.json();
    if (res.ok) {
      setReviews(data.reviews);
      setAverage(data.average);
      setCount(data.count);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, [ownerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerId, rating, comment }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setComment("");
    setRating(5);
    loadReviews();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-slate-900">Owner Reviews</h2>
        {count > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Stars value={average} />
            <span className="text-slate-500">
              {average.toFixed(1)} ({count})
            </span>
          </div>
        )}
      </div>

      {canReview && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5"
        >
          {error && (
            <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-3">
              {error}
            </p>
          )}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-slate-600">Your rating:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className={`text-xl ${n <= rating ? "text-amber-400" : "text-slate-300"}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was your experience with this owner?"
            className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-lg p-3 text-sm"
            rows={2}
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {submitting ? "Posting..." : "Post Review"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-slate-400 text-sm">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-slate-500 text-sm">No reviews yet for this owner.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r._id} className="border-b border-slate-100 pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm text-slate-900">
                  {r.reviewer?.name || "User"}
                </p>
                <Stars value={r.rating} />
              </div>
              <p className="text-slate-600 text-sm mt-1">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}