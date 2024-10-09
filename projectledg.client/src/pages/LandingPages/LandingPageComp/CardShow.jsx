import React, { useState, useEffect } from "react";
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
import EmptyGridItem from "./EmptyGridItem.jsx";

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

const DISPLAY_DURATION = 4000; 

export default function CardShow() {
  const [gridItems, setGridItems] = useState(
    Array(16).fill({ text: "", icon: null, bgColor: "", opacity: 0, timer: 0 })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setGridItems((prevItems) => {
        const newItems = prevItems.map((item) => {
          if (item.timer > 0) {
            return { ...item, timer: item.timer - 500 };
          }
          return { text: "", icon: null, bgColor: "", opacity: 0, timer: 0 };
        });

        const emptyIndexes = newItems
          .map((item, index) => (item.timer === 0 ? index : -1))
          .filter((index) => index !== -1);
        if (emptyIndexes.length > 0) {
          const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
          const text = texts[Math.floor(Math.random() * texts.length)];
          newItems[randomIndex] = {
            text,
            icon: textIconMap[text],
            bgColor: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1,
            timer: DISPLAY_DURATION,
          };
        }

        return newItems;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

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
            {gridItems.map((item, index) =>
              item.text ? (
                <GridItem
                  key={index}
                  opacity={item.opacity}
                  text={item.text}
                  icon={item.icon}
                  bgColor={item.bgColor}
                />
              ) : (
                <EmptyGridItem key={index} />
              )
            )}
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
