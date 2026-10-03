import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import AdminDeleteButton from "@/components/AdminDeleteButton";

export default async function AdminPropertiesPage() {
  await connectDB();

  const properties = await Property.find()
    .populate("owner", "name email")
    .sort({ createdAt: -1 });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-3 font-medium text-slate-900 max-w-200px truncate">
                  {p.title}
                </td>
                <td className="px-4 py-3 text-slate-500">{p.owner?.name || "—"}</td>
                <td className="px-4 py-3 text-slate-500">{p.location.city}</td>
                <td className="px-4 py-3 text-slate-700">
                  PKR {p.price.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                      p.status === "available"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <AdminDeleteButton
                    endpoint={`/api/admin/properties/${p._id}`}
                    confirmText="Delete this property?"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {properties.length === 0 && (
        <p className="text-center text-slate-500 py-10">No properties yet.</p>
      )}
    </div>
  );
}