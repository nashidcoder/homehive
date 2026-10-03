import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import AdminReportActions from "@/components/AdminReportActions";

const reasonLabels = {
  fake: "Fake listing",
  sold_already: "Already sold/rented",
  wrong_info: "Wrong information",
  spam: "Spam or scam",
  other: "Other",
};

export default async function AdminReportsPage() {
  await connectDB();

  const reports = await Report.find()
    .populate("property", "title")
    .populate("reporter", "name email")
    .sort({ createdAt: -1 });

  return (
    <div className="space-y-4">
      {reports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl text-center py-16">
          <p className="text-4xl mb-2">✅</p>
          <p className="text-slate-500">No reports so far.</p>
        </div>
      ) : (
        reports.map((r) => (
          <div
            key={r._id}
            className="bg-white border border-slate-200 rounded-2xl p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  r.status === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {r.status === "pending" ? "Pending" : "Reviewed"}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(r.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="font-semibold text-slate-900">
              {reasonLabels[r.reason] || r.reason}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Property: {r.property?.title || "Deleted property"} · Reported by{" "}
              {r.reporter?.name || "Unknown"}
            </p>
            {r.message && (
              <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-lg p-3">
                {r.message}
              </p>
            )}
            <div className="mt-3">
              <AdminReportActions reportId={r._id.toString()} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}