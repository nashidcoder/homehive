import connectDB from "@/lib/mongodb";
import User from "@/models/User";
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

    if (id === admin.id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    await connectDB();

    await Property.deleteMany({ owner: id });
    await User.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "User and their properties deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}