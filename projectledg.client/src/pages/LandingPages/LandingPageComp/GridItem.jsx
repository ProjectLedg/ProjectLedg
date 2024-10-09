import React from "react";

const GridItem = ({ opacity, text, icon: Icon, bgColor }) => {
  return (
    <div
      className="relative bg-white rounded-lg shadow-lg shadow-black/30 aspect-square"
      style={{ opacity }}
    >
      <div className="flex flex-col justify-around items-center pt-4 h-full">
        <div className={`flex flex-col justify-center px-5 py-1 rounded-full ${bgColor}`}>
          <Icon color="black" size={36} />
        </div>
        <div className="paragraf flex flex-col text-xs w-full align-center items-center text-center p-1">
          {text}
        </div>
      </div>
    </div>
  );
};

export default GridItem;
