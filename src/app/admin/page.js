import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import User from "@/models/User";
import Inquiry from "@/models/Inquiry";
import Report from "@/models/Report";

export default async function AdminOverviewPage() {
  await connectDB();

  const [
    totalProperties,
    totalUsers,
    totalOwners,
    totalInquiries,
    pendingReports,
  ] = await Promise.all([
    Property.countDocuments(),
    User.countDocuments(),
    User.countDocuments({ role: "owner" }),
    Inquiry.countDocuments(),
    Report.countDocuments({ status: "pending" }),
  ]);

  const stats = [
    { icon: "🏠", label: "Total Properties", value: totalProperties },
    { icon: "👥", label: "Total Users", value: totalUsers },
    { icon: "🏡", label: "Owners", value: totalOwners },
    { icon: "✉️", label: "Total Inquiries", value: totalInquiries },
    { icon: "🚩", label: "Pending Reports", value: pendingReports },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
        >
          <p className="text-2xl mb-2">{stat.icon}</p>
          <p className="text-3xl font-extrabold text-slate-900">
            {stat.value.toLocaleString()}
          </p>
          <p className="text-sm text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}