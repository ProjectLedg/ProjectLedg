import React, { useEffect } from "react";

export default function FeatureContent() {
    useEffect(() => {
        // Optional: If you want to trigger any side effects when the component loads
    }, []);

    // Custom keyframes for the fade-down animation
    const keyframes = `
      @keyframes fade-in-down {
        0% {
          opacity: 0;
          transform: translateY(-20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;

    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-6">
            {/* Inject custom keyframes */}
            <style>{keyframes}</style>

            {/* Element 1 */}
            <h1
                className="opacity-0 text-4xl font-extrabold text-center text-black"
                style={{
                    animation: "fade-in-down 1.2s ease-in-out 0.3s forwards",
                }}
            >
                Jonzy rules!!
                <br />
                hes just awesome
            </h1>

            {/* Element 2 */}
            <p
                className="opacity-0 text-lg text-center text-black"
                style={{
                    animation: "fade-in-down 1.2s ease-in-out 0.5s forwards",
                }}
            >
                fucking awesome
                <br />
                just seriosly awesome
            </p>

            {/* Element 3 */}
            <div
                className="opacity-0 flex items-center"
                style={{
                    animation: "fade-in-down 1.2s ease-in-out 0.7s forwards",
                }}
            >
                {/* Add more content here, e.g. buttons or images */}
            </div>
        </div>
    );
}
