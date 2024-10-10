import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

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
  Calculator,
} from "lucide-react";

import GridItem from "./GridItem";
import EmptyGridItem from "./EmptyGridItem";

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

const DISPLAY_DURATION = 5000;

export default function CardShow() {
  // State for each of the 16 divs
  const [gridItem1, setGridItem1] = useState(null);
  const [gridItem2, setGridItem2] = useState(null);
  const [gridItem3, setGridItem3] = useState(null);
  const [gridItem4, setGridItem4] = useState(null);
  const [gridItem5, setGridItem5] = useState(null);
  const [gridItem6, setGridItem6] = useState(null);
  const [gridItem7, setGridItem7] = useState(null);
  const [gridItem8, setGridItem8] = useState(null);
  const [gridItem9, setGridItem9] = useState(null);
  const [gridItem10, setGridItem10] = useState(null);
  const [gridItem11, setGridItem11] = useState(null);
  const [gridItem12, setGridItem12] = useState(null);
  const [gridItem13, setGridItem13] = useState(null);
  const [gridItem14, setGridItem14] = useState(null);
  const [gridItem15, setGridItem15] = useState(null);
  const [gridItem16, setGridItem16] = useState(null);

  // Function to get random text, icon, and color
  const getRandomTextAndColor = () => {
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    const Icon = textIconMap[randomText];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return { randomText, Icon, randomColor };
  };

  // Effect for updating grid items
  useEffect(() => {
    const intervals = [
      setInterval(() => setGridItem1(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem2(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem3(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem4(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem5(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem6(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem7(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem8(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem9(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem10(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem11(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem12(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem13(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem14(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem15(getRandomTextAndColor()), DISPLAY_DURATION),
      setInterval(() => setGridItem16(getRandomTextAndColor()), DISPLAY_DURATION),
    ];

    // Cleanup intervals on component unmount
    return () => {
      intervals.forEach(clearInterval);
    };
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
          <div className="grid grid-cols-2 md:grid-cols-8 gap-4 w-[100vw] md:w-[110vw]">
           
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
