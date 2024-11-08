import * as React from "react"
import { motion } from "framer-motion"




export default function Switch ({isOn, setIsOn}) {

  const toggleSwitch = () => setIsOn(!isOn)

  return (
    <div
      data-isOn={isOn}
      onClick={toggleSwitch}
      className={`flex ${isOn ? "justify-end bg-green-500" : "justify-start  bg-black"}  p-1 w-10 h-6 cursor-pointer  rounded-3xl `}
      style={{
        transition: "background-color 0.3s ease"
      }}>

      <motion.div className="bg-white w-[50%] h-[100%] rounded-full" layout transition={{ type: "spring", stiffness: 700, damping: 30 }} />
    </div>
  )
}
  
