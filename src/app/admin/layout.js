import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/admin";

const navItems = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/properties", label: "Properties", icon: "🏠" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/reports", label: "Reports", icon: "🚩" },
];

export default async function AdminLayout({ children }) {
  const admin = await getAdminUser();

  if (!admin) {
    redirect("/");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-blue-600 font-semibold text-sm">ADMIN PANEL</p>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Welcome, {admin.name.split(" ")[0]}
          </h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <nav className="sm:w-48 shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex sm:flex-col gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded-xl px-3 py-2 whitespace-nowrap transition-colors"
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}