import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Property from "@/models/Property";
import RemoveFavoriteButton from "@/components/RemoveFavoriteButton";

export default async function FavoritesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  await connectDB();

  const userDoc = await User.findById(currentUser.id).populate({
    path: "favorites",
    model: Property,
  });
  const favorites = (userDoc?.favorites || []).filter(Boolean);

  return (
    <div>
      <section className="bg-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-blue-400 font-semibold text-sm mb-2">SAVED</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            My Favorites
          </h1>
          <p className="text-slate-400 mt-2">
            {favorites.length} {favorites.length === 1 ? "property" : "properties"} saved
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {favorites.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl text-center py-16 px-4">
            <p className="text-5xl mb-3">🤍</p>
            <h2 className="text-xl font-semibold text-slate-900 mb-1">
              You haven't saved any property yet
            </h2>
            <p className="text-slate-500 mb-6">
              Tap the heart on any property to save it here.
            </p>
            <Link
              href="/properties"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Browse properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {favorites.map((property) => {
              const isResidential =
                property.propertyType === "house" || property.propertyType === "apartment";
              return (
                <Link
                  key={property._id}
                  href={`/properties/${property._id}`}
                  className="relative block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition duration-300"
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
                    <RemoveFavoriteButton propertyId={property._id.toString()} />
                  </div>
                  <div className="p-5">
                    <h2 className="font-semibold text-lg truncate text-slate-900">
                      {property.title}
                    </h2>
                    <p className="text-blue-600 font-bold text-xl mt-1">
                      PKR {property.price.toLocaleString()}
                      {property.purpose === "rent" && (
                        <span className="text-sm font-normal text-slate-500"> /month</span>
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
        )}
      </div>
    </div>
  );
}