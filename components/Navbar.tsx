"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dices, Sparkles } from "lucide-react";
import { useCinemaStore } from "@/store/useCinemaStore";

interface NavbarProps {
  onSurpriseMe?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSurpriseMe }) => {
  const { setSelectionMode, setBookingStep } = useCinemaStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePhase, setActivePhase] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detect which phase section is currently in view
      const phases = [1, 2, 3, 4, 5, 6];
      for (const phase of phases.reverse()) {
        const element = document.getElementById(`phase-${phase}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActivePhase(phase);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSurpriseMe = () => {
    if (onSurpriseMe) {
      onSurpriseMe();
    } else {
      setSelectionMode("random");
      setBookingStep("spinning");
    }
  };

  const scrollToPhase = (phase: number) => {
    const element = document.getElementById(`phase-${phase}`);
    if (element) {
      const offset = 100; // Account for fixed navbar
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  const phases = [1, 2, 3, 4, 5, 6];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-xl py-3 border-b border-white/10 shadow-2xl shadow-black/50"
          : "bg-gradient-to-b from-black/80 to-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* LEFT: Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase hidden sm:block">
              <span className="text-red-500">MARVEL</span> CINEMA
            </span>
          </motion.div>

          {/* CENTER: Phase Links */}
          <div className="hidden lg:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2">
            {phases.map((phase) => (
              <motion.button
                key={phase}
                onClick={() => scrollToPhase(phase)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 rounded-lg ${
                  activePhase === phase
                    ? "text-white bg-red-600/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="relative z-10">Phase {phase}</span>
                {activePhase === phase && (
                  <motion.div
                    layoutId="activePhase"
                    className="absolute inset-0 bg-red-600/20 rounded-lg border border-red-500/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Mobile Phase Dropdown */}
          <div className="lg:hidden flex items-center gap-2">
            <select
              onChange={(e) => scrollToPhase(Number(e.target.value))}
              className="bg-zinc-900/80 border border-zinc-700 rounded-lg px-3 py-2 text-sm font-bold text-white uppercase tracking-wider focus:outline-none focus:border-red-500"
              defaultValue=""
            >
              <option value="" disabled>
                Jump to Phase
              </option>
              {phases.map((phase) => (
                <option key={phase} value={phase}>
                  Phase {phase}
                </option>
              ))}
            </select>
          </div>

          {/* RIGHT: Surprise Me Button */}
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(220, 38, 38, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSurpriseMe}
            className="flex items-center gap-2 px-4 md:px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg shadow-red-900/30 hover:from-red-500 hover:to-red-600 transition-all flex-shrink-0"
          >
            <Dices className="w-4 h-4" />
            <span className="hidden sm:inline">Surprise Me</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
