"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const inputStyle =
  "w-full bg-slate-100 text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3";

export default function PropertyFilters({ cities = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    propertyType: searchParams.get("propertyType") || "",
    purpose: searchParams.get("purpose") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white border border-slate-200 rounded-2xl shadow-xl p-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="text"
          name="city"
          list="city-options"
          placeholder="City"
          value={filters.city}
          onChange={handleChange}
          className={inputStyle}
        />
        <datalist id="city-options">
          {cities.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        <select
          name="propertyType"
          value={filters.propertyType}
          onChange={handleChange}
          className={inputStyle}
        >
          <option value="">All Types</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="plot">Plot</option>
          <option value="shop">Shop</option>
        </select>

        <select
          name="purpose"
          value={filters.purpose}
          onChange={handleChange}
          className={inputStyle}
        >
          <option value="">Sale or Rent</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>

        <select
          name="bedrooms"
          value={filters.bedrooms}
          onChange={handleChange}
          className={inputStyle}
        >
          <option value="">Any Bedrooms</option>
          <option value="1">1+ Beds</option>
          <option value="2">2+ Beds</option>
          <option value="3">3+ Beds</option>
          <option value="4">4+ Beds</option>
          <option value="5">5+ Beds</option>
        </select>

        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
          className={inputStyle}
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
          className={inputStyle}
        />

        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className={inputStyle}
        >
          <option value="">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="popular">Most Viewed</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-3 transition-colors"
        >
          Search
        </button>
      </div>

      <div className="mt-3 text-right">
        <Link href="/properties" className="text-sm text-slate-500 hover:text-blue-600">
          Clear all filters
        </Link>
      </div>
    </form>
  );
}