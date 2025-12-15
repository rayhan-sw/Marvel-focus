"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCinemaStore } from "@/store/useCinemaStore";
import { Movie } from "@/types";
import { MARVEL_PHASES } from "@/lib/marvelData";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import { MoviePoster } from "@/components/ui/MoviePoster";

// ============================================================================
// MovieCard Component
// ============================================================================
interface MovieCardProps {
  movie: Movie;
  isSelected: boolean;
  onSelect: (movie: Movie) => void;
  index: number;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isSelected,
  onSelect,
  index,
}) => {
  const formatRuntime = (minutes: number) => {
    if (!minutes) return "TBA";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const isPlaceholder = movie.type === "placeholder";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={
        !isPlaceholder
          ? { scale: 1.08, y: -12, zIndex: 10, transition: { duration: 0.25 } }
          : {}
      }
      onClick={() => !isPlaceholder && onSelect(movie)}
      className={`relative flex-shrink-0 w-[160px] md:w-[200px] ${
        isPlaceholder
          ? "cursor-default opacity-60"
          : "cursor-pointer group/card"
      }`}
    >
      {/* Card */}
      <div
        className={`relative aspect-[2/3] rounded-xl overflow-hidden mb-4 transition-all duration-300 ${
          isSelected
            ? "ring-[3px] ring-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)]"
            : isPlaceholder
            ? "ring-1 ring-white/5 bg-zinc-900"
            : "ring-1 ring-white/10 group-hover/card:ring-red-500/50 group-hover/card:shadow-[0_20px_40px_rgba(239,68,68,0.2)]"
        }`}
      >
        {movie.poster_path ? (
          <MoviePoster
            posterPath={movie.poster_path}
            title={movie.title}
            className="w-full h-full"
            priority={index < 4}
            sizes="(max-width: 768px) 160px, 200px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
            <div className="text-center p-4">
              <Calendar className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <span className="text-zinc-500 text-xs uppercase tracking-wider">
                Coming Soon
              </span>
            </div>
          </div>
        )}

        {/* Permanent Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent" />

        {/* Hover Overlay */}
        {!isPlaceholder && (
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4">
            <Play className="w-12 h-12 text-white mb-3 fill-white/20" />
            <span className="text-white text-xs font-bold uppercase tracking-widest">
              Select
            </span>
          </div>
        )}

        {/* Selected Badge */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute top-3 right-3 w-9 h-9 bg-red-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/30"
          >
            <Star className="w-5 h-5 fill-white text-white" />
          </motion.div>
        )}
      </div>

      {/* Title Below Poster */}
      <h3
        className={`font-bold text-sm line-clamp-2 leading-snug transition-colors duration-300 ${
          isSelected
            ? "text-red-500"
            : isPlaceholder
            ? "text-zinc-500"
            : "text-white group-hover/card:text-red-400"
        }`}
      >
        {movie.title}
      </h3>
      <div className="flex items-center gap-2 mt-1.5 text-zinc-500 text-xs">
        <Clock className="w-3 h-3" />
        <span>{formatRuntime(movie.runtime)}</span>
        <span className="text-zinc-700">•</span>
        <span>{movie.release_date?.split("-")[0] || "TBA"}</span>
      </div>
    </motion.div>
  );
};

// ============================================================================
// PhaseCarousel Component
// ============================================================================
interface PhaseCarouselProps {
  phaseId: string;
  phaseName: string;
  phaseNumber: number;
  movies: Movie[];
  selectedMovie: Movie | null;
  onSelectMovie: (movie: Movie) => void;
}

const PhaseCarousel: React.FC<PhaseCarouselProps> = ({
  phaseId,
  phaseName,
  phaseNumber,
  movies,
  selectedMovie,
  onSelectMovie,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const checkScrollPosition = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id={phaseId}
      className="relative py-8"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Phase Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-1 h-10 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
              {phaseName}
            </h2>
            <p className="text-zinc-500 text-sm">
              {movies.filter((m) => m.type !== "placeholder").length} Movies
            </p>
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative group">
        {/* Left Arrow */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.2 }}
              onClick={() => scroll("left")}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-red-600 hover:border-red-500 transition-all duration-300 shadow-2xl"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right Arrow */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              onClick={() => scroll("right")}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-red-600 hover:border-red-500 transition-all duration-300 shadow-2xl"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Left Fade Gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent z-20 pointer-events-none" />

        {/* Right Fade Gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent z-20 pointer-events-none" />

        {/* Movie Carousel */}
        <div
          ref={carouselRef}
          onScroll={checkScrollPosition}
          className="flex gap-5 overflow-x-auto py-4 px-6 md:px-12 scroll-smooth scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie, idx) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isSelected={selectedMovie?.id === movie.id}
              onSelect={onSelectMovie}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// Main MovieBrowser Component
// ============================================================================
const MovieBrowser: React.FC = () => {
  const { selectedMovie, setSelectedMovie, setBookingStep } = useCinemaStore();

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleConfirmSelection = () => {
    if (selectedMovie) {
      setBookingStep("seats");
    }
  };

  const formatRuntime = (minutes: number) => {
    if (!minutes) return "TBA";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="relative w-full min-h-screen text-white bg-[#0a0a0a]">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Full Screen Hero */}
      <Hero onSpin={() => setBookingStep("spinning")} />

      {/* Phase Sections */}
      <div className="relative z-10 bg-[#0a0a0a]">
        {/* Subtle Background Effects */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(127,29,29,0.08)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(127,29,29,0.05)_0%,_transparent_50%)]" />
        </div>

        {/* Phase Navigation Strip (visible after Hero) */}
        <div className="sticky top-16 z-40 bg-black/95 backdrop-blur-xl border-b border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div
              className="flex gap-3 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {MARVEL_PHASES.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => {
                    const element = document.getElementById(phase.id);
                    if (element) {
                      const offset = 120;
                      const elementPosition =
                        element.getBoundingClientRect().top + window.scrollY;
                      window.scrollTo({
                        top: elementPosition - offset,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="flex-shrink-0 px-5 py-2.5 bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/50 rounded-full text-sm font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all duration-300"
                >
                  {phase.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* All Phase Carousels */}
        <div className="pt-8 pb-32">
          {MARVEL_PHASES.map((phase) => (
            <PhaseCarousel
              key={phase.id}
              phaseId={phase.id}
              phaseName={phase.name}
              phaseNumber={phase.phase}
              movies={phase.movies}
              selectedMovie={selectedMovie}
              onSelectMovie={handleMovieSelect}
            />
          ))}
        </div>
      </div>

      {/* Selection Confirmation Bar */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-2xl border-t border-white/10"
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {selectedMovie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    className="w-14 h-20 object-cover rounded-lg shadow-lg ring-1 ring-white/10"
                  />
                ) : (
                  <div className="w-14 h-20 bg-zinc-800 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-zinc-600" />
                  </div>
                )}
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">
                    Selected
                  </p>
                  <h3 className="text-white font-bold text-lg line-clamp-1">
                    {selectedMovie.title}
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    {formatRuntime(selectedMovie.runtime)} • Phase{" "}
                    {selectedMovie.phase}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleConfirmSelection}
                className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] flex items-center gap-3"
              >
                <span className="hidden sm:inline">Continue</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MovieBrowser;
