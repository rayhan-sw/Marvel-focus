"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

interface CurtainProps {
  isClosed: boolean;
  onAnimationComplete?: () => void;
}

const Curtain: React.FC<CurtainProps> = ({ isClosed, onAnimationComplete }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Preload heavy assets globally
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };
    preloadImage("/deadpool3.png");
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] pointer-events-none flex transition-[visibility] duration-0 ${
        isClosed ? "visible delay-0" : "invisible delay-1000"
      }`}
    >
      {/* Left Curtain */}
      <motion.div
        initial={{ x: isClosed ? "0%" : "-100%" }}
        animate={{ x: isClosed ? "0%" : "-100%" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="w-1/2 h-full bg-[#800000] relative shadow-[10px_0_50px_rgba(0,0,0,0.5)] z-10"
      >
        {/* Subtle gradient for volume - cleaner look */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10" />
      </motion.div>

      {/* Right Curtain */}
      <motion.div
        initial={{ x: isClosed ? "0%" : "100%" }}
        animate={{ x: isClosed ? "0%" : "100%" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => {
          if (isClosed && onAnimationComplete) onAnimationComplete();
        }}
        className="w-1/2 h-full bg-[#800000] relative shadow-[-10px_0_50px_rgba(0,0,0,0.5)] z-10"
      >
        {/* Subtle gradient for volume - cleaner look */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-black/10" />
      </motion.div>

      {/* Center Badge/Logo when closed */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isClosed ? 1 : 0, scale: isClosed ? 1 : 0.9 }}
        transition={{ duration: 0.6, delay: isClosed ? 0.4 : 0 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
      >
        <div className="flex flex-col items-center drop-shadow-2xl">
          <img
            src="/Marvel-focus-transparent.png"
            alt="Marvel Focus"
            className="h-20 md:h-32 w-auto object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
          />
          <div className="text-red-100 mt-4 font-mono text-sm tracking-[0.5em] uppercase opacity-80 bg-black/50 px-4 py-1 rounded-full backdrop-blur-sm">
            ENTERING THE CINEMA
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default Curtain;
