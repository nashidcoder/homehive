import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";

const categories = [
  { label: "Houses", type: "house", icon: "🏠" },
  { label: "Apartments", type: "apartment", icon: "🏢" },
  { label: "Plots", type: "plot", icon: "🌳" },
  { label: "Shops", type: "shop", icon: "🏪" },
];

const reasons = [
  {
    icon: "🏡",
    title: "Wide Range of Properties",
    text: "Houses, apartments, plots, and shops in one place.",
  },
  {
    icon: "🔍",
    title: "Smart Search",
    text: "Filter by city, price, type, and purpose to find exactly what you need.",
  },
  {
    icon: "📞",
    title: "Direct Contact",
    text: "Message or call property owners directly, no middleman.",
  },
];

export default async function HomePage() {
  await connectDB();

  const featuredProperties = await Property.find({ status: "available" })
    .sort({ views: -1 })
    .limit(6);

  return (
    <div>
      <section
        className="relative bg-cover bg-center"
        style={{
          backgroundColor: "#0f172a",
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.6), rgba(15,23,42,0.8)), url('/hero.jpg')",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-28 sm:py-40 text-center">
          <span className="inline-block bg-white/10 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full mb-6 border border-white/20">
            🏡 Buy · Rent · Sell
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-5 leading-tight">
            Find Your Perfect <br className="hidden sm:block" />
            <span className="text-blue-400">Place to Call Home</span>
          </h1>

          <p className="text-slate-200 text-lg mb-10 max-w-xl mx-auto">
            Discover houses, apartments, and plots for sale or rent, all in one place.
          </p>

          <form
            action="/properties"
            className="bg-white rounded-2xl p-3 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-2xl"
          >
            <input
              type="text"
              name="city"
              placeholder="Which city are you looking in?"
              className="flex-1 bg-slate-100 text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3"
            />
            <select
              name="purpose"
              className="bg-slate-100 text-slate-900 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 sm:w-44"
            >
              <option value="">Any Purpose</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.type}
              href={`/properties?propertyType=${cat.type}`}
              className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-blue-300 transition duration-300"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <p className="font-semibold text-slate-900">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-blue-600 font-semibold text-sm mb-1">MOST VIEWED</p>
            <h2 className="text-3xl font-bold text-slate-900">Featured Properties</h2>
          </div>
          <Link href="/properties" className="text-blue-600 font-medium hover:underline">
            View all →
          </Link>
        </div>

        {featuredProperties.length === 0 ? (
          <p className="text-slate-500 text-center py-10">
            No properties listed yet. Be the first!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {featuredProperties.map((property) => {
              const isResidential =
                property.propertyType === "house" || property.propertyType === "apartment";
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
                    <h3 className="font-semibold text-lg truncate text-slate-900">
                      {property.title}
                    </h3>
                    <p className="text-blue-600 font-bold text-xl mt-1">
                      PKR {property.price.toLocaleString()}
                      {property.purpose === "rent" && (
                        <span className="text-sm font-normal text-slate-500"> /month</span>
                      )}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-4 pt-4 border-t border-slate-200">
                      <span>📍 {property.location.city}</span>
                      {isResidential && <span>🛏 {property.bedrooms}</span>}
                      <span>📐 {property.area} sqft</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-slate-900 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-blue-400 font-semibold text-sm text-center mb-2">
            WHY HOMEHIVE
          </p>
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Everything You Need to Find a Home
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {reasons.map((item) => (
              <div
                key={item.title}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors"
              >
                <div className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-20">
        <div className="bg-blue-700 rounded-3xl px-6 py-14 sm:px-12 text-center shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Have a property to sell or rent?
          </h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            List your property on HomeHive and reach buyers and renters directly.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Get Started, It's Free
          </Link>
        </div>
      </section>
    </div>
  );
}