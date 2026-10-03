import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// Naya property add karna
export async function POST(req) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    if (currentUser.role !== "owner") {
      return NextResponse.json(
        { error: "Only owners can list properties" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await req.json();

    const property = await Property.create({
      ...body,
      owner: currentUser.id,
    });

    return NextResponse.json(
      { message: "Property listed successfully", property },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

// Saari properties list karna (search/filters ke sath)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const propertyType = searchParams.get("propertyType");
    const purpose = searchParams.get("purpose");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    let query = { status: "available" };

    if (city) query["location.city"] = { $regex: city, $options: "i" };
    if (propertyType) query.propertyType = propertyType;
    if (purpose) query.purpose = purpose;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query)
      .populate("owner", "name phone")
      .sort({ createdAt: -1 });

    return NextResponse.json({ properties }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}