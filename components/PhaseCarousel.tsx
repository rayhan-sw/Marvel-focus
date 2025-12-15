"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, Play, Film } from "lucide-react";
import { Movie } from "@/types";
import { formatRuntime } from "@/components/ui/MoviePoster";

// Phase subtitles for display
const PHASE_SUBTITLES: Record<number, string> = {
  1: "The Beginning",
  2: "The Expansion",
  3: "The Infinity Saga",
  4: "The Multiverse Saga Begins",
  5: "The Multiverse Saga Continues",
  6: "The Future",
};

// Carousel Arrow Button Component
const CarouselArrow = ({
  direction,
  onClick,
  disabled,
}: {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) => {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  const positionClass = direction === "left" ? "left-0" : "right-0";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`absolute ${positionClass} top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl transition-all duration-300 ${
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "opacity-100 hover:bg-red-600 hover:border-red-500"
      }`}
      style={{
        [direction === "left" ? "marginLeft" : "marginRight"]: "8px",
      }}
    >
      <Icon className="w-6 h-6" />
    </motion.button>
  );
};

// Movie Card Component
const MovieCard = ({
  movie,
  index,
  onClick,
  onDetails,
}: {
  movie: Movie;
  index: number;
  onClick: () => void;
  onDetails: () => void;
}) => {
  const [imageError, setImageError] = useState(false);

  if (movie.type === "placeholder") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="relative shrink-0 w-40 md:w-52 cursor-default"
      >
        <div className="aspect-[2/3] rounded-xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-dashed border-zinc-700 flex items-center justify-center">
          <div className="text-center p-4">
            <Sparkles className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <span className="text-zinc-500 text-sm font-bold uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{
        scale: 1.08,
        zIndex: 20,
        transition: { duration: 0.2 },
      }}
      onClick={onClick}
      className="relative shrink-0 w-40 md:w-52 cursor-pointer group/card"
    >
      {/* Card Container */}
      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 shadow-lg ring-1 ring-white/10 group-hover/card:ring-red-500/50 group-hover/card:shadow-2xl group-hover/card:shadow-red-900/20 transition-all duration-300 relative">
        {!imageError && movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 160px, 208px"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-zinc-800 to-zinc-900">
            <Film className="w-10 h-10 text-zinc-600 mb-3" />
            <span className="text-zinc-400 text-xs font-bold text-center leading-tight">
              {movie.title}
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-sm uppercase leading-tight mb-1">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-red-400 font-medium mb-2">
              <span>{movie.release_date?.split("-")[0]}</span>
              <span className="w-1 h-1 bg-zinc-500 rounded-full" />
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
            <p className="text-[10px] text-zinc-300 line-clamp-3 mb-3 leading-relaxed">
              {movie.overview}
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wider">
              <Play className="w-3 h-3 fill-red-500" />
              <span>Select Movie</span>
            </div>
          </div>
        </div>
      </div>

      {/* Title below card (always visible) */}
      <div className="mt-3 px-1">
        <h4 className="text-sm font-semibold text-white truncate">
          {movie.title}
        </h4>
        <p className="text-xs text-zinc-500">
          {movie.release_date?.split("-")[0]}
        </p>
      </div>

      {/* Mobile Buttons */}
      <div
        className="mt-3 flex gap-2 lg:hidden px-1 relative z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClick}
          className="flex-1 bg-red-600 text-white text-[10px] font-bold py-3 rounded hover:bg-red-700 transition-colors touch-manipulation"
        >
          BOOK
        </button>
        <button
          onClick={onDetails}
          className="flex-1 bg-zinc-800 text-zinc-300 text-[10px] font-bold py-3 rounded hover:bg-zinc-700 transition-colors touch-manipulation"
        >
          DETAILS
        </button>
      </div>
    </motion.div>
  );
};

// Phase Carousel Component
const PhaseCarousel = ({
  phase,
  movies,
  onMovieClick,
  onDetailsClick,
}: {
  phase: { name: string; phase: number };
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onDetailsClick: (movie: Movie) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScrollability);
      return () => ref.removeEventListener("scroll", checkScrollability);
    }
  }, [movies]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section id={`phase-${phase.phase}`} className="relative py-8">
      {/* Phase Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="px-6 md:px-12 mb-6"
      >
        <div className="flex items-end gap-4 border-b border-white/10 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
            {phase.name}
          </h2>
          <span className="text-zinc-500 text-sm font-medium mb-1 uppercase tracking-widest">
            {PHASE_SUBTITLES[phase.phase]}
          </span>
          <span className="ml-auto text-zinc-600 text-sm">
            {movies.filter((m) => m.type !== "placeholder").length} Movies
          </span>
        </div>
      </motion.div>

      {/* Carousel Container */}
      <div className="relative group px-6 md:px-12">
        {/* Left Arrow */}
        <CarouselArrow
          direction="left"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
        />

        {/* Scrollable Area */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {movies.map((movie, idx) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              index={idx}
              onClick={() => onMovieClick(movie)}
              onDetails={() => onDetailsClick(movie)}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <CarouselArrow
          direction="right"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
        />
      </div>
    </section>
  );
};

export default PhaseCarousel;
