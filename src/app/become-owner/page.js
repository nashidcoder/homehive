import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import BecomeOwnerButton from "@/components/BecomeOwnerButton";

export default async function BecomeOwnerPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role === "owner") {
    redirect("/dashboard");
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-20">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8 text-center">
        <p className="text-5xl mb-4">🏡</p>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Want to list a property?
        </h1>
        <p className="text-slate-500 mt-2 mb-6">
          Your account is a Buyer account right now. Switch to an Owner account to
          add properties, receive inquiries and use the dashboard.
        </p>
        <BecomeOwnerButton />
        <p className="text-xs text-slate-400 mt-4">
          You can still browse and save favorites as an owner.
        </p>
      </div>
    </div>
  );
}