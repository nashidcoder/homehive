# HomeHive 🏠

HomeHive is a full-stack real estate platform built with Next.js, where people can browse, list, and manage properties for sale or rent. Think of it as a simplified version of Zameen.com or Zillow — buyers can search and save properties, while owners can list their own properties and respond to interested buyers.

This project was built from scratch to practice and demonstrate full-stack web development: authentication, database design, file uploads, email notifications, and a responsive, modern user interface.

## What you can do on HomeHive

**As a visitor**
- Browse all listed properties
- Search by city, price range, property type, and number of bedrooms
- Sort results by newest, price, or popularity
- View full property details, including photos, location on a map, and owner contact info

**As a buyer (after signing up)**
- Save properties to a favorites list
- Message property owners directly
- Leave a rating and review for property owners
- Report a listing that looks fake, outdated, or incorrect

**As a property owner**
- List new properties with multiple photos, pricing, and location details
- Edit or delete your own listings
- Mark a property as sold or rented
- See a dashboard with total views, listings, and messages from interested buyers

**As an admin**
- View overall platform statistics
- Manage all users and properties
- Review and act on reported listings

## Built with

- **Next.js** (App Router) — the core framework
- **JavaScript** — no TypeScript, kept simple and readable
- **MongoDB with Mongoose** — database and data modeling
- **Tailwind CSS** — styling
- **JWT (JSON Web Tokens)** — custom authentication, stored in secure HTTP-only cookies
- **Cloudinary** — image uploads and hosting
- **Resend** — transactional emails (inquiry notifications, password reset)

## Demo accounts

Since this is a portfolio project, you can explore it without creating your own account:

- **Buyer account:** demo.buyer@homehive.com / demo1234
- **Owner account:** demo.owner@homehive.com / demo1234

Feel free to browse properties, save favorites, and try listing a new property.

## Running this project locally

1. Clone the repository