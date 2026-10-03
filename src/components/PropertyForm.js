"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

const inputStyle =
  "w-full bg-slate-100 text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-blue-500 focus:bg-white focus:outline-none rounded-xl px-4 py-3 transition-colors";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
      {children}
    </label>
  );
}

const emptyForm = {
  title: "",
  description: "",
  price: "",
  area: "",
  propertyType: "house",
  purpose: "sale",
  bedrooms: "",
  bathrooms: "",
  stories: "single",
  city: "",
  address: "",
  images: [],
  status: "available",
};

export default function PropertyForm({ mode = "add", propertyId, initial }) {
  const router = useRouter();
  const [formData, setFormData] = useState(initial || emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = mode === "edit";
  const showBedBath =
    formData.propertyType === "house" || formData.propertyType === "apartment";
  const showStories = formData.propertyType === "house";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    const isResidential = newType === "house" || newType === "apartment";
    setFormData({
      ...formData,
      propertyType: newType,
      bedrooms: isResidential ? formData.bedrooms : "",
      bathrooms: isResidential ? formData.bathrooms : "",
      stories: newType === "house" ? formData.stories || "single" : "na",
    });
  };

  const handleImagesChange = (newImages) => {
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.images.length === 0) {
      setError("Please upload at least one photo");
      return;
    }

    setLoading(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      price: Number(formData.price),
      propertyType: formData.propertyType,
      purpose: formData.purpose,
      bedrooms: showBedBath ? Number(formData.bedrooms) || 0 : 0,
      bathrooms: showBedBath ? Number(formData.bathrooms) || 0 : 0,
      stories: showStories ? formData.stories : "na",
      area: Number(formData.area),
      location: {
        city: formData.city,
        address: formData.address,
      },
      images: formData.images,
    };

    if (isEdit) {
      payload.status = formData.status;
    }

    const res = await fetch(
      isEdit ? `/api/properties/${propertyId}` : "/api/properties",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-8"
    >
      {error && (
        <p className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <h2 className="font-bold text-lg text-slate-900">Basic Info</h2>
        <Field label="Title">
          <input
            type="text"
            name="title"
            placeholder="e.g. 5 Marla Modern House"
            value={formData.title}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </Field>
        <Field label="Description">
          <textarea
            name="description"
            placeholder="Describe the property, nearby places, features..."
            value={formData.description}
            onChange={handleChange}
            className={inputStyle}
            rows={5}
            required
          />
        </Field>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-lg text-slate-900">Type and Price</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Property Type">
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleTypeChange}
              className={inputStyle}
            >
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="plot">Plot</option>
              <option value="shop">Shop</option>
            </select>
          </Field>
          <Field label="Purpose">
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </Field>
          <Field label="Price (PKR)">
            <input
              type="number"
              name="price"
              placeholder="e.g. 15000000"
              value={formData.price}
              onChange={handleChange}
              className={inputStyle}
              min="0"
              required
            />
          </Field>
          <Field label="Area (sq ft)">
            <input
              type="number"
              name="area"
              placeholder="e.g. 1125"
              value={formData.area}
              onChange={handleChange}
              className={inputStyle}
              min="0"
              required
            />
          </Field>

          {showBedBath && (
            <>
              <Field label="Bedrooms">
                <input
                  type="number"
                  name="bedrooms"
                  placeholder="0"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className={inputStyle}
                  min="0"
                />
              </Field>
              <Field label="Bathrooms">
                <input
                  type="number"
                  name="bathrooms"
                  placeholder="0"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className={inputStyle}
                  min="0"
                />
              </Field>
            </>
          )}

          {showStories && (
            <Field label="Stories">
              <select
                name="stories"
                value={formData.stories}
                onChange={handleChange}
                className={inputStyle}
              >
                <option value="single">Single Story</option>
                <option value="double">Double Story</option>
                <option value="triple">Triple Story</option>
              </select>
            </Field>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-lg text-slate-900">Location</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="City">
            <input
              type="text"
              name="city"
              placeholder="e.g. Lahore"
              value={formData.city}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </Field>
          <Field label="Full Address">
            <input
              type="text"
              name="address"
              placeholder="Street, area"
              value={formData.address}
              onChange={handleChange}
              className={inputStyle}
              required
            />
          </Field>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold text-lg text-slate-900">Photos</h2>
        <ImageUploader images={formData.images} onChange={handleImagesChange} />
      </div>

      {isEdit && (
        <div className="space-y-4">
          <h2 className="font-bold text-lg text-slate-900">Status</h2>
          <Field label="Availability">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </Field>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
      >
        {loading
          ? isEdit
            ? "Saving..."
            : "Publishing..."
          : isEdit
          ? "Save Changes"
          : "Publish Property"}
      </button>
    </form>
  );
}