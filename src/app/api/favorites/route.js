import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

// Toggle: agar favorite hai to hatao, nahi to add karo
export async function POST(req) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const { propertyId } = await req.json();
    if (!propertyId) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(currentUser.id);
    const alreadySaved = user.favorites.some(
      (fav) => fav.toString() === propertyId
    );

    if (alreadySaved) {
      user.favorites = user.favorites.filter(
        (fav) => fav.toString() !== propertyId
      );
    } else {
      user.favorites.push(propertyId);
    }

    await user.save();

    return NextResponse.json(
      {
        message: alreadySaved ? "Removed from favorites" : "Added to favorites",
        saved: !alreadySaved,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}

// User ki saari favorite properties laana
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(currentUser.id).populate("favorites");

    return NextResponse.json({ favorites: user.favorites }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}