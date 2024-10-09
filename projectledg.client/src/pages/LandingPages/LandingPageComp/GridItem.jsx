import React from "react";
import { BadgeDollarSign } from "lucide-react";

const GridItem = ({ opacity }) => {
  return (
    <div
      className="relative bg-gray-100 rounded-lg shadow-lg shadow-black/30 aspect-square"
      style={{ opacity }}
    >
      <div className="flex flex-col justify-around items-center pt-4 h-full">
        <div className="flex flex-col justify-center px-5 py-1 rounded-full bg-green-300">
          <BadgeDollarSign color="black" size={36} />
        </div>
        <div className="paragraf flex flex-col w-full align-center items-center text-center">
          Jag hatar att bokföra!!!
        </div>
      </div>
    </div>
  );
};

export default GridItem;