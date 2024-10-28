import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FeatureContentTitle() {
    const navigate = useNavigate();
    useEffect(() => {
        // Optional: Trigger any side effects when the component loads
    }, []);

    // Custom keyframes for the fade-down and fade-left animations
    const keyframes = `
      @keyframes fade-in-down {
        0% {
          opacity: 0;
          transform: translateY(-20px);
        }
        100% {
          opacity: 4;
          transform: translateY(0);
        }
      }

      @keyframes fade-in-left {
        0% {
          opacity: 0;
          transform: translateX(-20px);
        }
        100% {
          opacity: 8;
          transform: translateX(0);
        }
      }
    `;

    // Helper function to split text into individual letters
    const splitText = (text) => {
        return text.split("").map((char, index) => (
            <span
                key={index}
                className="inline-block opacity-0"
                style={{
                    animation: `fade-in-left 0.6s ease-in-out forwards`,
                    animationDelay: `${index * 0.04}s`,
                }}
            >
                {char === " " ? "\u00A0" : char}
            </span>
        ));
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-[2vw]" style={{ height: '45vw' }}>
            {/* Inject custom keyframes */}
            <style>{keyframes}</style>

            {/* Element 1 - Whole element fades in down, letters fade in left */}
            <h1
                className="opacity-0 font-medium text-center text-gray-700"
                style={{
                    animation: "fade-in-down 2s ease-in-out 0.5s forwards",
                    fontSize: '3vw',
                }}
            >
                {splitText("Välkommen till ")}
                <span className="text-green-500">{splitText("Ledge")}</span>{" "}
                {splitText("vi gör bokföring")}{" "}
                <span className="text-green-500">{splitText("ENKELT!")}</span>
                <br />
                <span className="text-green-500">{splitText("SNABBT!")}</span>{" "}
                <span>{splitText("och")}</span> <span className="text-green-500">{splitText("EFFEKTIVT!")}</span>{" "}
                {splitText("utan revisorer.")}
            </h1>

            {/* Element 2 */}
            <p
                className="brödtext opacity-0  text-center text-gray-600"
                style={{
                    animation: "fade-in-down 2.5s ease-in-out 0.8s forwards",
                    fontSize: '2vw',
                }}
            >
                {splitText("Vi gör bokföring enklare för småföretag")}

            </p>
            <div className="flex justify-center px-2 sm:px-4 lg:px-6">
                <div className="w-full sm:w-auto">
                    <button
                        className="group relative bg-black inline-flex items-center justify-center 
                        overflow-hidden w-full sm:w-40 md:w-48 lg:w-52 xl:w-60 text-xs sm:text-base md:text-lg 
                        lg:text-xl font-medium text-slate-100 transition-colors duration-700 ease-out hover:text-green-500 
                        focus:outline-none focus:ring active:bg-green-800 active:text-white rounded-full py-1 px-2 sm:py-3 
                        sm:px-6"
                        onClick={() => navigate("/signup")}
                    >
                        <span className="absolute inset-0 rounded-full border-2 border-transparent transition-all duration-700 ease-out group-hover:border-green-500"></span>
                        <span className="absolute left-0 top-0 h-[2px] w-0 bg-green-500 transition-all duration-700 ease-out group-hover:w-full"></span>
                        <span className="absolute right-0 top-0 h-0 w-[2px] bg-green-500 transition-all duration-700 ease-out group-hover:h-full"></span>
                        <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-green-500 transition-all duration-700 ease-out group-hover:w-full"></span>
                        <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-green-500 transition-all duration-700 ease-out group-hover:h-full"></span>
                        <span className="relative z-10 whitespace-nowrap">Börja din resa här</span>
                    </button>
                </div>
            </div>


        </div>
    );
}
