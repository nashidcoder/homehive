import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const { propertyId, reason, message } = await req.json();

    if (!propertyId || !reason) {
      return NextResponse.json(
        { error: "Property and reason are required" },
        { status: 400 }
      );
    }

    await connectDB();

    await Report.create({
      property: propertyId,
      reporter: currentUser.id,
      reason,
      message,
    });

    return NextResponse.json(
      { message: "Report submitted. Thank you for letting us know." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}