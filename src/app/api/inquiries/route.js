import connectDB from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import Property from "@/models/Property";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { sendInquiryEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const { propertyId, message } = await req.json();
    if (!propertyId || !message) {
      return NextResponse.json(
        { error: "Property and message are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (property.owner.toString() === currentUser.id) {
      return NextResponse.json(
        { error: "You cannot message your own property" },
        { status: 400 }
      );
    }

    const inquiry = await Inquiry.create({
      property: propertyId,
      owner: property.owner,
      sender: currentUser.id,
      message,
    });

    const [owner, sender] = await Promise.all([
      User.findById(property.owner).select("name email"),
      User.findById(currentUser.id).select("name"),
    ]);

    if (owner?.email) {
      sendInquiryEmail({
        to: owner.email,
        ownerName: owner.name,
        senderName: sender?.name || "A user",
        propertyTitle: property.title,
        message,
      });
    }

    return NextResponse.json(
      { message: "Message sent successfully", inquiry },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    await connectDB();

    const inquiries = await Inquiry.find({ owner: currentUser.id })
      .populate("property", "title images")
      .populate("sender", "name email phone")
      .sort({ createdAt: -1 });

    return NextResponse.json({ inquiries }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}