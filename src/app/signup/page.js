"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const inputStyle =
  "w-full bg-slate-100 text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none rounded-xl px-4 py-3 transition-colors";

const roles = [
  { value: "buyer", icon: "🔍", label: "Buy / Rent", hint: "I am looking for a property" },
  { value: "owner", icon: "🏡", label: "List Property", hint: "I want to sell or rent" },
];

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "buyer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <div
        className="hidden lg:flex items-end bg-cover bg-center"
        style={{
          backgroundColor: "#0f172a",
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.85)), url('/hero.jpg')",
        }}
      >
        <div className="p-12">
          <p className="text-3xl font-extrabold text-white leading-snug">
            List, search and connect, all in one place.
          </p>
          <p className="text-slate-300 mt-3">
            Create a free account and get started in a minute.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 w-full max-w-md"
        >
          <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1 mb-6">Join HomeHive for free</p>

          {error && (
            <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 mb-5">
            {roles.map((r) => (
              <button
                type="button"
                key={r.value}
                onClick={() => setFormData({ ...formData, role: r.value })}
                className={`border rounded-xl p-3 text-left transition-colors ${
                  formData.role === r.value
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <p className="text-2xl">{r.icon}</p>
                <p className="font-semibold text-sm text-slate-900 mt-1">{r.label}</p>
                <p className="text-xs text-slate-500">{r.hint}</p>
              </button>
            ))}
          </div>

          <label className="block mb-4">
            <span className="block text-sm font-medium text-slate-700 mb-1">Full Name</span>
            <input
              type="text"
              name="name"
              placeholder="Ali Khan"
              value={formData.name}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </label>

          <label className="block mb-4">
            <span className="block text-sm font-medium text-slate-700 mb-1">Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </label>

          <label className="block mb-4">
            <span className="block text-sm font-medium text-slate-700 mb-1">
              Phone (optional)
            </span>
            <input
              type="tel"
              name="phone"
              placeholder="03XX XXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              className={inputStyle}
            />
          </label>

          <label className="block mb-6">
            <span className="block text-sm font-medium text-slate-700 mb-1">Password</span>
            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              className={inputStyle}
              minLength={6}
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-sm text-center mt-5 text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}