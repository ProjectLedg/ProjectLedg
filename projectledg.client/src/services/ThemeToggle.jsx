import React from "react";
import { useTheme } from "@/components/ThemeProvider";
import Switch from "@/components/ui/switch"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Hantera växlingen mellan dark och light mode
  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Switch isOn={theme === "dark"} setIsOn={handleToggle} offColor="bg-darkBackground" onColor="bg-white" knobColor="dark:bg-darkBackground bg-white"/>
  );
}
