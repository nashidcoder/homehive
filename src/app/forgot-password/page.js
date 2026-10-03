"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);
    setStatus(data.message || data.error);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-extrabold text-slate-900">Forgot Password</h1>
        <p className="text-slate-500 text-sm mt-1 mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        {status ? (
          <p className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg p-3">
            {status}
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 mb-4"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}

        <p className="text-sm text-center mt-5 text-slate-500">
          <Link href="/login" className="text-blue-600 font-semibold">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}