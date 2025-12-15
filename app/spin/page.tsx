"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCinemaStore } from "@/store/useCinemaStore";
import { Movie } from "@/types";
import { STATIC_MARVEL_DATA } from "@/lib/marvelData";
import { fetchMarvelMovies } from "@/lib/tmdb";
import { ArrowLeft, X, Ticket, RotateCcw } from "lucide-react";

// ============================================================================
// Elegant Golden Ring Component
// ============================================================================
const GoldenRing = ({
  size,
  duration,
  reverse = false,
  thickness = 1,
  isActive = false,
}: {
  size: number;
  duration: number;
  reverse?: boolean;
  thickness?: number;
  isActive?: boolean;
}) => {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top: "50%",
        left: "50%",
        marginTop: -size / 2,
        marginLeft: -size / 2,
        border: `${thickness}px solid`,
        borderColor: isActive
          ? "rgba(0, 255, 65, 0.6)"
          : "rgba(212, 175, 55, 0.4)",
        boxShadow: isActive
          ? `0 0 20px rgba(0, 255, 65, 0.3), inset 0 0 15px rgba(0, 255, 65, 0.1)`
          : `0 0 15px rgba(212, 175, 55, 0.15)`,
        transition: "border-color 0.5s, box-shadow 0.5s",
      }}
      animate={{
        rotate: reverse ? [0, -360] : [0, 360],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

// ============================================================================
// Eye of Agamotto Center Symbol (SVG)
// ============================================================================
const EyeOfAgamottoSymbol = ({ isActive }: { isActive: boolean }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-20 h-20 md:w-24 md:h-24"
      style={{
        filter: isActive
          ? "drop-shadow(0 0 15px rgba(0, 255, 65, 0.8))"
          : "drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))",
        transition: "filter 0.5s",
      }}
    >
      {/* Outer eye shape */}
      <ellipse
        cx="50"
        cy="50"
        rx="45"
        ry="25"
        fill="none"
        stroke={isActive ? "#00ff41" : "#d4af37"}
        strokeWidth="2"
        opacity={0.8}
      />
      {/* Inner circle */}
      <circle
        cx="50"
        cy="50"
        r="15"
        fill="none"
        stroke={isActive ? "#00ff41" : "#d4af37"}
        strokeWidth="2"
        opacity={0.9}
      />
      {/* Center pupil */}
      <circle
        cx="50"
        cy="50"
        r="6"
        fill={isActive ? "#00ff41" : "#d4af37"}
        opacity={isActive ? 1 : 0.7}
      />
      {/* Decorative lines */}
      <line
        x1="50"
        y1="5"
        x2="50"
        y2="25"
        stroke={isActive ? "#00ff41" : "#d4af37"}
        strokeWidth="1.5"
        opacity={0.5}
      />
      <line
        x1="50"
        y1="75"
        x2="50"
        y2="95"
        stroke={isActive ? "#00ff41" : "#d4af37"}
        strokeWidth="1.5"
        opacity={0.5}
      />
    </svg>
  );
};

// ============================================================================
// Movie Poster with Fallback (Local component for spin wheel styling)
// ============================================================================
const SpinMoviePoster = ({ movie }: { movie: Movie }) => {
  const [imageError, setImageError] = useState(false);

  if (imageError || !movie.poster_path) {
    // Gradient fallback placeholder
    return (
      <div
        className="w-full h-full flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(180deg, #0d3d0d 0%, #0a0a0a 100%)",
        }}
      >
        <h3 className="text-white text-xl md:text-2xl font-bold text-center leading-tight">
          {movie.title}
        </h3>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

// ============================================================================
// Main SpinWheel Page Component
// ============================================================================
export default function SpinWheelPage() {
  const router = useRouter();
  const {
    movies,
    setMovies,
    setSelectedMovie,
    setBookingStep,
    setSelectionMode,
  } = useCinemaStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Movie | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load movies from API if not already in store (same as main page)
  useEffect(() => {
    const loadMovies = async () => {
      if (movies.length === 0) {
        const data = await fetchMarvelMovies();
        setMovies(data);
      }
      setIsLoading(false);
    };
    loadMovies();
  }, [movies, setMovies]);

  // Use movies from store (same source as ModeSelection)
  // Fallback to STATIC_MARVEL_DATA if store is empty
  const availableMovies = (
    movies.length > 0 ? movies : STATIC_MARVEL_DATA
  ).filter((m) => m.type !== "placeholder" && m.poster_path);

  // Spin the Eye of Agamotto
  const spinWheel = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);
    setShowResult(false);

    const winnerIndex = Math.floor(Math.random() * availableMovies.length);
    const selectedMovie = availableMovies[winnerIndex];

    // Simple timeout for spinning duration
    setTimeout(() => {
      setWinner(selectedMovie);
      setIsSpinning(false);
      setTimeout(() => setShowResult(true), 300);
    }, 2500);
  }, [isSpinning, availableMovies]);

  const handleConfirmSelection = () => {
    if (winner) {
      setSelectedMovie(winner);
      setSelectionMode("random");
      setBookingStep("seats");
      router.push("/");
    }
  };

  const handleSpinAgain = () => {
    setWinner(null);
    setShowResult(false);
    setTimeout(() => spinWheel(), 100);
  };

  const handleGoBack = () => {
    router.push("/");
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return "TBA";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  // Loading state while fetching movies
  if (isLoading) {
    return (
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.05)_0%,_transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border border-yellow-600/50 rounded-full mx-auto mb-4"
            style={{ borderTopColor: "rgb(212, 175, 55)" }}
          />
          <p className="text-zinc-500 text-sm tracking-widest uppercase">
            Opening the Eye...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Subtle Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.03)_0%,_transparent_60%)]" />
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleGoBack}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 text-zinc-500 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </motion.button>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 z-10"
      >
        <h1 className="text-2xl md:text-3xl font-light uppercase tracking-[0.3em] text-zinc-300 mb-2">
          Eye of Agamotto
        </h1>
        <p className="text-zinc-600 text-xs tracking-widest">
          THE MYSTIC ARTS AWAIT
        </p>
      </motion.div>

      {/* The Eye of Agamotto - Minimalist Rings */}
      <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] z-10">
        {/* Three elegant golden rings */}
        <GoldenRing
          size={380}
          duration={30}
          thickness={1}
          isActive={isSpinning}
        />
        <GoldenRing
          size={300}
          duration={20}
          reverse
          thickness={1.5}
          isActive={isSpinning}
        />
        <GoldenRing
          size={220}
          duration={15}
          thickness={1}
          isActive={isSpinning}
        />

        {/* Center Eye Symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: isSpinning ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: isSpinning ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <EyeOfAgamottoSymbol isActive={isSpinning} />
          </motion.div>
        </div>

        {/* Subtle pulse effect when active */}
        <AnimatePresence>
          {isSpinning && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-32 h-32 rounded-full border border-[#00ff41]/30" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spin Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          boxShadow: "0 0 30px rgba(0, 255, 65, 0.3)",
        }}
        whileTap={{ scale: 0.98 }}
        onClick={spinWheel}
        disabled={isSpinning}
        className={`mt-12 px-8 py-3 rounded-full font-medium uppercase tracking-widest text-sm transition-all z-10 border ${
          isSpinning
            ? "border-zinc-700 text-zinc-600 cursor-not-allowed"
            : "border-zinc-600 text-zinc-300 hover:border-[#00ff41]/50 hover:text-[#00ff41]"
        }`}
      >
        {isSpinning ? "Revealing..." : "Reveal Destiny"}
      </motion.button>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowResult(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Card - Clean Glassmorphism */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(20, 20, 20, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowResult(false)}
                  className="absolute top-4 right-4 z-10 p-2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="flex flex-col md:flex-row">
                  {/* Poster with Fallback */}
                  <div className="w-full md:w-48 shrink-0">
                    <div className="aspect-[2/3] bg-zinc-900 overflow-hidden">
                      <SpinMoviePoster movie={winner} />
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="flex-1 p-6">
                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white mb-3 leading-tight">
                      {winner.title}
                    </h2>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2.5 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                        Phase {winner.phase}
                      </span>
                      <span className="px-2.5 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                        {winner.release_date?.split("-")[0] || "TBA"}
                      </span>
                      <span className="px-2.5 py-1 bg-zinc-800 text-zinc-400 text-xs rounded">
                        {formatRuntime(winner.runtime)}
                      </span>
                    </div>

                    {/* Synopsis */}
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-6">
                      {winner.overview || "No synopsis available."}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirmSelection}
                        className="w-full py-3 bg-[#00ff41] hover:bg-[#00dd38] text-black font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Ticket className="w-4 h-4" />
                        Book Tickets
                      </motion.button>

                      <button
                        onClick={handleSpinAgain}
                        className="w-full py-2 text-zinc-500 hover:text-white text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Spin Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
