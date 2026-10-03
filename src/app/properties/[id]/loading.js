export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-4 w-32 bg-slate-200 rounded mb-5" />
      <div className="grid lg:grid-cols-2 gap-3 mb-8">
        <div className="h-72 lg:h-26rem bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-36 lg:h-[12.6rem] bg-slate-200 rounded-2xl" />
          <div className="h-36 lg:h-[12.6rem] bg-slate-200 rounded-2xl" />
          <div className="h-36 lg:h-[12.6rem] bg-slate-200 rounded-2xl" />
          <div className="h-36 lg:h-[12.6rem] bg-slate-200 rounded-2xl" />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="h-8 w-2/3 bg-slate-200 rounded" />
          <div className="h-10 w-1/3 bg-slate-200 rounded" />
          <div className="h-40 bg-slate-100 rounded-2xl" />
        </div>
        <div className="lg:w-80">
          <div className="h-64 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}