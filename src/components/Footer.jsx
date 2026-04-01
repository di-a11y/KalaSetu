import React from "react";
import {
  FaFacebookF,
  FaYoutube,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#B7A167] text-[#0a0a0a] relative overflow-hidden pt-[70px] pb-[40px] px-10 font-[Poppins]">
      {/* Footer main container */}
      <div className="max-w-[1300px] mx-auto grid gap-10 
  grid-cols-1 
  sm:grid-cols-2 
  lg:grid-cols-5">
        {/* Left section (Logo + tagline) */}
        <div className="flex flex-col justify-start sm:col-span-2 lg:col-span-2 text-center sm:text-left">
          <h1 className="font-[Inknut_Antiqua] text-[50px] font-light text-black mb-[12px] tracking-[1px]">
            <span className="font-[Amita] font-bold">कला</span>
            <span className="font-[Amita] ml-1">Setu</span>
          </h1>
          <p className="text-[18px] mt-[3px] text-[#1a1a1a]">
            Bridging artisans to the world
          </p>
        </div>

        {/* My Account Links */}
        <div className="flex flex-col text-center sm:text-left">
          <h4 className="text-[18px] mb-[18px] font-bold tracking-[0.5px] text-black">
            MY ACCOUNT LINKS
          </h4>
          <ul className="space-y-[10px]">
            <li><a href="#" className="hover:text-white transition-colors duration-300">My Account</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Cart</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Checkout</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Track Order</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Wishlist</a></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div className="flex flex-col text-center sm:text-left">
          <h4 className="text-[18px] mb-[18px] font-bold tracking-[0.5px] text-black">
            USEFUL LINKS
          </h4>
          <ul className="space-y-[10px]">
            <li><a href="#" className="hover:text-white transition-colors duration-300">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Return & Refund Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Blog</a></li>
          </ul>
        </div>

        {/* Learn More */}
        <div className="flex flex-col text-center sm:text-left">
          <h4 className="text-[18px] mb-[18px] font-bold tracking-[0.5px] text-black">
            LEARN MORE
          </h4>
          <ul className="space-y-[10px]">
            <li><a href="#" className="hover:text-white transition-colors duration-300">Our Story</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">How We Support Artisans</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Discover Indian Crafts</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Why Handcrafted Products Matter</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Reviving Indian Crafts</a></li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div className="flex flex-col text-center sm:text-left">
          <h4 className="text-[18px] mb-[18px] font-bold tracking-[0.5px] text-black">
            CONNECT WITH US
          </h4>

          {/* Social Icons */}
          <div className="flex flex-wrap gap-[15px] mt-[10px] justify-start md:justify-left">
            <SocialIcon
              Icon={FaFacebookF}
              color="hover:bg-[#3b5998]"
              ariaLabel="Facebook"
            />
            <SocialIcon
              Icon={FaYoutube}
              color="hover:bg-[#bc1212]"
              ariaLabel="YouTube"
            />
            <SocialIcon
              Icon={FaInstagram}
              color="hover:bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888]"
              ariaLabel="Instagram"
            />
            <SocialIcon
              Icon={FaWhatsapp}
              color="hover:bg-[#1eb355]"
              ariaLabel="WhatsApp"
            />
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="text-center mt-[50px] border-t border-black/30 pt-[18px] text-[14px] text-[#2d2d2d]">
        <p>&copy; 2025 KalaSetu. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

/* Social icon component with shake effect */
const SocialIcon = ({ Icon, color, ariaLabel }) => {
  return (
    <a
      href="#"
      aria-label={ariaLabel}
      className={`w-[38px] h-[38px] rounded-full flex items-center justify-center outline outline-2 outline-black bg-transparent transition-all duration-300 hover:scale-110 hover:animate-shake ${color}`}
    >
      <Icon className="text-[18px] text-black hover:text-white" />
    </a>
  );
};

export default Footer;
