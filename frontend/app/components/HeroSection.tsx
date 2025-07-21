import { Search } from "lucide-react";
import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <div className="min-h-screen dark:text-white text-black">
      {/* Hero Content */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-12 lg:px-12 lg:py-20">
        {/* Left Side - Image */}
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 flex justify-center">
          <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] rounded-full flex items-center justify-center hero-animation">
            <Image
              src={require("../assets/wissen_pic1.png")}
              alt="Learning Illustration"
              className="w-4/5 h-4/5 object-contain rounded-full"
              width={400}
              height={400}
            />
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full lg:w-1/2 lg:pl-12">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Improve Your Online{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Learning Experience
              </span>{" "}
              Better Instantly
            </h1>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              We have 40k+ Online courses & 500K+ Online registered students.
              Find your desired Courses from them.
            </p>

            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search Courses..."
                  className="flex-1 px-6 py-4 bg-slate-800 border border-slate-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-gray-400"
                />
                <button className="px-6 py-4 bg-cyan-500 hover:bg-cyan-600 rounded-r-lg transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-red-400 rounded-full border-2 border-slate-900"></div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full border-2 border-slate-900"></div>
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-400 rounded-full border-2 border-slate-900"></div>
              </div>
              <div className="text-gray-300">
                <span className="text-white font-semibold">500K+</span> People
                already trusted us.{" "}
                <span className="text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors">
                  View Courses
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
