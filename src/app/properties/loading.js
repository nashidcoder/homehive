export default function Loading() {
  return (
    <div>
      <section className="bg-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-4 w-20 bg-slate-700 rounded animate-pulse mb-3" />
          <div className="h-9 w-80 bg-slate-700 rounded animate-pulse" />
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
            >
              <div className="w-full h-52 bg-slate-200 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-6 w-1/2 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}