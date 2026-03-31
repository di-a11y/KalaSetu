import React from "react";
import bluePottery from "../assets/frontend_assets/bluePottery.png";
import madhubani from "../assets/frontend_assets/madhubani.png";
import dokra from "../assets/frontend_assets/dokra.png";
//import { Play } from "lucide-react";

const LatestStories = () => {
    return (
        <section className="bg-[#fcf9e9] py-15 px-6 sm:px-12">
            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <h2 className="text-5xl text-serif font-bold mb-10">Latest Stories</h2>

                {/* Cards Container */}
                <div className="relative w-full h-[400px] flex justify-center items-center">

                    {/* LEFT CARD */}
                    <div className="absolute left-[18%] bottom-0 rotate-[-3deg]">
                        <StoryCard image={madhubani} title="Madhubani Art" />
                    </div>

                    {/* CENTER CARD */}
                    <div className="absolute z-10">
                        <StoryCard
                            image={bluePottery}
                            title="Jaipur Blue Pottery"
                            isCenter
                        />
                    </div>

                    {/* RIGHT CARD */}
                    <div className="absolute right-[18%] bottom-0 rotate-[3deg]">
                        <StoryCard image={dokra} title="Dokra Artifacts" />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default LatestStories;



const StoryCard = ({ image, title, isCenter }) => {
    return (
        <div
            className={`relative ${isCenter ? "w-[380px] h-[260px]" : "w-[350px] h-[250px]"
                } rounded-2xl overflow-hidden shadow-xl hover:scale-105 transition duration-300`}
        >

            {/* Image */}
            <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
            />

            {/* Gradient Overlay (better than plain black) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

            {/* Play Button */}
            {/*            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-blue-500 p-3 rounded-full cursor-pointer hover:scale-110 transition">
                    <Play size={20} className="text-white" />
                </div>
            </div>
 */}

            {/* Title */}
            <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-lg">{title}</h3>
            </div>
        </div>
    );
};