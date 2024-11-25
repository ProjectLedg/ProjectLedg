import React, { useRef } from 'react';
import BookingExample from '/Users/hjalmarstranninge/VSCodeProjects/ProjectLedg/projectledg.client/src/assets/BookingExample.png';
import { motion, useScroll, useTransform } from "framer-motion";
import { TimerReset, ShieldOff, Focus } from 'lucide-react'
import InvoiceCard from './InvoiceCard';

export default function FeatureContentBody() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // Adjusts when the animation starts and ends
  });

  const translateX = useTransform(scrollYProgress, [0, 0.5], [900, -1], {
    type: "spring",
    stiffness: 1,
    damping: 2,
    mass: 1,
  });

  const translateXLeft = useTransform(scrollYProgress, [0, 0.4], [-900, 0]);

  const li1Opacity = useTransform(scrollYProgress, [0.49, 0.59], [0, 1]);
  const li2Opacity = useTransform(scrollYProgress, [0.50, 0.60], [0, 1]);
  const li3Opacity = useTransform(scrollYProgress, [0.51, 0.61], [0, 1]);



  const h1Opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <div className="w-full py-8 px-4 rounded-t-2xl flex flex-row justify-evenly">
      <motion.div ref={ref} className="relative h-full flex" style={{ x: translateXLeft }}>
        <div>
          <img src={BookingExample} alt="Image of booking example window" className="ml-4 w-h-[600px] h-[600px] shadow-md rounded-lg" />
          
        </div>
      </motion.div>

      <motion.div
        className="relative h-full flex"
        style={{
          translateX: translateX,
        }}
      >
        <div className="flex flex-col items-start justify-center h-[50vh] w-[50vw] ">
          <div className="flex flex-row mb-12 w-[60vw] ">
            {/* Apply opacity transform to h1 element */}
            <motion.h1
              className="text-4xl font-medium mr-2"
              style={{ opacity: h1Opacity }}
            >
              Smartare bokföring. 
            </motion.h1>
            <motion.span
              className="text-4xl font-medium text-green-500 "
              style={{ opacity: h1Opacity }}
            >
              Snabbare resultat
            </motion.span>
          </div>
          <ul className="space-y-8 text-md xl-monitor:text-xl">
            <motion.li
              className="text-gray-600 flex flex-row items-center"
              style={{ opacity: li1Opacity }}
            >
              <TimerReset className="h-8 w-8 mr-2 text-green-500" /> 
              <span className="font-semibold text-black ">
                Spara tid:
              </span>
              &nbsp;Ladda upp dina fakturor, låt Ledge sköta resten.
            </motion.li>
            <motion.li
              className="text-gray-600 flex flex-row items-center"
              style={{ opacity: li2Opacity }}
            >
               <ShieldOff className="h-8 w-8 mr-2 text-red-500" />
              <span className="font-semibold text-black">
                Minimera fel:
              </span>
              &nbsp;Noggranna bokföringsförslag som följer regelverket.
            </motion.li>
            <motion.li
              className="text-gray-600 flex flex-row items-center"
              style={{ opacity: li3Opacity }}
            >
              <Focus className="h-8 w-8 mr-2 text-cyan-500" /> 
              <span className="font-semibold text-black">
                Fokus på det viktiga:
              </span>
              &nbsp;Mindre administration, mer tid för din verksamhet.
            </motion.li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
