"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import {
  Play,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Clock,
  Calendar,
  Menu,
  X,
  Film,
} from "lucide-react";
import { useCinemaStore } from "@/store/useCinemaStore";
import { Movie } from "@/types";
import { MARVEL_PHASES } from "@/lib/marvelData";
import { formatRuntime } from "@/components/ui/MoviePoster";
import Hero from "@/components/sections/Hero";

const PhaseCarousel = dynamic(() => import("@/components/PhaseCarousel"), {
  loading: () => <div className="h-96 w-full bg-zinc-900/20 animate-pulse" />,
});

const ModeSelection = () => {
  // Hydration-safe particles
  const [particles, setParticles] = useState<
    {
      id: number;
      left: number;
      width: number;
      height: number;
      duration: number;
      delay: number;
    }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 5,
      }))
    );
  }, []);

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
              <Image
                src="/Marvel-focus-transparent.webp"
                alt="Marvel Focus"
                width={200}
                height={56}
                priority
                sizes="(max-width: 768px) 150px, 200px"
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
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute bottom-0 rounded-full bg-orange-500/40 blur-[1px]"
              style={{
                left: `${p.left}%`,
                width: p.width,
                height: p.height,
              }}
              animate={{
                y: [0, -150],
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
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            {/* Left Section: Logo & Tagline */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="relative h-16 w-48">
                <Image
                  src="/Marvel-focus-transparent.webp"
                  alt="Marvel Focus"
                  fill
                  className="object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                />
              </div>
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
