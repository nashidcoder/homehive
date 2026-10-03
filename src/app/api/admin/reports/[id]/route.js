import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import { getAdminUser } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    const report = await Report.findByIdAndUpdate(
      id,
      { status: "reviewed" },
      { returnDocument: "after" }
    );

    return NextResponse.json({ report }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    await connectDB();

    await Report.findByIdAndDelete(id);

    return NextResponse.json({ message: "Report deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}