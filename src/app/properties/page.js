import Link from "next/link";
import { Suspense } from "react";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertyFilters from "@/components/PropertyFilters";

const sortOptions = {
  newest: { createdAt: -1 },
  "price-low": { price: 1 },
  "price-high": { price: -1 },
  popular: { views: -1 },
};

const PAGE_SIZE = 9;

function pageHref(params, page) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== "page") sp.set(key, value);
  });
  sp.set("page", String(page));
  return `/properties?${sp.toString()}`;
}

export default async function PropertiesPage({ searchParams }) {
  const params = await searchParams;

  await connectDB();

  let query = { status: "available" };

  if (params.city) {
    const safeCity = params.city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query["location.city"] = { $regex: safeCity, $options: "i" };
  }
  if (params.propertyType) {
    query.propertyType = params.propertyType;
  }
  if (params.purpose) {
    query.purpose = params.purpose;
  }
  if (params.bedrooms) {
    query.bedrooms = { $gte: Number(params.bedrooms) };
  }
  if (params.minPrice || params.maxPrice) {
    query.price = {};
    if (params.minPrice) query.price.$gte = Number(params.minPrice);
    if (params.maxPrice) query.price.$lte = Number(params.maxPrice);
  }

  const sort = sortOptions[params.sort] || sortOptions.newest;
  const currentPage = Math.max(1, Number(params.page) || 1);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [properties, totalCount, cities] = await Promise.all([
    Property.find(query).sort(sort).skip(skip).limit(PAGE_SIZE),
    Property.countDocuments(query),
    Property.distinct("location.city", { status: "available" }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div>
      <section className="bg-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-blue-400 font-semibold text-sm mb-2">BROWSE</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Find Your Next Property
          </h1>
          <p className="text-slate-400 mt-2">Search by city, price, type and more.</p>

          <div className="mt-8">
            <Suspense fallback={null}>
              <PropertyFilters cities={cities} />
            </Suspense>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-slate-500 mb-6">
          <span className="font-semibold text-slate-900">{totalCount}</span> properties
          found
        </p>

        {properties.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl text-center py-16 px-4">
            <p className="text-5xl mb-3">🔍</p>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              No properties match your search
            </h2>
            <p className="text-slate-500 mb-6">Try changing or removing some filters.</p>
            <Link
              href="/properties"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {properties.map((property) => {
                const isResidential =
                  property.propertyType === "house" ||
                  property.propertyType === "apartment";
                return (
                  <Link
                    key={property._id}
                    href={`/properties/${property._id}`}
                    className="block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition duration-300"
                  >
                    <div className="relative">
                      {property.images[0] ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-52 object-cover"
                        />
                      ) : (
                        <div className="w-full h-52 bg-grad from-slate-200 to-slate-300 flex items-center justify-center text-5xl">
                          🏠
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {property.purpose === "rent" ? "For Rent" : "For Sale"}
                      </span>
                    </div>
                    <div className="p-5">
                      <h2 className="font-semibold text-lg truncate text-slate-900">
                        {property.title}
                      </h2>
                      <p className="text-blue-600 font-bold text-xl mt-1">
                        PKR {property.price.toLocaleString()}
                        {property.purpose === "rent" && (
                          <span className="text-sm font-normal text-slate-500">
                            {" "}
                            /month
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-4 pt-4 border-t border-slate-200">
                        <span>📍 {property.location.city}</span>
                        {isResidential && (
                          <>
                            <span>🛏 {property.bedrooms}</span>
                            <span>🛁 {property.bathrooms}</span>
                          </>
                        )}
                        <span>📐 {property.area}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <Link
                  href={pageHref(params, Math.max(1, currentPage - 1))}
                  aria-disabled={currentPage === 1}
                  className={`px-5 py-2 rounded-xl border font-medium text-sm transition-colors ${
                    currentPage === 1
                      ? "border-slate-200 text-slate-300 pointer-events-none"
                      : "border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600"
                  }`}
                >
                  ← Previous
                </Link>

                <span className="text-sm text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>

                <Link
                  href={pageHref(params, Math.min(totalPages, currentPage + 1))}
                  aria-disabled={currentPage === totalPages}
                  className={`px-5 py-2 rounded-xl border font-medium text-sm transition-colors ${
                    currentPage === totalPages
                      ? "border-slate-200 text-slate-300 pointer-events-none"
                      : "border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600"
                  }`}
                >
                  Next →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}