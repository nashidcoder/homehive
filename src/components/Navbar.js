import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import LogoutButton from "./LogoutButton";
import NavLink from "./NavLink";

export default async function Navbar() {
  const decoded = await getCurrentUser();
  let user = null;

  if (decoded) {
    await connectDB();
    user = await User.findById(decoded.id).select("name role isAdmin");
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold text-slate-900">
          🏠 Home<span className="text-blue-600">Hive</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <NavLink href="/properties">Browse</NavLink>

          {user ? (
            <>
              {user.role === "owner" ? (
                <NavLink href="/dashboard">Dashboard</NavLink>
              ) : (
                <NavLink href="/become-owner">List Property</NavLink>
              )}

              <NavLink href="/favorites">Favorites</NavLink>

              {user.isAdmin && <NavLink href="/admin">Admin</NavLink>}

              <span className="hidden md:inline text-sm text-slate-500">
                Hi, {user.name.split(" ")[0]}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <NavLink href="/login">Login</NavLink>
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}