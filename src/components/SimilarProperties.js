import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";

export default async function SimilarProperties({ city, propertyType, excludeId }) {
  await connectDB();

  const similar = await Property.find({
    _id: { $ne: excludeId },
    status: "available",
    $or: [{ "location.city": city }, { propertyType }],
  })
    .limit(3)
    .sort({ views: -1 });

  if (similar.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Similar Properties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {similar.map((property) => (
          <Link
            key={property._id}
            href={`/properties/${property._id}`}
            className="block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition duration-300"
          >
            {property.images[0] ? (
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-grad from-slate-200 to-slate-300 flex items-center justify-center text-4xl">
                🏠
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold truncate text-slate-900">{property.title}</h3>
              <p className="text-blue-600 font-bold mt-1">
                PKR {property.price.toLocaleString()}
              </p>
              <p className="text-sm text-slate-500 mt-1">📍 {property.location.city}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}