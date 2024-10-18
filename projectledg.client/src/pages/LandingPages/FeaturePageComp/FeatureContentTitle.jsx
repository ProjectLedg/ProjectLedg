import React, { useEffect } from "react";

export default function FeatureContentTitle() {
    useEffect(() => {
        // Optional: Trigger any side effects when the component loads
    }, []);

    // Custom keyframes for the fade-down and fade-left animations
    const keyframes = `
      @keyframes fade-in-down {
        0% {
          opacity: 0;
          transform: translateY(-20px);
        }
        100% {
          opacity: 4;
          transform: translateY(0);
        }
      }

      @keyframes fade-in-left {
        0% {
          opacity: 0;
          transform: translateX(-20px);
        }
        100% {
          opacity: 8;
          transform: translateX(0);
        }
      }
    `;

    // Helper function to split text into individual letters
    const splitText = (text) => {
        return text.split("").map((char, index) => (
            <span
                key={index}
                className="inline-block opacity-0"
                style={{
                    animation: `fade-in-left 0.6s ease-in-out forwards`,
                    animationDelay: `${index * 0.04}s`,
                }}
            >
                {char === " " ? "\u00A0" : char}
            </span>
        ));
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-[3vw]" style={{ height: '45vw' }}>
            {/* Inject custom keyframes */}
            <style>{keyframes}</style>

            {/* Element 1 - Whole element fades in down, letters fade in left */}
            <h1
                className="opacity-0 font-medium text-center text-gray-700"
                style={{
                    animation: "fade-in-down 2s ease-in-out 0.5s forwards",
                    fontSize: '3vw',
                }}
            >
                {splitText("Välkommen till Ledg, vi gör bokföring")}{" "}
                <span className="text-green-500">{splitText("ENKELT")}</span>!
                <br />
                <span className="text-green-500">{splitText("SNABBT")}</span>!
                <span>{splitText(" och")}</span> <span className="text-green-500">{splitText("EFFEKTIVT")}</span>!{" "}
                {splitText(" utan revisorer.")}
            </h1>

            {/* Element 2 */}
            <p
                className="brödtext opacity-0  text-center text-gray-600"
                style={{
                    animation: "fade-in-down 2.5s ease-in-out 0.8s forwards",
                    fontSize: '2vw',
                }}
            >
                {splitText("bättre än Visma")}
                <br />
                {splitText("bättre än Fortnox")}
            </p>

        </div>
    );
}
