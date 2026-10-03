import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl mb-4">🏚️</p>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Page not found
        </h1>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          The page or property you are looking for does not exist or may have been
          removed.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}