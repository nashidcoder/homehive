import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import Inquiry from "@/models/Inquiry";
import User from "@/models/User";
import DeletePropertyButton from "@/components/DeletePropertyButton";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "owner") {
    redirect("/become-owner");
  }

  await connectDB();

  const [owner, properties, inquiries] = await Promise.all([
    User.findById(currentUser.id).select("name"),
    Property.find({ owner: currentUser.id }).sort({ createdAt: -1 }),
    Inquiry.find({ owner: currentUser.id })
      .populate("property", "title")
      .populate("sender", "name email phone")
      .sort({ createdAt: -1 }),
  ]);

  const firstName = owner?.name?.split(" ")[0] || "there";
  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
  const availableCount = properties.filter((p) => p.status === "available").length;

  const stats = [
    { icon: "🏘️", label: "Total Listings", value: properties.length },
    { icon: "✅", label: "Available", value: availableCount },
    { icon: "👁️", label: "Total Views", value: totalViews },
    { icon: "✉️", label: "Inquiries", value: inquiries.length },
  ];

  return (
    <div>
      <section className="bg-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <p className="text-blue-400 font-semibold text-sm mb-2">DASHBOARD</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Welcome back, {firstName}
            </h1>
            <p className="text-slate-400 mt-2">
              Manage your listings and see who is interested.
            </p>
          </div>
          <Link
            href="/dashboard/add-property"
            className="inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            + Add Property
          </Link>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
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

        <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent Inquiries</h2>
        {inquiries.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl text-center py-10 px-4 mb-12">
            <p className="text-4xl mb-2">✉️</p>
            <p className="text-slate-500">
              No messages yet. When a buyer contacts you, it will show up here.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 mb-12">
            {inquiries.slice(0, 5).map((inq) => (
              <div key={inq._id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                      {inq.sender?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {inq.sender?.name || "Unknown user"}
                      </p>
                      <p className="text-xs text-slate-500">
                        about{" "}
                        <span className="font-medium text-slate-700">
                          {inq.property?.title || "a deleted property"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    {new Date(inq.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <p className="text-slate-600 mt-3 whitespace-pre-line">{inq.message}</p>

                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  {inq.sender?.email && (
                    <a
                      href={`mailto:${inq.sender.email}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      ✉️ {inq.sender.email}
                    </a>
                  )}
                  {inq.sender?.phone && (
                    <a
                      href={`tel:${inq.sender.phone}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      📞 {inq.sender.phone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-2xl font-bold text-slate-900 mb-4">My Properties</h2>
        {properties.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl text-center py-16 px-4">
            <p className="text-5xl mb-3">🏡</p>
            <h3 className="text-xl font-semibold text-slate-900 mb-1">
              You haven't listed any property yet
            </h3>
            <p className="text-slate-500 mb-6">List your first property in a minute.</p>
            <Link
              href="/dashboard/add-property"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              + Add Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {properties.map((property) => {
              const isResidential =
                property.propertyType === "house" || property.propertyType === "apartment";
              return (
                <div
                  key={property._id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
                >
                  <Link href={`/properties/${property._id}`} className="block relative">
                    {property.images[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-grad from-slate-200 to-slate-300 flex items-center justify-center text-5xl">
                        🏠
                      </div>
                    )}
                    <span
                      className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                        property.status === "available"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {property.status}
                    </span>
                  </Link>

                  <div className="p-5">
                    <h3 className="font-semibold text-lg truncate text-slate-900">
                      {property.title}
                    </h3>
                    <p className="text-blue-600 font-bold text-xl mt-1">
                      PKR {property.price.toLocaleString()}
                      {property.purpose === "rent" && (
                        <span className="text-sm font-normal text-slate-500"> /month</span>
                      )}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">
                      📍 {property.location.city}
                      {isResidential && ` · 🛏 ${property.bedrooms}`} · 📐{" "}
                      {property.area} sqft
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      👁 {property.views} views
                    </p>

                    <div className="flex items-center gap-5 mt-4 pt-4 border-t border-slate-200">
                      <Link
                        href={`/dashboard/edit-property/${property._id}`}
                        className="text-blue-600 text-sm font-semibold hover:underline"
                      >
                        Edit
                      </Link>
                      <DeletePropertyButton propertyId={property._id.toString()} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}