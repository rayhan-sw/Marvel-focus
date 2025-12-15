import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCinemaStore } from "@/store/useCinemaStore";
import { Ticket, Calendar, Clock, MapPin, Scissors } from "lucide-react";
import { MoviePoster, formatRuntime } from "@/components/ui/MoviePoster";

const TicketReveal = () => {
  const router = useRouter();
  const { selectedMovie, selectedSeat, setCurtainVisible } = useCinemaStore();
  const [isRipping, setIsRipping] = useState(false);

  const handleEnterTheater = async () => {
    setIsRipping(true);
    // Trigger curtain close after rip animation starts
    setTimeout(() => {
      setCurtainVisible(true);

      // Navigate after curtain closes
      setTimeout(() => {
        router.push("/watch");
      }, 1500);
    }, 2000);
  };

  if (!selectedMovie) return null;

  const formattedRuntime = formatRuntime(selectedMovie.runtime);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4 overflow-hidden perspective-[1000px]">
      <div className="relative w-full max-w-md">
        {/* TOP PART OF TICKET */}
        <motion.div
          initial={{ y: 0, rotate: 0 }}
          animate={
            isRipping
              ? { y: -100, rotate: -5, opacity: 0 }
              : { y: 0, rotate: 0, opacity: 1 }
          }
          transition={{ duration: 0.8, ease: "backIn" }}
          className="relative bg-[#E4DCCF] text-black rounded-t-2xl shadow-xl overflow-hidden z-20"
        >
          {/* Header */}
          <div className="bg-red-600 p-4 text-white flex justify-between items-center border-b-2 border-dashed border-red-800">
            <div className="font-bold text-lg tracking-widest">
              MARVEL CINEMA
            </div>
            <Ticket className="w-6 h-6" />
          </div>

          {/* Content */}
          <div className="p-6 flex gap-4">
            <div className="w-1/3 shrink-0">
              <div className="aspect-[2/3] rounded shadow-md overflow-hidden bg-zinc-200">
                <MoviePoster
                  posterPath={selectedMovie.poster_path}
                  title={selectedMovie.title}
                  className="w-full h-full"
                  size="w300"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-black uppercase leading-tight mb-2 line-clamp-2">
                  {selectedMovie.title}
                </h2>
                <div className="flex items-center gap-2 text-sm text-zinc-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span>{formattedRuntime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedMovie.release_date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <MapPin className="w-4 h-4" />
                  <span>IMAX Studio 1, Seat {selectedSeat || "Random"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Perforation Visuals (Bottom of Top Part) */}
          <div className="relative h-4 w-full">
            <div className="absolute bottom-0 left-0 w-full border-b-4 border-dashed border-zinc-400/50" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-black rounded-full z-30" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-black rounded-full z-30" />
          </div>
        </motion.div>

        {/* BOTTOM PART OF TICKET (STUB) */}
        <motion.div
          initial={{ y: 0, rotate: 0 }}
          animate={
            isRipping
              ? { y: 100, rotate: 5, opacity: 0 }
              : { y: 0, rotate: 0, opacity: 1 }
          }
          transition={{ duration: 0.8, ease: "backIn" }}
          className="relative bg-[#E4DCCF] text-black rounded-b-2xl shadow-xl overflow-hidden z-10 -mt-[1px]" // Negative margin to overlap slightly
        >
          <div className="p-4 pt-6 flex flex-col items-center gap-4">
            <div className="w-full flex justify-between items-center px-4 opacity-60">
              <div className="text-xs font-mono text-zinc-500">ADMIT ONE</div>
              <div className="font-mono text-xl tracking-[0.5em]">
                ||| || |||
              </div>
            </div>

            <button
              onClick={handleEnterTheater}
              disabled={isRipping}
              className="w-full py-3 bg-black text-white font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-800 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              {isRipping ? "Entering..." : "Enter Theater"}
              {!isRipping && (
                <Scissors className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TicketReveal;
