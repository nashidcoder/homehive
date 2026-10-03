import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import User from "@/models/User";
import Review from "@/models/Review";
import FavoriteButton from "@/components/FavoriteButton";
import ContactOwnerForm from "@/components/ContactOwnerForm";
import ReviewsSection from "@/components/ReviewsSection";
import SimilarProperties from "@/components/SimilarProperties";
import ReportButton from "@/components/ReportButton";
import { getCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";

const storyLabels = {
  single: "Single Story",
  double: "Double Story",
  triple: "Triple Story",
};

export async function generateMetadata({ params }) {
  const { id } = await params;

  await connectDB();
  let property;
  try {
    property = await Property.findById(id);
  } catch (err) {
    property = null;
  }

  if (!property) {
    return { title: "Property not found - HomeHive" };
  }

  return {
    title: `${property.title} - HomeHive`,
    description: `${property.propertyType} for ${property.purpose} in ${property.location.city}. PKR ${property.price.toLocaleString()}.`,
    openGraph: {
      title: property.title,
      description: property.description?.slice(0, 150),
      images: property.images[0] ? [property.images[0]] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }) {
  const { id } = await params;

  await connectDB();

  let property;
  try {
    property = await Property.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { returnDocument: "after" }
    ).populate("owner", "name phone email");
  } catch (err) {
    property = null;
  }

  if (!property) {
    notFound();
  }

  const currentUser = await getCurrentUser();

  let isFavorited = false;
  if (currentUser) {
    const userDoc = await User.findById(currentUser.id);
    isFavorited = userDoc.favorites.some(
      (fav) => fav.toString() === property._id.toString()
    );
  }

  const owner = property.owner;
  const isOwner = Boolean(currentUser && owner?._id?.toString() === currentUser.id);
  const images = property.images || [];
  const thumbs = images.slice(1, 5);
  const listedOn = new Date(property.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const ownerReviews = owner ? await Review.find({ owner: owner._id }) : [];
  const ratingAvg =
    ownerReviews.length > 0
      ? ownerReviews.reduce((sum, r) => sum + r.rating, 0) / ownerReviews.length
      : 0;

  const mapQuery = encodeURIComponent(
    `${property.location.address}, ${property.location.city}`
  );

  const propertyType = property.propertyType;
  const isResidential = propertyType === "house" || propertyType === "apartment";

  const features = [{ icon: "📐", value: property.area, label: "Sq Ft" }];
  if (isResidential) {
    features.unshift(
      { icon: "🛁", value: property.bathrooms, label: "Bathrooms" },
      { icon: "🛏", value: property.bedrooms, label: "Bedrooms" }
    );
  }
  if (propertyType === "house" && property.stories && property.stories !== "na") {
    features.push({
      icon: "🏢",
      value: storyLabels[property.stories] || property.stories,
      label: "Stories",
    });
  }
  features.push({ icon: "🏠", value: propertyType, label: "Type" });

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/properties"
          className="inline-block text-sm text-slate-500 hover:text-blue-600 mb-5"
        >
          ← Back to all properties
        </Link>

        <div className={`grid gap-3 mb-8 ${thumbs.length > 0 ? "lg:grid-cols-2" : ""}`}>
          {images[0] ? (
            <img
              src={images[0]}
              alt={property.title}
              className="w-full h-72 lg:h-26rem object-cover rounded-2xl"
            />
          ) : (
            <div className="w-full h-72 lg:h-26rem bg-grad from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center text-7xl">
              🏠
            </div>
          )}

          {thumbs.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {thumbs.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${property.title} ${i + 2}`}
                  className="w-full h-36 lg:h-[12.6rem] object-cover rounded-2xl"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {property.purpose === "rent" ? "For Rent" : "For Sale"}
                  </span>
                  <span className="bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                    {propertyType}
                  </span>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                      property.status === "available"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">
                  {property.title}
                </h1>
                <p className="text-slate-500 mt-2">
                  📍 {property.location.address}, {property.location.city}
                </p>
              </div>

              {currentUser && (
                <div className="shrink-0 bg-white border border-slate-200 rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
                  <FavoriteButton
                    propertyId={property._id.toString()}
                    initialSaved={isFavorited}
                  />
                </div>
              )}
            </div>

            <p className="text-4xl font-extrabold text-blue-600 mt-5">
              PKR {property.price.toLocaleString()}
              {property.purpose === "rent" && (
                <span className="text-lg font-normal text-slate-500"> /month</span>
              )}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {features.map((item) => (
                <div
                  key={item.label}
                  className="bg-white border border-slate-200 rounded-xl p-4 text-center"
                >
                  <p className="text-2xl mb-1">{item.icon}</p>
                  <p className="font-bold text-slate-900 capitalize">{item.value}</p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-6">
              <h2 className="font-bold text-lg text-slate-900 mb-3">Description</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-6">
              <h2 className="font-bold text-lg text-slate-900 mb-3">Location</h2>
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <iframe
                  title="Property location"
                  width="100%"
                  height="300"
                  loading="lazy"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                />
              </div>
            </div>

            {owner && (
              <ReviewsSection
                ownerId={owner._id.toString()}
                canReview={Boolean(currentUser && !isOwner)}
              />
            )}
          </div>

          <div className="lg:w-80 shrink-0">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                  {owner?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {owner?.name || "Owner"}
                  </p>
                  <p className="text-xs text-slate-500">Property Owner</p>
                </div>
              </div>

              {ownerReviews.length > 0 && (
                <p className="text-sm text-amber-500 mb-4">
                  {"★".repeat(Math.round(ratingAvg))}
                  <span className="text-slate-300">
                    {"★".repeat(5 - Math.round(ratingAvg))}
                  </span>{" "}
                  <span className="text-slate-500">
                    {ratingAvg.toFixed(1)} ({ownerReviews.length} reviews)
                  </span>
                </p>
              )}

              {owner?.phone && (
                <a
                  href={`tel:${owner.phone}`}
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  📞 {owner.phone}
                </a>
              )}

              {currentUser && !isOwner && (
                <ContactOwnerForm propertyId={property._id.toString()} />
              )}

              {isOwner && (
                <p className="text-sm text-slate-500 text-center mt-4">
                  This is your own listing.
                </p>
              )}

              {!currentUser && (
                <p className="text-sm text-slate-500 text-center mt-4">
                  <Link href="/login" className="text-blue-600 font-medium">
                    Login
                  </Link>{" "}
                  to message the owner
                </p>
              )}

              <p className="text-xs text-slate-400 text-center mt-5">
                👁 {property.views} views · Listed {listedOn}
              </p>

              {currentUser && !isOwner && (
                <div className="text-center">
                  <ReportButton propertyId={property._id.toString()} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SimilarProperties
        city={property.location.city}
        propertyType={propertyType}
        excludeId={property._id.toString()}
      />
    </div>
  );
}