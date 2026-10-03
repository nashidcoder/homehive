import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    propertyType: {
      type: String,
      enum: ["house", "apartment", "plot", "shop"],
      required: true,
    },
    purpose: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },
    bedrooms: {
      type: Number,
      default: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
    },
    stories: {
      type: String,
      enum: ["single", "double", "triple", "na"],
      default: "na",
    },
    area: {
      type: Number,
      required: true,
    },
    location: {
      city: { type: String, required: true },
      address: { type: String, required: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    images: [
      {
        type: String,
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "sold", "rented"],
      default: "available",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Property || mongoose.model("Property", PropertySchema);