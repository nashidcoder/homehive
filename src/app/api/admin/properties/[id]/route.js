import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import { getAdminUser } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    await Property.findByIdAndDelete(id);

    return NextResponse.json({ message: "Property deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}