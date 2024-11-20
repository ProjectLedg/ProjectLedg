import React, { useEffect, useState } from "react";
import ChatWindowDemo from "../FeaturePageComp/ChatWindowDemo";
import { motion, useScroll, useTransform } from "framer-motion";
import { Gauge, ChartColumnIncreasing, BotMessageSquare } from "lucide-react";

export default function FeatureImage() {
    const { scrollYProgress } = useScroll();
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        const unsubscribe = scrollYProgress.onChange((progress) => {
            if (progress > 0.275 && progress < 1) {
                console.log("lock")
                setIsLocked(true);
            } else {
                console.log("unlock")
                setIsLocked(false);
            }
        });

        // Cleanup subscription when the component unmounts
        return () => unsubscribe();
    }, [scrollYProgress]);

    const translateX = useTransform(scrollYProgress, [0, 0.2], [600, -1], {
        type: "spring",
        stiffness: 1,
        damping: 2,
        mass: 1,
    });

    const translateXLeft = useTransform(scrollYProgress, [0, 0.2], [-1000, 0], {
        type: "spring",
        stiffness: 1,
        damping: 25,
        mass: 1,
    });

    const li1Opacity = useTransform(scrollYProgress, [0.3, 0.4], [0, 1]);
    const li2Opacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
    const li3Opacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);

    // Add opacity for the h1 element
    const h1Opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

    return (
        <div className={`w-full flex items-center mb-12 justify-between overflow-hidden rounded-2xl ${isLocked ? "sticky top-28" : "relative"}`}>
            {/* Left section */}
            <motion.div
                className="relative h-full flex"
                style={{
                    translateX: translateXLeft,
                }}
            >
                <div className="flex flex-col items-center justify-center h-[50vh] w-[60vw] ml-12">
                    <div className="flex flex-row mb-12">
                        {/* Apply opacity transform to h1 element */}
                        <motion.h1
                            className="text-5xl font-medium mr-4"
                            style={{ opacity: h1Opacity }}
                        >
                            Din digitala
                        </motion.h1>
                        <motion.span
                            className="text-5xl font-medium text-green-500"
                            style={{ opacity: h1Opacity }}
                        >
                            bokföringsassistent
                        </motion.span>
                    </div>
                    <ul className="space-y-8 text-xl">
                        <motion.li
                            className="text-gray-600 flex flex-row items-center"
                            style={{ opacity: li1Opacity }}
                        >
                            <Gauge className="h-8 w-8 mr-2 text-red-500" />
                            <span className="font-semibold text-black">
                                Snabba svar på dina frågor:
                            </span>
                            &nbsp;Få klara och tydliga svar om företagets ekonomi och bokföring.
                        </motion.li>
                        <motion.li
                            className="text-gray-600 flex flex-row items-center"
                            style={{ opacity: li2Opacity }}
                        >
                            <ChartColumnIncreasing className="h-8 w-8 mr-2 text-cyan-500" />
                            <span className="font-semibold text-black">
                                Automatiserade analyser:
                            </span>
                            &nbsp;Vår AI hjälper dig att förstå siffrorna och identifiera viktiga insikter.
                        </motion.li>
                        <motion.li
                            className="text-gray-600 flex flex-row items-center"
                            style={{ opacity: li3Opacity }}
                        >
                            <BotMessageSquare className="h-8 w-8 mr-2 text-green-500" />
                            <span className="font-semibold text-black">
                                Smidig integration:
                            </span>
                            &nbsp;Diskutera direkt i vårt chattverktyg för snabbare beslut och bättre överblick.
                        </motion.li>
                    </ul>
                </div>
            </motion.div>

            {/* Right section */}
            <motion.div
                className={`relative h-full flex`}
                style={{
                    translateX,
                }}
            >
                <div className="">
                    <ChatWindowDemo />
                </div>
            </motion.div>
        </div>
    );
}
