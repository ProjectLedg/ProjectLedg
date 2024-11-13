import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"
import { useEffect } from "react";


const drawCircle = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => {
        const delay = 1 + i * 0.5;
        return {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay, type: "spring", duration: 1.6, bounce: 0 },
                opacity: { delay, duration: 0.01 }
            }
        };
    }
};

const drawLine = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => {
        const delay = 1 + i * 0.7;
        return {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay, type: "spring", duration: 0.6, bounce: 0 },
                opacity: { delay, duration: 0.01 }
            }
        };
    }
};





export default function SuccessAnimation({ setIsModalOpen, triggerSound, resetModalFields }) {

    useEffect(() => {

        if (triggerSound) {
            const audio = new Audio(`/ledge-success-chime.mp3`)
            audio.play();
        }

    }, [triggerSound])


    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetModalFields()
    };

    return (
        <div className="h-full flex flex-col items-center justify-center px-4 md:px-8">
            <motion.svg
                className="w-full h-auto max-w-[80vw] max-h-[80vw] md:max-w-[50vh] md:max-h-[50vh]"
                // width="50vh"
                // height="50vh"
                viewBox="0 0 600 600"
                initial="hidden"
                animate="visible"
            >
                <motion.circle
                    cx="300"
                    cy="300"
                    r={window.innerWidth < 768 ? 150 : 200}
                    stroke="green"
                    variants={drawCircle}
                    style={{
                        strokeWidth: "15px",
                        strokeLinecap: "round",
                        fill: "transparent"
                    }}
                    custom={1}
                />

                <motion.line
                    x1="200"
                    y1="300"
                    x2="270"
                    y2="370"
                    stroke="green"
                    variants={drawLine}
                    custom={2}
                    style={{
                        strokeWidth: "18px",
                        strokeLinecap: "round",
                        fill: "transparent"
                    }}
                />

                <motion.line
                    x1="270"
                    y1="370"
                    x2="400"
                    y2="200"
                    stroke="green"
                    variants={drawLine}
                    custom={2.5}
                    style={{
                        strokeWidth: "18px",
                        strokeLinecap: "round",
                        fill: "transparent"
                    }}
                />
            </motion.svg>

            <motion.h1
                className="text-lg sm:text-2xl md:text-4xl font-bold mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
            >
                Faktura bokförd!
            </motion.h1>

            <motion.div className="mt-14"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
            >
                <Button
                    className="w-36 md:w-48 text-sm md:text-lg bg-green-500 hover:bg-green-700 mx-auto"
                    onClick={handleCloseModal}
                >
                    Stäng
                </Button>
            </motion.div>
        </div>
    );
}
