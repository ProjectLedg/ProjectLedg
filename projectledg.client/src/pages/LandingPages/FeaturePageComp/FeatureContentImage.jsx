import React, { useEffect, useState } from "react";
import ChatWindowDemo from "../FeaturePageComp/ChatWindowDemo";
import { motion, useScroll, useTransform } from "framer-motion";
import { Gauge, ChartColumnIncreasing, BotMessageSquare } from "lucide-react";

export default function FeatureImage() {
    const { scrollYProgress } = useScroll();
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        const unsubscribe = scrollYProgress.onChange((progress) => {
            if (progress > 0.36 && !isLocked) {
                console.log("lock")
                document.body.style.overflow = "hidden";

            } else if (progress <= 0.36 && isLocked) {
                console.log("unlock")
                document.body.style.overflow = "auto";

            }
        });

        return () => {
            unsubscribe();
            document.body.style.overflow = "auto";
        };
    }, [isLocked]);

    const translateX = useTransform(scrollYProgress, [0, 0.4], [600, -1], {
        type: "spring",
        stiffness: 100,
        damping: 2,
        mass: 1,
    });

    const translateXLeft = useTransform(scrollYProgress, [0, 0.4], [-300, 0], {
        type: "spring",
        stiffness: 100,
        damping: 25,
        mass: 1,
    });

    const li1Opacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
    const li2Opacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
    const li3Opacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1]);

    return (
        <div
            className={`w-[100vw] flex flex-row items-center overflow-hidden pb-8 ${isLocked ? "bg-red-5§" : "relative"}`}
        >
            {/* Content container with text and image */}
            <div className="relative w-full flex items-center justify-between overflow-hidden rounded-2xl">
                {/* Left section */}
                <motion.div
                    className="relative h-full flex"
                    style={{
                        translateX: translateXLeft,
                    }}
                >
                    <div className="flex flex-col items-start justify-start h-[50vh] w-[60vw] ml-12">
                        <div className="flex flex-row mb-12">
                            <h1 className="text-5xl font-medium mr-4">Digital </h1>
                            <span className="text-5xl font-medium text-green-500">
                                bokföringsassistent
                            </span>
                        </div>
                        <ul className="space-y-8 text-xl">
                            <motion.li
                                className="text-gray-500 flex flex-row items-center"
                                style={{ opacity: li1Opacity }}
                            >
                                <Gauge className="h-8 w-8 mr-2 text-red-500" />
                                <span className="font-semibold text-black">
                                    Snabba svar på dina frågor:
                                </span>
                                &nbsp;Få klara och tydliga svar om företagets ekonomi och
                                bokföring.
                            </motion.li>
                            <motion.li
                                className="text-gray-500 flex flex-row items-center"
                                style={{ opacity: li2Opacity }}
                            >
                                <ChartColumnIncreasing className="h-8 w-8 mr-2 text-cyan-500" />
                                <span className="font-semibold text-black">
                                    Automatiserade analyser:
                                </span>
                                &nbsp;Vår AI hjälper dig att förstå siffrorna och identifiera
                                viktiga insikter.
                            </motion.li>
                            <motion.li
                                className="text-gray-500 flex flex-row items-center"
                                style={{ opacity: li3Opacity }}
                            >
                                <BotMessageSquare className="h-8 w-8 mr-2 text-green-500" />
                                <span className="font-semibold text-black">
                                    Smidig integration:
                                </span>
                                &nbsp;Diskutera direkt i vårt chattverktyg för snabbare beslut
                                och bättre överblick.
                            </motion.li>
                        </ul>
                    </div>
                </motion.div>

                {/* Right section */}
                <motion.div
                    className="relative h-full flex"
                    style={{
                        translateX,
                    }}
                >
                    <ChatWindowDemo />
                </motion.div>
            </div>
        </div>
    );
}
