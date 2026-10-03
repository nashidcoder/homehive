import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// Naya review dena
export async function POST(req) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const { ownerId, rating, comment } = await req.json();

    if (!ownerId || !rating || !comment) {
      return NextResponse.json(
        { error: "Rating and comment are required" },
        { status: 400 }
      );
    }

    if (ownerId === currentUser.id) {
      return NextResponse.json(
        { error: "You cannot review yourself" },
        { status: 400 }
      );
    }

    await connectDB();

    const review = await Review.create({
      owner: ownerId,
      reviewer: currentUser.id,
      rating: Number(rating),
      comment,
    });

    return NextResponse.json(
      { message: "Review posted successfully", review },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

// Ek owner ke saare reviews laana
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId");

    if (!ownerId) {
      return NextResponse.json({ error: "ownerId is required" }, { status: 400 });
    }

    await connectDB();

    const reviews = await Review.find({ owner: ownerId })
      .populate("reviewer", "name")
      .sort({ createdAt: -1 });

    const average =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json(
      { reviews, average, count: reviews.length },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}