"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, Info, ChevronDown, Volume2, VolumeX } from "lucide-react";
import { getFeaturedMovie, MARVEL_PHASES } from "@/lib/marvelData";
import { useCinemaStore } from "@/store/useCinemaStore";

const Hero: React.FC = () => {
  const { setSelectedMovie, setBookingStep } = useCinemaStore();
  const [isMuted, setIsMuted] = React.useState(true);
  const featuredMovie = getFeaturedMovie();

  const handleWatchNow = () => {
    setSelectedMovie(featuredMovie);
    setBookingStep("seats");
  };

  const scrollToContent = () => {
    const element = document.getElementById("phase-1");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get phase info
  const phaseInfo = MARVEL_PHASES.find((p) => p.phase === featuredMovie.phase);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: featuredMovie.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`
              : "linear-gradient(to bottom, #1a1a1a, #0a0a0a)",
          }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />

        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)] opacity-40" />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded">
              {phaseInfo?.name || `Phase ${featuredMovie.phase}`}
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded border border-white/20">
              IMAX Enhanced
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded border border-white/20">
              {new Date(featuredMovie.release_date).getFullYear()}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white mb-6 leading-none"
          >
            {featuredMovie.title.split(":").map((part, index) => (
              <span
                key={index}
                className={index > 0 ? "block text-red-500" : ""}
              >
                {part.trim()}
              </span>
            ))}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-lg md:text-xl text-zinc-300 mb-8 max-w-2xl leading-relaxed"
          >
            {featuredMovie.overview}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex items-center gap-4 flex-wrap"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 40px rgba(255,255,255,0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWatchNow}
              className="flex items-center gap-3 px-8 py-4 bg-white text-black font-bold uppercase tracking-wider text-lg rounded-lg hover:bg-zinc-200 transition-colors shadow-2xl"
            >
              <Play className="w-6 h-6 fill-current" />
              Watch Now
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold uppercase tracking-wider text-lg rounded-lg border border-white/30 hover:border-white/50 transition-all"
            >
              <Info className="w-6 h-6" />
              Details
            </motion.button>
          </motion.div>

          {/* Movie Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex items-center gap-6 mt-8 text-sm text-zinc-400"
          >
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-bold">96%</span>
              <span>Match</span>
            </div>
            <div>{featuredMovie.runtime} min</div>
            <div className="px-2 py-0.5 border border-zinc-600 text-xs">HD</div>
            <div className="px-2 py-0.5 border border-zinc-600 text-xs">
              5.1
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mute/Unmute Button (for future video background) */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-32 right-8 p-3 bg-zinc-900/80 backdrop-blur-sm rounded-full border border-white/20 hover:bg-zinc-800 transition-colors"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </motion.button>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer"
        onClick={scrollToContent}
      >
        <span className="text-xs text-zinc-500 uppercase tracking-widest mb-3">
          Scroll to Explore
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-8 h-12 border-2 border-zinc-600 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0, 1, 0], y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-3 bg-red-500 rounded-full"
          />
        </motion.div>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        >
          <ChevronDown className="w-5 h-5 text-zinc-500 mt-2" />
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
