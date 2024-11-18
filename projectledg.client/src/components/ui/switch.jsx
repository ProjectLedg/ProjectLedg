import * as React from "react";
import { motion } from "framer-motion";

export default function Switch({ isOn, setIsOn, onColor = "bg-green-500", offColor = "bg-red-500", knobColor = "bg-white" }) {
  const toggleSwitch = () => setIsOn(!isOn);

  return (
    <div
      onClick={toggleSwitch}
      className={`flex ${isOn ? `justify-end ${onColor}` : `justify-start ${offColor}`} p-1 w-10 h-6 cursor-pointer rounded-3xl`}
      style={{
        transition: "background-color 0.3s ease",
      }}
    >
      <motion.div
        className={`${knobColor} w-[50%] h-[100%] rounded-full`}
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      />
    </div>
  );
}
