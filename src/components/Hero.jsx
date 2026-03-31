import React from "react";
import Hero_photo from "../assets/frontend_assets/Hero_photo.png";

const Hero = () => {
  return (
    <section className="bg-[#fcf9e9] flex flex-col items-center text-center px-6 sm:px-10 py-10">
      {/* Hero Image */}
      <div className="w-full flex justify-center">
        <img
          src={Hero_photo}
          alt="Village scene showing artisans at work"
          className="w-full max-w-8xl object-contain"
        />
      </div>

      {/* Text Section */}
      <div className="mt-10 max-w-3xl">
        <p className="text-lg leading-relaxed font-medium text-gray-800">
          A hand shapes the clay, a loom sings in rhythm, <br />
          every thread, every stroke carries a legacy.
          <br />
          Craft holds memory, memory becomes story, <br />
          story becomes heritage, and heritage finds its way home.
          <br />
          <br />
          <span className="font-semibold">KalaSetu</span> is the bridge — <br />
          between the maker and the admirer, <br />
          between tradition and today, <br />
          between craft and its true value.
        </p>

        <p className="mt-6 font-bold text-xl tracking-wide">THIS IS कलाSETU</p>

        <h2 className="text-5xl sm:text-6xl font-extrabold text-[#e56a00] mt-4">
          Our Story
        </h2>
      </div>
    </section>
  );
};

export default Hero;
