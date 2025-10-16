import React from "react";

const Navbar = () => {
  return (
    <header className="w-full font-medium bg-[#B7A167]">
      {/* Top section: logo + tagline + search icon */}
      <div className="flex items-center justify-between px-8 py-5">
        {/* Logo & tagline */}
        <div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-4xl font-bold font-serif tracking-tight">कला</h1>
            <span className="text-2xl font-serif tracking-wide">SETU</span>
          </div>
          <p className="italic text-sm mt-1 text-[#2f2616]">
            Bridging artisans to the world
          </p>
        </div>

        {/* Search Icon */}
        <button className="p-2 hover:opacity-80 cursor-pointer transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-10 h-10 text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 6a5 5 0 100 10 5 5 0 000-10z"
            />
          </svg>
        </button>
      </div>

      {/* Bottom nav links */}
      <nav className="bg-[#EACD84] px-8 py-2">
        <ul className="flex space-x-6 text-sm md:text-base text-black">
          <li className="hover:underline cursor-pointer">About</li>
          <li className="hover:underline cursor-pointer">Handicrafts</li>
          <li className="hover:underline cursor-pointer">Categories</li>
          <li className="hover:underline cursor-pointer">Endangered</li>
          <li className="hover:underline cursor-pointer">Stories</li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
