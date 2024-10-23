import React from "react";
import BookingImage from "@/assets/BookingImageFiles.jpg";

const loremText = "Med vår bokföringsapp blir ekonomihanteringen smidigare än någonsin. Vi gör det enkelt för dig att automatisera bokföringen och snabbt få en överblick över ditt företags ekonomi. Låt oss ta hand om det komplexa, så att du kan fokusera på att utveckla din verksamhet.";


export default function FeatureImage() {
    return (
        <div className="relative w-full flex flex-col items-center overflow-hidden pb-8"> {/* Container with padding-bottom */}
            {/* Content container with text and image */}
            <div className="relative w-full  lg:h-[500px] flex items-center overflow-hidden rounded-2xl shadow-md">
                {/* Text on the left side with 50% width */}
                <div className="absolute left-0 z-10 bg-opacity-75 rounded-full text-left w-1/2"
                    style={{
                        paddingLeft: '4vw',  // 4% of viewport width for smaller screens
                        paddingRight: '4vw', // 4% of viewport width
                    }}
                >
                    <p className="text-green-500 font-semibold" style={{ fontSize: '2vw' }}>
                        {loremText}
                    </p>
                </div>

                {/* Image container */}
                <div className="relative w-full h-full">
                    <img
                        src={BookingImage}
                        alt="Booking Image"
                        className="w-full h-full object-cover rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}

