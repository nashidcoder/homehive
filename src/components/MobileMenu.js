"use client";

import { useState } from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function MobileMenu({ user }) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const linkClass =
    "block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600";

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-2xl leading-none text-slate-700 px-1"
        aria-label="Menu"
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg">
          <Link href="/properties" className={linkClass} onClick={close}>
            Browse
          </Link>

          {user ? (
            <>
              {user.role === "owner" ? (
                <Link href="/dashboard" className={linkClass} onClick={close}>
                  Dashboard
                </Link>
              ) : (
                <Link href="/become-owner" className={linkClass} onClick={close}>
                  List Property
                </Link>
              )}

              <Link href="/favorites" className={linkClass} onClick={close}>
                Favorites
              </Link>

              {user.isAdmin && (
                <Link
                  href="/admin"
                  className={`${linkClass} text-blue-600`}
                  onClick={close}
                >
                  Admin
                </Link>
              )}

              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-500">Hi, {user.name}</span>
                <LogoutButton />
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className={linkClass} onClick={close}>
                Login
              </Link>
              <Link
                href="/signup"
                className={`${linkClass} text-blue-600 font-semibold`}
                onClick={close}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}