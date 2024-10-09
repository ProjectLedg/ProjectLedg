import React from 'react'

export default function CardShow() {
  function getOpacity(x, y) {
    const centerX = 3.5;
    const centerY = 0.5;
    const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    return 0.5 + 0.5 * (distance / maxDistance);
  }

  return (
    <div className="relative w-full overflow-hidden bg-white">
      <div className="flex flex-col w-full justify-center items-center my-6">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight first:mt-0">
          Bokföring är svårt
        </h2>
      </div>
      <div className="flex flex-col relative w-screen min-h-screen items-center">
        <div className=" max-w-7xl py-12 flex flex-col justify-center w-screen items-center">
          <div className="  grid grid-cols-4 md:grid-cols-8 gap-4  w-[100vw] md:w-[110VW] ">
            {Array(16).fill(null).map((_, index) => (
              <div
                key={index}
                className="relative  bg-gray-100 rounded-lg shadow-lg shadow-black/30 aspect-square transform hover:scale-105 transition-transform duration-200 ease-in-out"
                style={{
                  opacity: getOpacity(index % 8, Math.floor(index / 8)),
                }}
              >
              </div>
            ))}
          </div>
        </div>
      </div>
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          background: 'radial-gradient(circle at center, transparent 0%, rgba(255, 255, 255, 0.8) 70%, rgb(255, 255, 255) 100%)',
          top: '100px'
        }} 
      />
    </div>
  );
}