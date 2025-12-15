"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Eye, Target } from "lucide-react";

interface HeroProps {
  onSpin: () => void;
}

export default function Hero({ onSpin }: HeroProps) {
  const [particles, setParticles] = useState<
    {
      id: number;
      x: number;
      y: number;
      size: number;
      duration: number;
      delay: number;
    }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  const scrollToMovies = () => {
    const movieList = document.getElementById("movie-list");
    if (movieList) {
      movieList.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden bg-[#0a0a0a] text-white pb-24 md:pb-0">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        {/* 1. Base Gradient: Deep Marvel Red Radial - BRIGHTER */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#800000] via-[#4a0404] to-black" />

        {/* 2. Comic Halftone Pattern Overlay - MORE VISIBLE */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* 3. Iconic Element: Rotating HUD/Arc Reactor - MORE VISIBLE */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="opacity-30 text-red-600 will-change-transform"
          >
            <Target
              className="w-[300px] h-[300px] md:w-[900px] md:h-[900px]"
              strokeWidth={0.8}
            />
          </motion.div>
        </div>

        {/* 4. Floating Embers / Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-orange-500/60 blur-[1px] will-change-transform"
            style={{
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
            }}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{
              y: "-10vh",
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
          />
        ))}

        {/* 5. Readability Overlay (Bottom Fade) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#0a0a0a]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center max-w-5xl mt-10">
        {/* Subheadline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#FFD700] font-bold tracking-[0.3em] uppercase mb-4 md:mb-6 text-xs md:text-base drop-shadow-md"
        >
          Unlock Your Heroic Productivity
        </motion.h2>

        {/* Headline - Optimized for LCP */}
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-6 md:mb-8 leading-[0.9] drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
          Marvel Focus <br />
          <span className="text-white">Method</span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-zinc-200 text-sm md:text-xl max-w-2xl mb-8 md:mb-12 leading-relaxed font-light drop-shadow-md px-4"
        >
          Transform your daily tasks into an epic saga. Select a Marvel movie
          from the list below as your timer, engage your focus for its exact
          runtime, and defeat the villain of distraction. It's time to assemble
          your productivity.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col md:flex-row gap-6 w-full md:w-auto"
        >
          <button
            onClick={scrollToMovies}
            className="group flex items-center justify-center gap-3 bg-[#ec1d24] hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(236,29,36,0.4)] transition-all transform hover:scale-105 hover:shadow-[0_0_50px_rgba(236,29,36,0.6)]"
          >
            <PlayCircle className="w-6 h-6 fill-white text-[#ec1d24]" />
            <span className="tracking-wider">CHOOSE YOUR MISSION</span>
          </button>

          <button
            onClick={onSpin}
            className="group relative z-30 flex items-center justify-center gap-3 border-2 border-[#FFD700] text-[#FFD700] hover:text-[#0a0a0a] hover:bg-[#FFD700] px-8 py-4 rounded-full font-bold transition-all duration-500 shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.8)] overflow-hidden"
          >
            <Eye className="w-6 h-6 transition-transform duration-700 group-hover:rotate-180" />
            <span className="tracking-wider relative z-10">MYSTIC SPIN</span>
          </button>
        </motion.div>
      </div>

      {/* Deadpool Peeking - Bottom Right */}
      <motion.div
        initial={{ x: "100%", rotate: 15 }}
        animate={{ x: "0%", rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 15,
          delay: 1.5,
        }}
        className="absolute bottom-0 right-0 z-20 pointer-events-none select-none"
      >
        <img
          src="/deadpool2.webp"
          alt="Deadpool Peeking"
          className="w-40 md:w-64 lg:w-80 object-contain drop-shadow-2xl transform hover:scale-110 transition-transform duration-300 origin-bottom-right"
        />
      </motion.div>
    </section>
  );
}
