import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import PropertyForm from "@/components/PropertyForm";

export default async function AddPropertyPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "owner") {
    redirect("/");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/dashboard"
        className="inline-block text-sm text-slate-500 hover:text-blue-600 mb-4"
      >
        ← Back to dashboard
      </Link>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6">
        List a New Property
      </h1>
      <PropertyForm mode="add" />
    </div>
  );
}