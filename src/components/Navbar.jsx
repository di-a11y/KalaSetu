import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import search_icon from "../assets/frontend_assets/search_icon.png";
import profile_icon from "../assets/frontend_assets/profile_icon.png";
import cart_icon from "../assets/frontend_assets/cart_icon.png";
import menu_icon from "../assets/frontend_assets/menu_icon.png";
import dropdown_icon from "../assets/frontend_assets/dropdown_icon.png"



const Navbar = () => {
  const [visible, setVisible] = useState(false);

  return (
    <header className="w-full font-medium bg-[#B7A167]">

      <div className="flex items-center justify-between px-8 py-5">
        <Link to="/">
          <div>
            <div className="flex items-baseline gap-2 cursor-pointer" to="/">
              <h1 className="text-4xl font-bold font-serif tracking-tight">कला</h1>
              <span className="text-2xl font-serif tracking-wide">SETU</span>
            </div>
            <p className="italic text-sm mt-1 text-[#2f2616]">
              Bridging artisans to the world
            </p>
          </div>
        </Link>


        <div className="flex items-center gap-6">
          <img src={search_icon} alt="search" className="w-5 cursor-pointer" />

          <div className="group relative">
            <img src={profile_icon} alt="profile" className="w-5 cursor-pointer" />
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-amber-100 text-gray-500 rounded">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p className="cursor-pointer hover:text-black">Orders</p>
                <p className="cursor-pointer hover:text-black">Logout</p>
              </div>
            </div>
          </div>
          <Link to='/Cart' className="relative">
            <img src={cart_icon} alt="cart" className="w-5 min-w-5" />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">15</p>
          </Link>
          <img onClick={() => setVisible(true)} src={menu_icon} alt="menu" className="w-5 cursor-pointer sm:hidden" />


        </div>

        {/* Sidebar menu for small screens */}
        <div className={`fixed top-0 right-0 bottom-0 z-50 overflow-hidden bg-white transition-all duration ${visible ? 'w-full' : 'w-0'}`}>
          <div className="flex flex-col text-gray-600">
            <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
              <img className="h-4 rotate-180" src={dropdown_icon} alt="dropdown" />
              <p>Back</p>
            </div>
            <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/About">About</NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/Handicrafts">Handicrafts</NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/Categories">Clothing</NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/Endangered">Endangered</NavLink>
            <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/Stories">Stories</NavLink>
          </div>

        </div>

      </div>

      <nav className="hidden sm:block bg-[#EACD84] px-8 py-2 relative">
        <ul className="flex space-x-6 text-sm md:text-base text-black">

          {/* About */}
          <li className="relative group cursor-pointer">
            <span className="hover:underline">About</span>
            <div className="absolute hidden group-hover:block top-full left-0 pt-3 z-50">
              <div className="flex flex-col gap-2 w-44 py-3 px-4 bg-amber-100 text-gray-700 rounded shadow-lg">
                <NavLink to="/About" className="hover:text-black">Our Mission</NavLink>
                <NavLink to="/About/team" className="hover:text-black">Team</NavLink>
              </div>
            </div>
          </li>

          {/* Handicrafts */}
          <li className="relative group cursor-pointer">
            <span className="hover:underline">Handicrafts</span>
            <div className="absolute hidden group-hover:block top-full left-0 pt-3 z-50">
              <div className="flex flex-col gap-2 w-44 py-3 px-4 bg-amber-100 text-gray-700 rounded shadow-lg">
                <NavLink to="/handicrafts/all" className="hover:text-black">All Items</NavLink>
                <NavLink to="/handicrafts/popular" className="hover:text-black">Popular</NavLink>
              </div>
            </div>
          </li>

          {/* Categories */}
          <li className="relative group cursor-pointer">
            <span className="hover:underline">Clothing</span>

            {/* Mega Menu */}
            <div className="absolute left-0 top-full pt-4 hidden group-hover:block z-50">

              <div className="w-[750px] bg-amber-100 shadow-lg rounded p-6">

                <div className="grid grid-cols-4 gap-10 text-sm">

                  {/* Women */}
                  <div>
                    <h3 className="font-semibold mb-3">Women</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li><NavLink to="/NewArrivals" className="hover:text-black">New Arrivals</NavLink></li>
                      <li><NavLink to="/KurtasSets" className="hover:text-black">Kurtas & Sets</NavLink></li>
                      <li><NavLink to="/Dresses" className="hover:text-black">Dresses</NavLink></li>
                      <li><NavLink to="/topsBlouses" className="hover:text-black">Tops & Blouses</NavLink></li>
                    </ul>
                  </div>

                  {/* Men */}
                  <div>
                    <h3 className="font-semibold mb-3">Men</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li><NavLink to="/handicrafts/allClothing" className="hover:text-black">All Clothing</NavLink></li>
                      <li><NavLink to="/handicrafts/men/kurtas" className="hover:text-black">Kurtas</NavLink></li>
                      <li><NavLink to="/handicrafts/men/shirts" className="hover:text-black">Shirts</NavLink></li>
                      <li><NavLink to="/handicrafts/men/shorts" className="hover:text-black">Shorts</NavLink></li>
                    </ul>
                  </div>

                  {/* Kids */}
                  <div>
                    <h3 className="font-semibold mb-3">Kids</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li><NavLink to="/handicrafts/kids/clothing" className="hover:text-black">Kids Clothing</NavLink></li>
                      <li><NavLink to="/handicrafts/kids/furnishing" className="hover:text-black">Furnishing</NavLink></li>
                    </ul>
                  </div>

                  {/* Crafts */}
                  <div>
                    <h3 className="font-semibold mb-3">Crafts</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li><NavLink to="/handicrafts/crafts/allReds" className="hover:text-black">All Reds</NavLink></li>
                      <li><NavLink to="/handicrafts/crafts/mirror-work" className="hover:text-black">Mirror Work</NavLink></li>
                      <li><NavLink to="/handicrafts/crafts/applique" className="hover:text-black">Applique</NavLink></li>
                      <li><NavLink to="/handicrafts/crafts/hand-embroidery" className="hover:text-black">Hand Embroidery</NavLink></li>
                      <li><NavLink to="/handicrafts/crafts/ikat" className="hover:text-black">Ikat</NavLink></li>
                    </ul>
                  </div>

                </div>

              </div>
            </div>
          </li>

          {/* Endangered */}
          <li className="relative group cursor-pointer">
            <span className="hover:underline">Endangered</span>
            <div className="absolute hidden group-hover:block top-full left-0 pt-3 z-50">
              <div className="flex flex-col gap-2 w-44 py-3 px-4 bg-amber-100 text-gray-700 rounded shadow-lg">
                <NavLink to="/endangered/blue-pottery" className="hover:text-black">Blue Pottery</NavLink>
                <NavLink to="/endangered/pattachitra" className="hover:text-black">Pattachitra</NavLink>
                <NavLink to="/endangered/toda" className="hover:text-black">Toda Embroidery</NavLink>
              </div>
            </div>
          </li>

          {/* Stories */}
          <li className="relative group cursor-pointer">
            <span className="hover:underline">Accessories</span>
            <div className="absolute hidden group-hover:block top-full left-0 pt-3 z-50">
              <div className="flex flex-col gap-2 w-44 py-3 px-4 bg-amber-100 text-gray-700 rounded shadow-lg">
                <NavLink to="/stories/latest" className="hover:text-black">Neckpiece</NavLink>
                <NavLink to="/stories/artisans" className="hover:text-black">Earrings</NavLink>
              </div>
            </div>
          </li>

          <li className="relative group cursor-pointer">
            <span className="hover:underline">Stories</span>
            <div className="absolute hidden group-hover:block top-full left-0 pt-3 z-50">
              <div className="flex flex-col gap-2 w-44 py-3 px-4 bg-amber-100 text-gray-700 rounded shadow-lg">
                <NavLink to="/stories/latest" className="hover:text-black">Latest</NavLink>
                <NavLink to="/stories/artisans" className="hover:text-black">Artisan Stories</NavLink>
              </div>
            </div>
          </li>

        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
