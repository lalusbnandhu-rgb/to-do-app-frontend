"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./Themetoggle.module.css";


export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className= {styles.btnPrimary}
    >
      {theme === "light" ? (
        <Moon />
      ) : (
        <Sun className="w-2 h-1" />
      )}
    </button>
  );
}
