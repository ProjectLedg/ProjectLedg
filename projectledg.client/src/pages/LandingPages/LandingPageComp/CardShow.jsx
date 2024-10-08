import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

export default function CardShow() {
  const cards = Array(16).fill({});

  const getOpacity = (index) => {
    const col = index % 8; // column index (0-7)
    const row = Math.floor(index / 8); // row index (0-1)
    
    // Calculate the distance from the center (3.5, 0.5) for an 8-column grid
    const centerCol = 3.5; // Center column for 8 columns
    const centerRow = 0.5; // Center row for 2 rows
    const distanceFromCenter = Math.sqrt(Math.pow(col - centerCol, 2) + Math.pow(row - centerRow, 2));

    // Normalize distance to a value between 0 and 1
    const maxDistance = Math.sqrt(Math.pow(centerCol, 2) + Math.pow(centerRow, 2)); // Max distance from the center
    const normalizedDistance = distanceFromCenter / maxDistance;

    // Calculate opacity with a minimum value of 0.5 at the edges
    const minOpacity = 0.2; // Minimum opacity for edges
    const maxOpacity = 1; // Maximum opacity for the center
    return minOpacity + (1 - minOpacity) * (1 - normalizedDistance); // Opacity decreases from max to min
  };

  return (
    <div className="overflow-x-hidden">
      <div className="flex flex-col w-full justify-center items-center my-6">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight first:mt-0">
          Bokföring är svårt
        </h2>
      </div>

      <div className="container mx-auto px-0 sm:px-4">
        <div className="grid grid-cols-8 gap-2 sm:gap-4 -mx-8 sm:-mx-16 md:-mx-24 lg:-mx-32">
          {cards.map((_, index) => (
            <Card
              key={index}
              className={`transition-all duration-300`}
              style={{ opacity: getOpacity(index) }}
            >
              <CardContent className="p-2 sm:p-4 h-24 sm:h-32 flex items-center justify-center">
                <p>Lorem ipsum</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
