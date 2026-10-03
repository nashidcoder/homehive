import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "HomeHive - Find Your Perfect Property",
  description: "Browse, list, and find properties easily on HomeHive",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased">
        <Navbar />
        <main>{children}</main>

        <footer className="bg-slate-900 text-slate-400 mt-20">
          <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white font-extrabold text-lg">
              🏠 Home<span className="text-blue-400">Hive</span>
            </p>
            <p className="text-sm">© 2026 HomeHive. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}