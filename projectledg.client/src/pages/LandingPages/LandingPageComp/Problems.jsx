import React, { useState, useEffect } from "react";
import GridItem from "./GridItem";
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

const DISPLAY_DURATION = 3000;

const Problems = () => {
  const [text1, setText1] = useState("");
  const [color1, setColor1] = useState("bg-green-200");
  const [icon1, setIcon1] = useState(null);
  const [text2, setText2] = useState("");
  const [color2, setColor2] = useState("bg-green-200");
  const [icon2, setIcon2] = useState(null);
  const [text3, setText3] = useState("");
  const [color3, setColor3] = useState("bg-green-200");
  const [icon3, setIcon3] = useState(null);
  const [text4, setText4] = useState("");
  const [color4, setColor4] = useState("bg-green-200");
  const [icon4, setIcon4] = useState(null);
  const [text5, setText5] = useState("");
  const [color5, setColor5] = useState("bg-green-200");
  const [icon5, setIcon5] = useState(null);
  const [text6, setText6] = useState("");
  const [color6, setColor6] = useState("bg-green-200");
  const [icon6, setIcon6] = useState(null);
  const [text7, setText7] = useState("");
  const [color7, setColor7] = useState("bg-green-200");
  const [icon7, setIcon7] = useState(null);
  const [text8, setText8] = useState("");
  const [color8, setColor8] = useState("bg-green-200");
  const [icon8, setIcon8] = useState(null);
  const [text9, setText9] = useState("");
  const [color9, setColor9] = useState("bg-green-200");
  const [icon9, setIcon9] = useState(null);
  const [text10, setText10] = useState("");
  const [color10, setColor10] = useState("bg-green-200");
  const [icon10, setIcon10] = useState(null);
  const [text11, setText11] = useState("");
  const [color11, setColor11] = useState("bg-green-200");
  const [icon11, setIcon11] = useState(null);
  const [text12, setText12] = useState("");
  const [color12, setColor12] = useState("bg-green-200");
  const [icon12, setIcon12] = useState(null);
  const [text13, setText13] = useState("");
  const [color13, setColor13] = useState("bg-green-200");
  const [icon13, setIcon13] = useState(null);
  const [text14, setText14] = useState("");
  const [color14, setColor14] = useState("bg-green-200");
  const [icon14, setIcon14] = useState(null);
  const [text15, setText15] = useState("");
  const [color15, setColor15] = useState("bg-green-200");
  const [icon15, setIcon15] = useState(null);
  const [text16, setText16] = useState("");
  const [color16, setColor16] = useState("bg-green-200");
  const [icon16, setIcon16] = useState(null);


  useEffect(() => {
    const updateTextAndColor = (setText, setColor) => {
      setText(""); // Clear text for 1-second downtime
      setColor("bg-transparent"); // Set to transparent or another "hidden" color

      setTimeout(() => {
        // After 1 second, set a new text and color
        setText(texts[Math.floor(Math.random() * texts.length)]);
        setColor(colors[Math.floor(Math.random() * colors.length)]);
        setIcon(textIconMap[randomText]);
      }, 1000); // 1-second delay
    };

    const intervals = [];
    const baseDuration = DISPLAY_DURATION;

    // Define static offsets that are random and don't follow a sequence
    const offsets = [
      400, 1200, 2400, 1800, 900, 1500, 2300, 1700,
      600, 1400, 150, 1600, 2000, 1100, 2700, 800
    ];

    intervals.push(setInterval(() => updateTextAndColor(setText1, setColor1), baseDuration + offsets[0]));
    intervals.push(setInterval(() => updateTextAndColor(setText2, setColor2), baseDuration + offsets[1]));
    intervals.push(setInterval(() => updateTextAndColor(setText3, setColor3), baseDuration + offsets[2]));
    intervals.push(setInterval(() => updateTextAndColor(setText4, setColor4), baseDuration + offsets[3]));
    intervals.push(setInterval(() => updateTextAndColor(setText5, setColor5), baseDuration + offsets[4]));
    intervals.push(setInterval(() => updateTextAndColor(setText6, setColor6), baseDuration + offsets[5]));
    intervals.push(setInterval(() => updateTextAndColor(setText7, setColor7), baseDuration + offsets[6]));
    intervals.push(setInterval(() => updateTextAndColor(setText8, setColor8), baseDuration + offsets[7]));
    intervals.push(setInterval(() => updateTextAndColor(setText9, setColor9), baseDuration + offsets[8]));
    intervals.push(setInterval(() => updateTextAndColor(setText10, setColor10), baseDuration + offsets[9]));
    intervals.push(setInterval(() => updateTextAndColor(setText11, setColor11), baseDuration + offsets[10]));
    intervals.push(setInterval(() => updateTextAndColor(setText12, setColor12), baseDuration + offsets[11]));
    intervals.push(setInterval(() => updateTextAndColor(setText13, setColor13), baseDuration + offsets[12]));
    intervals.push(setInterval(() => updateTextAndColor(setText14, setColor14), baseDuration + offsets[13]));
    intervals.push(setInterval(() => updateTextAndColor(setText15, setColor15), baseDuration + offsets[14]));
    intervals.push(setInterval(() => updateTextAndColor(setText16, setColor16), baseDuration + offsets[15]));

    // Cleanup
    return () => intervals.forEach(clearInterval);
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
            <div>
              <GridItem
                color={color1}
                text={text1}
                icon={textIconMap[text1]}
              />
            </div>
            <div>
              <GridItem
                color={color2}
                text={text2}
                icon={textIconMap[text2]}
              />
            </div>
            <div>
              <GridItem
                color={color3}
                text={text3}
                icon={textIconMap[text3]}
              />
            </div>
            <div>
              <GridItem
                color={color4}
                text={text4}
                icon={textIconMap[text4]}
              />
            </div>
            <div>
              <GridItem
                color={color5}
                text={text5}
                icon={textIconMap[text5]}
              />
            </div>
            <div>
              <GridItem
                color={color6}
                text={text6}
                icon={textIconMap[text6]}
              />
            </div>
            <div>
              <GridItem
                color={color7}
                text={text7}
                icon={textIconMap[text7]}
              />
            </div>
            <div>
              <GridItem
                color={color8}
                text={text8}
                icon={textIconMap[text8]}
              />
            </div>
            <div>
              <GridItem
                color={color9}
                text={text9}
                icon={ textIconMap[text9]}
              />
            </div>
            <div>
              <GridItem
                color={color10}
                text={text10}
                icon={textIconMap[text10]}
              />
            </div>
            <div>
              <GridItem
                color={color11}
                text={text11}
                icon={textIconMap[text11]}
              />
            </div>
            <div>
              <GridItem
                color={color12}
                text={text12}
                icon={textIconMap[text12]}
              />
            </div>
            <div>
              <GridItem
                color={color13}
                text={text13}
                icon={textIconMap[text13]}
              />
            </div>
            <div>
              <GridItem
                color={color14}
                text={text14}
                icon={textIconMap[text14]}
              />
            </div>
            <div>
              <GridItem
                color={color15}
                text={text15}
                icon={textIconMap[text15]}
              />
            </div>
            <div>
              <GridItem
                color={color16}
                text={text16}
                icon={textIconMap[text16]}
              />
            </div>
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
};

export default Problems;
