import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

const allowedFields = [
  "title",
  "description",
  "price",
  "propertyType",
  "purpose",
  "bedrooms",
  "bathrooms",
  "area",
  "location",
  "images",
  "status",
];

// Ek property ki detail lena
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectDB();

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ property }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

// Property update karna
export async function PUT(req, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (property.owner.toString() !== currentUser.id) {
      return NextResponse.json(
        { error: "You can only edit your own properties" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const updates = {};
    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    });

    const updated = await Property.findByIdAndUpdate(id, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    return NextResponse.json(
      { message: "Property updated successfully", property: updated },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

// Property delete karna
export async function DELETE(req, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (property.owner.toString() !== currentUser.id) {
      return NextResponse.json(
        { error: "You can only delete your own properties" },
        { status: 403 }
      );
    }

    await Property.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Property deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}