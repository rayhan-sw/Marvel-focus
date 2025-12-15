"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fetchMarvelMovies } from "@/lib/tmdb";
import { useCinemaStore } from "@/store/useCinemaStore";
import ModeSelection from "@/components/steps/ModeSelection";
import MovieBrowser from "@/components/steps/MovieBrowser";
import SeatSelection from "@/components/steps/SeatSelection";
import TicketReveal from "@/components/steps/TicketReveal";

export default function Home() {
  const { setMovies, bookingStep } = useCinemaStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      const data = await fetchMarvelMovies();
      setMovies(data);
      setLoading(false);
    };
    initData();
  }, [setMovies]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-zinc-400 text-sm uppercase tracking-widest"
          >
            Loading Marvel Universe...
          </motion.div>
        </div>
      </div>
    );
  }

  // Full-screen components that handle their own layout
  const isFullScreenStep =
    bookingStep === "mode-select" || bookingStep === "browsing";

  return (
    <AnimatePresence mode="wait">
      {isFullScreenStep ? (
        // Full-screen steps - no wrapper needed
        <>
          {bookingStep === "mode-select" && (
            <motion.div
              key="mode-select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ModeSelection />
            </motion.div>
          )}

          {bookingStep === "browsing" && (
            <motion.div
              key="browsing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MovieBrowser />
            </motion.div>
          )}
        </>
      ) : (
        // Contained steps with wrapper
        <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden relative">
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-[#0a0a0a] to-[#0a0a0a] -z-10" />

          <div className="container mx-auto py-8">
            {bookingStep === "seats" && (
              <motion.div
                key="seats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <SeatSelection />
              </motion.div>
            )}

            {bookingStep === "ticket" && (
              <motion.div
                key="ticket"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <TicketReveal />
              </motion.div>
            )}
          </div>
        </main>
      )}
    </AnimatePresence>
  );
}
