import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertyForm from "@/components/PropertyForm";

export default async function EditPropertyPage({ params }) {
  const { id } = await params;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "owner") {
    redirect("/");
  }

  await connectDB();

  let property;
  try {
    property = await Property.findById(id);
  } catch (err) {
    property = null;
  }

  if (!property) {
    notFound();
  }

  if (property.owner.toString() !== currentUser.id) {
    redirect("/dashboard");
  }

  const initial = {
    title: property.title,
    description: property.description,
    price: property.price,
    area: property.area,
    propertyType: property.propertyType,
    purpose: property.purpose,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    city: property.location.city,
    address: property.location.address,
    images: property.images,
    status: property.status,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/dashboard"
        className="inline-block text-sm text-slate-500 hover:text-blue-600 mb-4"
      >
        ← Back to dashboard
      </Link>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Edit Property</h1>
      <PropertyForm mode="edit" propertyId={id} initial={initial} />
    </div>
  );
}