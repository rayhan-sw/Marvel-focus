"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Play,
  Info,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Dices,
  Sparkles,
  Clock,
  Calendar,
  Menu,
  X,
  Star,
  Film,
} from "lucide-react";
import { useCinemaStore } from "@/store/useCinemaStore";
import { Movie } from "@/types";
import { MARVEL_PHASES } from "@/lib/marvelData";
import { formatRuntime } from "@/components/ui/MoviePoster";
import Hero from "@/components/sections/Hero";

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
      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 shadow-lg ring-1 ring-white/10 group-hover/card:ring-red-500/50 group-hover/card:shadow-2xl group-hover/card:shadow-red-900/20 transition-all duration-300">
        {!imageError && movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
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

const ModeSelection = () => {
  const router = useRouter();
  const { setSelectionMode, setBookingStep, setSelectedMovie, movies } =
    useCinemaStore();
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detect active phase
      const phases = [1, 2, 3, 4, 5, 6];
      for (const phase of [...phases].reverse()) {
        const element = document.getElementById(`phase-${phase}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            setActivePhase(phase);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const withBackdrop = movies.filter(
        (m) => m.backdrop_path && m.type !== "placeholder"
      );
      const randomHero =
        withBackdrop[Math.floor(Math.random() * withBackdrop.length)];
      setHeroMovie(randomHero);
    }
  }, [movies]);

  const handleMovieClick = (movie: Movie) => {
    if (movie.type === "placeholder") return;
    setSelectedMovie(movie);
    setSelectionMode("manual");
    setBookingStep("seats");
  };

  const handleSurpriseMe = () => {
    router.push("/spin");
  };

  const scrollToPhase = (phase: number) => {
    const element = document.getElementById(`phase-${phase}`);
    if (element) {
      const offset = 100;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  // Group movies by Phase
  const moviesByPhase = MARVEL_PHASES.reduce((acc, phase) => {
    const storeMovies = movies.filter((m) => m.phase === phase.phase);
    acc[phase.phase] = storeMovies.length > 0 ? storeMovies : phase.movies;
    return acc;
  }, {} as Record<number, Movie[]>);

  const phases = [1, 2, 3, 4, 5, 6];

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden font-sans selection:bg-red-600 selection:text-white">
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-black/60 backdrop-blur-xl py-3 shadow-2xl"
            : "bg-gradient-to-b from-black/80 to-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* LEFT: Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 cursor-pointer shrink-0 z-50 relative"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                src="/Marvel-focus-transparent.png"
                alt="Marvel Focus"
                className="h-12 md:h-14 w-auto object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              />
            </motion.div>

            {/* CENTER: Phase Links (Desktop) */}
            <div className="hidden lg:flex items-center justify-center gap-2 absolute left-1/2 -translate-x-1/2">
              {phases.map((phase) => (
                <motion.button
                  key={phase}
                  onClick={() => scrollToPhase(phase)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-5 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 rounded-full overflow-hidden group ${
                    activePhase === phase
                      ? "text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">Phase {phase}</span>
                  {activePhase === phase && (
                    <motion.div
                      layoutId="activePhase"
                      className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  {activePhase !== phase && (
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden z-[70] relative">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-white hover:text-red-500 transition-colors bg-white/5 rounded-full backdrop-blur-sm border border-white/10"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#0a0a0a]/98 backdrop-blur-2xl pt-24 px-6 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              <div>
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 block">
                  Select Phase
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {phases.map((phase) => (
                    <button
                      key={phase}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToPhase(phase);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`relative z-10 p-4 rounded-xl text-center font-bold uppercase tracking-wider transition-all border touch-manipulation cursor-pointer ${
                        activePhase === phase
                          ? "bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                          : "bg-zinc-900/50 border-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-white/10"
                      }`}
                    >
                      Phase {phase}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION - Full Screen */}
      <Hero onSpin={handleSurpriseMe} />

      {/* CATALOGUE SECTION */}
      <div
        id="movie-list"
        className="relative z-30 pt-16 pb-20 space-y-8 bg-[#0a0a0a]"
      >
        {MARVEL_PHASES.map((phaseData) => (
          <PhaseCarousel
            key={phaseData.phase}
            phase={phaseData}
            movies={moviesByPhase[phaseData.phase] || []}
            onMovieClick={handleMovieClick}
            onDetailsClick={(movie) => {
              setHeroMovie(movie);
              setShowDetails(true);
            }}
          />
        ))}
      </div>

      {/* FOOTER */}
      <footer className="relative overflow-hidden border-t border-red-600/20 bg-black py-16">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          {/* Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#450a0a] via-[#0a0a0a] to-black" />

          {/* Comic Halftone Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(#ffffff 2px, transparent 2px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Floating Embers */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 rounded-full bg-orange-500/40 blur-[1px]"
              style={{
                left: `${Math.random() * 100}%`,
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
              }}
              animate={{
                y: [0, -150],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            {/* Left Section: Logo & Tagline */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <img
                src="/Marvel-focus-transparent.png"
                alt="Marvel Focus"
                className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              />
              <div className="text-xs font-bold tracking-[0.3em] uppercase bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200 bg-clip-text text-transparent drop-shadow-sm">
                Forged with Vibranium & Code
              </div>
            </div>

            {/* Right Section: Director's Block */}
            <div className="flex flex-col items-center md:items-end gap-4">
              <div className="flex items-center gap-6">
                {/* Director Credit */}
                <a
                  href="https://rayhansw.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center"
                >
                  <span className="text-zinc-500 text-[10px] font-medium uppercase tracking-[0.4em] group-hover:text-zinc-300 transition-colors">
                    Directed By
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-2xl md:text-3xl font-black text-white uppercase tracking-[0.1em] mt-1 group-hover:text-red-600 transition-colors"
                  >
                    RAYHANSW
                  </motion.div>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 pt-12 text-center space-y-8">
            <p className="text-zinc-600 text-[10px] max-w-2xl mx-auto leading-relaxed">
              Marvel Focus is a fan-made project. All Marvel characters, images,
              and related content are property of Marvel Studios & The Walt
              Disney Company. Movie data provided by{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
              >
                TMDB
              </a>
              .
            </p>

            {/* Easter Egg */}
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-white/80 text-sm font-bold tracking-[0.3em] uppercase font-serif"
            >
              YOU&apos;RE STILL HERE? IT&apos;S OVER. GO FOCUS.
            </motion.div>
          </div>
        </div>
      </footer>

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {showDetails && heroMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-600/20 to-red-500/20 blur-3xl" />

              {/* Modal Card */}
              <div className="relative bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl overflow-hidden border border-zinc-700/50 shadow-2xl">
                {/* Close Button */}
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>

                {/* Backdrop Image */}
                <div className="relative h-48 md:h-64 overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/w1280${heroMovie.backdrop_path}`}
                    alt={heroMovie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative p-6 -mt-20">
                  <div className="flex gap-6">
                    {/* Poster */}
                    <div className="w-28 md:w-36 shrink-0">
                      <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-2 ring-white/10">
                        <img
                          src={`https://image.tmdb.org/t/p/w300${heroMovie.poster_path}`}
                          alt={heroMovie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 pt-16 md:pt-20">
                      <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3">
                        {heroMovie.title}
                      </h2>

                      {/* Stats Row */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase">
                          Phase {heroMovie.phase}
                        </span>
                        <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                          <Clock className="w-4 h-4" />
                          <span className="font-bold text-white">
                            {Math.floor(heroMovie.runtime / 60)}h{" "}
                            {heroMovie.runtime % 60}m
                          </span>
                          <span className="text-zinc-500">
                            ({heroMovie.runtime} min)
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{heroMovie.release_date}</span>
                        </div>
                      </div>

                      {/* Duration Bar Visual */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-zinc-500 mb-1">
                          <span>Duration</span>
                          <span>{heroMovie.runtime} minutes</span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(
                                (heroMovie.runtime / 180) * 100,
                                100
                              )}%`,
                            }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full"
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
                          <span>0</span>
                          <span>1h</span>
                          <span>2h</span>
                          <span>3h</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overview */}
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      Overview
                    </h3>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      {heroMovie.overview}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowDetails(false);
                        handleMovieClick(heroMovie);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold uppercase tracking-wider transition-all"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      Watch Now
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDetails(false)}
                      className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold uppercase tracking-wider transition-all"
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModeSelection;
