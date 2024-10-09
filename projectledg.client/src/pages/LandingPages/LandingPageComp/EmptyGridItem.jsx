import React from "react";

const EmptyGridItem = () => {
  return (
    <div className="relative bg-gray-100 rounded-lg shadow-lg shadow-black/30 aspect-square">
      <div className="flex flex-col justify-around items-center pt-4 h-full">
        <div className="flex flex-col justify-center px-5 py-1 rounded-full">
          {/* Icon Component */}
        </div>
        <div className="paragraf flex flex-col text-xs w-full align-center items-center text-center p-1">
          {/* Text */}
        </div>
      </div>
    </div>
  );
};

export default EmptyGridItem;
