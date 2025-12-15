"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useCinemaStore } from "@/store/useCinemaStore";
import { Movie } from "@/types";
import { STATIC_MARVEL_DATA } from "@/lib/marvelData";
import {
  ArrowRight,
  Zap,
  RotateCcw,
  Sparkles,
  X,
  Play,
  Calendar,
  Clock,
} from "lucide-react";

// ============================================================================
// Particle Component - Floating background particles
// ============================================================================
const Particle = ({ delay, duration }: { delay: number; duration: number }) => {
  const { randomX, randomSize, isGreen } = useMemo(
    () => ({
      randomX: Math.random() * 100,
      randomSize: Math.random() * 4 + 2,
      isGreen: Math.random() > 0.5,
    }),
    []
  );

  return (
    <motion.div
      className={`absolute rounded-full ${
        isGreen ? "bg-emerald-400/40" : "bg-emerald-300/30"
      }`}
      style={{
        width: randomSize,
        height: randomSize,
        left: `${randomX}%`,
        bottom: 0,
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: -800,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

// ============================================================================
// Time Stone Ring Component
// ============================================================================
const TimeStoneRing = ({
  size,
  rotation,
  isSpinning,
  speed = 2,
}: {
  size: number;
  rotation: number;
  isSpinning: boolean;
  speed?: number;
}) => {
  return (
    <motion.div
      className="absolute rounded-full border-2 border-emerald-400/60"
      style={{
        width: size,
        height: size,
        top: "50%",
        left: "50%",
        marginTop: -size / 2,
        marginLeft: -size / 2,
        boxShadow: `0 0 30px rgba(52, 211, 153, 0.4), inset 0 0 20px rgba(52, 211, 153, 0.1)`,
      }}
      animate={{
        rotate: isSpinning ? [rotation, rotation + 360] : rotation,
      }}
      transition={{
        duration: isSpinning ? speed : 0,
        repeat: isSpinning ? Infinity : 0,
        ease: "linear",
      }}
    >
      {/* Mystical symbols on ring */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <div
          key={angle}
          className="absolute w-2 h-2 bg-emerald-400 rounded-full"
          style={{
            top: "50%",
            left: "50%",
            transform: `rotate(${angle}deg) translateX(${
              size / 2 - 8
            }px) translateY(-50%)`,
            boxShadow: "0 0 10px rgba(52, 211, 153, 0.8)",
          }}
        />
      ))}
    </motion.div>
  );
};

// ============================================================================
// Mystical Rune Component
// ============================================================================
const MysticalRune = ({
  angle,
  radius,
  isSpinning,
}: {
  angle: number;
  radius: number;
  isSpinning: boolean;
}) => {
  const runes = ["◇", "◈", "◆", "✧", "✦", "⬡"];
  const rune = runes[Math.floor(Math.random() * runes.length)];

  return (
    <motion.div
      className="absolute text-emerald-400/60 text-xl font-bold"
      style={{
        top: "50%",
        left: "50%",
        transform: `rotate(${angle}deg) translateY(-${radius}px)`,
      }}
      animate={{
        opacity: isSpinning ? [0.3, 1, 0.3] : 0.6,
        scale: isSpinning ? [1, 1.2, 1] : 1,
      }}
      transition={{
        duration: 1,
        repeat: isSpinning ? Infinity : 0,
        delay: angle / 360,
      }}
    >
      {rune}
    </motion.div>
  );
};

// ============================================================================
// Movie Poster Slot Component
// ============================================================================
const MovieSlot = ({
  movie,
  isActive,
  position,
}: {
  movie: Movie;
  isActive: boolean;
  position: number;
}) => {
  const opacity = position === 0 ? 1 : 0.3;
  const scale = position === 0 ? 1 : 0.7;
  const blur = position === 0 ? 0 : 4;

  return (
    <motion.div
      className="absolute"
      style={{
        width: 120,
        height: 180,
      }}
      animate={{
        opacity,
        scale,
        filter: `blur(${blur}px)`,
      }}
      transition={{ duration: 0.3 }}
    >
      {movie.poster_path ? (
        <div className="relative w-full h-full">
          <Image
            src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
            alt={movie.title}
            fill
            sizes="120px"
            className={`object-cover rounded-lg ${
              isActive
                ? "ring-4 ring-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.6)]"
                : ""
            }`}
          />
        </div>
      ) : (
        <div className="w-full h-full bg-zinc-800 rounded-lg flex items-center justify-center">
          <span className="text-zinc-500 text-xs text-center px-2">
            {movie.title}
          </span>
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// Main SpinWheel Component
// ============================================================================
const SpinWheel: React.FC = () => {
  const { setSelectedMovie, setBookingStep } = useCinemaStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [winner, setWinner] = useState<Movie | null>(null);
  const [showResult, setShowResult] = useState(false);
  const controls = useAnimation();

  // Get all actual movies (no placeholders)
  const availableMovies = STATIC_MARVEL_DATA.filter(
    (m) => m.type !== "placeholder" && m.poster_path
  );

  // Spin the wheel
  const spinWheel = useCallback(async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);
    setShowResult(false);

    // Pick random winner
    const winnerIndex = Math.floor(Math.random() * availableMovies.length);
    const selectedMovie = availableMovies[winnerIndex];

    // Animate through movies (slot machine effect)
    const totalSpins = 30 + Math.floor(Math.random() * 20);
    let currentSpin = 0;
    let delay = 50;

    const spinInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % availableMovies.length);
      currentSpin++;

      // Slow down near the end
      if (currentSpin > totalSpins - 15) {
        delay += 20;
      }
      if (currentSpin > totalSpins - 5) {
        delay += 50;
      }

      if (currentSpin >= totalSpins) {
        clearInterval(spinInterval);
        setCurrentIndex(winnerIndex);
        setWinner(selectedMovie);
        setIsSpinning(false);

        // Show result after brief pause
        setTimeout(() => {
          setShowResult(true);
        }, 500);
      }
    }, delay);
  }, [isSpinning, availableMovies]);

  const handleConfirmSelection = () => {
    if (winner) {
      setSelectedMovie(winner);
      setBookingStep("seats");
    }
  };

  const handleSpinAgain = () => {
    setWinner(null);
    setShowResult(false);
    spinWheel();
  };

  const handleGoBack = () => {
    setBookingStep("mode-select");
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return "TBA";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const currentMovie = availableMovies[currentIndex];

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Mystical Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(52,211,153,0.1)_0%,_transparent_70%)]" />

        {/* Floating Particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <Particle key={i} delay={i * 0.3} duration={8 + Math.random() * 4} />
        ))}
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleGoBack}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-zinc-400 hover:text-white transition-all"
      >
        <RotateCcw className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </motion.button>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 z-10"
      >
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500 mb-4">
          Time Stone Selector
        </h1>
        <p className="text-zinc-400 text-lg">
          Let the mystic arts choose your cinematic destiny
        </p>
      </motion.div>

      {/* Main Wheel Container */}
      <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px] z-10">
        {/* Outer mystical rings */}
        <TimeStoneRing
          size={450}
          rotation={0}
          isSpinning={isSpinning}
          speed={8}
        />
        <TimeStoneRing
          size={380}
          rotation={45}
          isSpinning={isSpinning}
          speed={6}
        />
        <TimeStoneRing
          size={310}
          rotation={90}
          isSpinning={isSpinning}
          speed={4}
        />

        {/* Mystical runes */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
          (angle) => (
            <MysticalRune
              key={angle}
              angle={angle}
              radius={200}
              isSpinning={isSpinning}
            />
          )
        )}

        {/* Center Time Stone */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: isSpinning ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: isSpinning ? Infinity : 0,
          }}
        >
          {/* Glowing backdrop */}
          <div className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500/30 to-green-600/20 blur-xl" />

          {/* Inner stone container */}
          <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-emerald-900/80 via-zinc-900 to-emerald-950/80 border-4 border-emerald-400/50 shadow-[0_0_60px_rgba(52,211,153,0.5),inset_0_0_40px_rgba(52,211,153,0.2)] flex items-center justify-center overflow-hidden">
            {/* Movie poster in center */}
            {currentMovie && (
              <motion.img
                key={currentMovie.id}
                src={`https://image.tmdb.org/t/p/w342${currentMovie.poster_path}`}
                alt={currentMovie.title}
                className="w-28 h-28 object-cover rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.1 }}
              />
            )}

            {/* Pulsing glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-emerald-400/30"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        {/* Selection indicator arrow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-30">
          <motion.div
            animate={{
              y: isSpinning ? [0, 5, 0] : 0,
            }}
            transition={{
              duration: 0.3,
              repeat: isSpinning ? Infinity : 0,
            }}
          >
            <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-emerald-400 filter drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          </motion.div>
        </div>
      </div>

      {/* Current Movie Name */}
      <motion.div
        key={currentMovie?.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 text-center z-10"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {currentMovie?.title || "Loading..."}
        </h2>
        <p className="text-emerald-400 text-sm uppercase tracking-widest">
          Phase {currentMovie?.phase}
        </p>
      </motion.div>

      {/* Spin Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={spinWheel}
        disabled={isSpinning}
        className={`mt-10 px-12 py-5 rounded-full font-bold uppercase tracking-wider text-lg transition-all z-10 flex items-center gap-3 ${
          isSpinning
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            : "bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 text-white shadow-[0_0_40px_rgba(52,211,153,0.5)] hover:shadow-[0_0_60px_rgba(52,211,153,0.7)]"
        }`}
      >
        {isSpinning ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
            Channeling the Multiverse...
          </>
        ) : (
          <>
            <Zap className="w-6 h-6" />
            Activate Time Stone
          </>
        )}
      </motion.button>

      {/* Winner Modal */}
      <AnimatePresence>
        {showResult && winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative w-full max-w-lg"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-green-500/30 to-emerald-500/30 blur-3xl" />

              {/* Card */}
              <div className="relative bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-3xl overflow-hidden border border-zinc-700/50 shadow-2xl">
                {/* Header */}
                <div className="relative p-6 text-center bg-gradient-to-r from-emerald-900/50 via-green-900/50 to-emerald-900/50">
                  <button
                    onClick={() => setShowResult(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-bold uppercase tracking-wider mb-3"
                  >
                    <Sparkles className="w-4 h-4" />
                    Destiny Revealed
                  </motion.div>

                  <h2 className="text-3xl font-black text-white uppercase tracking-wide">
                    {winner.title}
                  </h2>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex gap-6">
                    {/* Poster */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="w-32 flex-shrink-0"
                    >
                      <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-2 ring-emerald-500/50 relative">
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${winner.poster_path}`}
                          alt={winner.title}
                          fill
                          sizes="128px"
                          className="object-cover"
                          priority
                        />
                      </div>
                    </motion.div>

                    {/* Details */}
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex-1"
                    >
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
                          Phase {winner.phase}
                        </span>
                        <span className="px-3 py-1 bg-white/10 text-zinc-300 text-xs font-bold rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRuntime(winner.runtime)}
                        </span>
                        <span className="px-3 py-1 bg-white/10 text-zinc-300 text-xs font-bold rounded-full flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {winner.release_date?.split("-")[0]}
                        </span>
                      </div>

                      <p className="text-zinc-400 text-sm leading-relaxed line-clamp-4">
                        {winner.overview}
                      </p>
                    </motion.div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSpinAgain}
                    className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Spin Again
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmSelection}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Book Tickets
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpinWheel;
