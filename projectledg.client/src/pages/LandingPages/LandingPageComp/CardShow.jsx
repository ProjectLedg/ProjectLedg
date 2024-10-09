import React from "react";
import { BadgeDollarSign } from "lucide-react";
import GridItem from "./GridItem.jsx";

export default function CardShow() {
  function getOpacity(x, y) {
    // Define the center indices
    const centerX = 3.5; // Center column index
    const centerY = 0.5; // Center row index

    // Calculate distance from the center using a simple linear approach
    const distanceX = Math.abs(x - centerX);
    const distanceY = Math.abs(y - centerY);
    
    // Set the maximum opacity distance
    const maxDistance = 3; // Change this value to control how far from center opacity starts to decrease

    // Calculate opacity based on distance, ensuring center squares are fully opaque
    const opacity = distanceX + distanceY > maxDistance ? 0.5 : 1;

    return opacity;
  }

  return (
    <div className="relative w-full overflow-hidden bg-white">
      <div className="flex flex-col w-full justify-center items-center my-6">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight first:mt-0">
          Bokföring är svårt
        </h2>
      </div>
      <div className="flex flex-col relative w-screen min-h-screen items-center">
        <div className="max-w-7xl py-12 flex flex-col justify-center w-screen items-center">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 w-[100vw] md:w-[110VW]">
            {Array(16)
              .fill(null)
              .map((_, index) => {
                const x = index % 8; // Column index
                const y = Math.floor(index / 8); // Row index
                return (
                  <GridItem key={index} opacity={getOpacity(x, y)} />
                );
              })}
          </div>
        </div>
      </div>  
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(255, 255, 255, 0.8) 70%, rgb(255, 255, 255) 100%)",
          top: "100px",
        }}
      />
    </div>
  );
}
