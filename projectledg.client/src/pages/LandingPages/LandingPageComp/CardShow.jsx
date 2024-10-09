import React from "react";
import { 
  BadgeDollarSign,
  BookCheck,
  ChartNoAxesCombined,
  ChartLine,
  ClipboardPenLine,
  ReceiptText,
  File,
  HandCoins,
  BookDashed,
  BrainCircuit,
  Coins,
  Calculator
 } from "lucide-react";

import GridItem from "./GridItem.jsx";

const textIconMap = {
  "Vad är debet och kredit?": BadgeDollarSign,
  "Hur skapar jag en balansräkning?": Calculator,
  "Vad är skillnaden mellan intäkter och kostnader?": ChartNoAxesCombined,
  "Hur registrerar jag fakturor korrekt?": BookCheck,
  "Vad innebär moms och hur hanterar jag den?": Coins,
  "Hur ofta ska jag bokföra?": BookDashed,
  "Vad är en resultaträkning och varför behövs den?": File,
  "Vilka kvitton och dokument måste jag spara?": ReceiptText,
  "Hur bokför jag löner och arbetsgivaravgifter?": HandCoins,
  "Vad är ett kontoplan och hur gör jag en?": ChartLine,
  "Hur hanterar jag avskrivningar på tillgångar?": ClipboardPenLine,
  "Vad ska jag tänka på när jag gör min årsredovisning?": BrainCircuit,
};

const texts = Object.keys(textIconMap);

const colors = [
  "bg-green-200",
  "bg-blue-200",
  "bg-red-200",
  "bg-yellow-200",
  "bg-purple-200",
];


export default function CardShow() {
  function getOpacity(x, y) {

    const centerX = 3.5; 
    const centerY = 0.5; 
    const distanceX = Math.abs(x - centerX);
    const distanceY = Math.abs(y - centerY);
    const maxDistance = 3; 
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
                const x = index % 8;
                const y = Math.floor(index / 8);
                const opacity = getOpacity(x, y);

               
               // Randomly select a text
                const text = texts[Math.floor(Math.random() * texts.length)];
                const icon = textIconMap[text]; // Get the corresponding icon
                const bgColor = colors[Math.floor(Math.random() * colors.length)];

                return (
                  <GridItem
                    key={index}
                    opacity={opacity}
                    text={text}
                    icon={icon}
                    bgColor={bgColor}
                  />
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