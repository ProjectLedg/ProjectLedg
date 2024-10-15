import React, { useState, useEffect } from "react";
import GridItem from "./GridItem";

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



const Problems = () => {
  const [text1, setText1] = useState("");
  const [color1, setColor1] = useState("bg-transparent");
  
  const [text2, setText2] = useState("");
  const [color2, setColor2] = useState("bg-transparent");

  const [text3, setText3] = useState("");
  const [color3, setColor3] = useState("bg-transparent");

  const [text4, setText4] = useState("");
  const [color4, setColor4] = useState("bg-transparent");

  const [text5, setText5] = useState("");
  const [color5, setColor5] = useState("bg-transparent");

  const [text6, setText6] = useState("");
  const [color6, setColor6] = useState("bg-transparent");

  const [text7, setText7] = useState("");
  const [color7, setColor7] = useState("bg-transparent");

  const [text8, setText8] = useState("");
  const [color8, setColor8] = useState("bg-transparent");

  const [text9, setText9] = useState("");
  const [color9, setColor9] = useState("bg-transparent");

  const [text10, setText10] = useState("");
  const [color10, setColor10] = useState("bg-transparent");

  const [text11, setText11] = useState("");
  const [color11, setColor11] = useState("bg-transparent");

  const [text12, setText12] = useState("");
  const [color12, setColor12] = useState("bg-transparent");

  const [text13, setText13] = useState("");
  const [color13, setColor13] = useState("bg-transparent");

  const [text14, setText14] = useState("");
  const [color14, setColor14] = useState("bg-transparent");

  const [text15, setText15] = useState("");
  const [color15, setColor15] = useState("bg-transparent");

  const [text16, setText16] = useState("");
  const [color16, setColor16] = useState("bg-transparent");


  useEffect(() => {

    const updateTextAndColor = (setText, setColor) => {
      setText("");
      setColor("bg-transparent");

      setTimeout(() => {
        setText(texts[Math.floor(Math.random() * texts.length)]);
        setColor(colors[Math.floor(Math.random() * colors.length)]);
        setIcon(textIconMap[randomText]);
      }, 1000);
    };

    const intervals = [];
    const baseDuration = 4000;

    const offsets = [
      410.2, 1204.1, 2413.5, 1802.9, 907.1, 1526.2, 2989.6, 1707.1,
      601.4, 1402.3, 150.8, 1611.4, 2002.3, 1105.6, 2702.3, 802.23
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
                icon={textIconMap[text9]}
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
