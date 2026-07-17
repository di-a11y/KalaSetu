import React from "react";
import bluePottery from "../assets/frontend_assets/p_image1.png";
import pashmina from "../assets/frontend_assets/p_image2.png";
import mural from "../assets/frontend_assets/p_image3.png";
import dokra from "../assets/frontend_assets/p_image4.png";
import jewellery from "../assets/frontend_assets/p_image5.png";
import tribal from "../assets/frontend_assets/p_image6.png";

const categories = [
  { id: 1, name: "Blue pottery", image: bluePottery },
  { id: 2, name: "Mural Painting", image: mural },
  { id: 3, name: "Pashmina Shawl", image: pashmina },
  { id: 4, name: "Dokra Artifact", image: dokra },
  { id: 5, name: "Jewellery", image: jewellery },
  { id: 6, name: "Nareg Tribal Artifact", image: tribal },
];

const PopularCategory = () => {
  return (
    <section className="bg-[#fcf9e9] py-12 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <h2 className="text-5xl text-serif font-bold text-gray-800 mb-6">
          Popular Category
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

          {categories.map((item, index) => (
            <div key={item.id} className="cursor-pointer group">
              
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className={`w-full h-[200px] object-cover transition-all duration-300 group-hover:scale-105 ${
                  index === 0
                    ? "rounded-tl-[80px] rounded-lg"
                    : index === 2
                    ? "rounded-tr-[80px] rounded-lg"
                    : index === 5
                    ? "rounded-br-[80px] rounded-lg"
                    : "rounded-xl"
                }`}
              />

              {/* Text */}
              <p className="mt-3 text-lg text-center font-serif text-black">
                {item.name}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default PopularCategory;