import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCinemaStore } from "@/store/useCinemaStore";
import { Armchair, ArrowLeft } from "lucide-react";

const ROWS = 12; // A-L
const COLS = 14; // Reduced to 14
// Reversed labels so L is at the top (close to screen) and A is at the bottom (far)
const ROW_LABELS = "LKJIHGFEDCBA".split("");

const SeatSelection = () => {
  const { selectedMovie, setBookingStep, setSelectedSeat } = useCinemaStore();
  const [localSelectedSeat, setLocalSelectedSeat] = useState<string | null>(
    null
  );

  // Generate some random occupied seats
  const [occupiedSeats] = useState(() => {
    const occupied = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS) + 1; // 1-based index
      const rowLabel = ROW_LABELS[r];
      occupied.add(`${rowLabel}${c}`);
    }
    return occupied;
  });

  const handleSeatClick = (seatId: string) => {
    if (occupiedSeats.has(seatId)) return;
    setLocalSelectedSeat(seatId === localSelectedSeat ? null : seatId);
  };

  const handleConfirm = () => {
    if (localSelectedSeat) {
      setSelectedSeat(localSelectedSeat);
      setBookingStep("ticket");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] w-full max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setBookingStep("mode-select")}
        className="absolute top-0 left-4 md:left-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
      >
        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold uppercase tracking-wider hidden md:block">
          Back to Movies
        </span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Select Your Seat</h2>
        <p className="text-zinc-400 mb-8">
          {selectedMovie?.title} •{" "}
          {Math.floor((selectedMovie?.runtime || 0) / 60)}h{" "}
          {(selectedMovie?.runtime || 0) % 60}m
        </p>

        {/* Curved Screen */}
        <div className="w-full max-w-4xl mb-16 relative perspective-[1000px] flex justify-center">
          {/* The Screen Itself */}
          <div className="w-[80%] h-24 bg-gradient-to-b from-white/40 to-transparent rounded-[50%] border-t-4 border-white/60 shadow-[0_-10px_60px_rgba(255,255,255,0.2)] transform rotate-x-[20deg] scale-x-110 origin-bottom" />

          <div className="absolute top-8 text-zinc-500 text-sm tracking-[0.8em] uppercase font-bold opacity-50">
            IMAX SCREEN
          </div>
        </div>

        {/* Seats Grid Container - Scrollable on small screens */}
        <div className="w-full overflow-x-auto pb-12 flex justify-center">
          <div className="grid gap-y-3 gap-x-1 mx-auto min-w-max">
            {ROW_LABELS.map((rowLabel) => (
              <div key={rowLabel} className="flex items-center gap-3">
                {/* Row Label Left */}
                <div className="w-6 text-center text-zinc-600 font-mono text-xs font-bold">
                  {rowLabel}
                </div>

                <div className="flex gap-1.5">
                  {Array.from({ length: COLS }).map((_, index) => {
                    const colNum = index + 1;
                    const seatId = `${rowLabel}${colNum}`;
                    const isOccupied = occupiedSeats.has(seatId);
                    const isSelected = localSelectedSeat === seatId;

                    // Add a gap for the aisle (3-8-3 layout)
                    const isAisle = colNum === 4 || colNum === 12;

                    return (
                      <React.Fragment key={seatId}>
                        {isAisle && <div className="w-8" />}
                        <motion.button
                          whileHover={
                            !isOccupied ? { scale: 1.2, zIndex: 10 } : {}
                          }
                          whileTap={!isOccupied ? { scale: 0.9 } : {}}
                          onClick={() => handleSeatClick(seatId)}
                          disabled={isOccupied}
                          className={`
                                relative group w-8 h-8 sm:w-9 sm:h-9 rounded-t-lg rounded-b-md flex items-center justify-center transition-all shadow-md
                                ${
                                  isOccupied
                                    ? "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-zinc-700/50"
                                    : isSelected
                                    ? "bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.6)] z-10 border border-red-500"
                                    : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white border border-zinc-600/30"
                                }
                              `}
                        >
                          <Armchair
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            strokeWidth={2.5}
                          />

                          {/* Tooltip */}
                          {!isOccupied && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                              {seatId}
                            </div>
                          )}
                        </motion.button>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Row Label Right */}
                <div className="w-6 text-center text-zinc-600 font-mono text-xs font-bold">
                  {rowLabel}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-zinc-700 rounded flex items-center justify-center">
              <Armchair className="w-3 h-3" />
            </div>{" "}
            Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-600 rounded flex items-center justify-center text-white">
              <Armchair className="w-3 h-3" />
            </div>{" "}
            Selected
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-zinc-800 rounded flex items-center justify-center text-zinc-600">
              <Armchair className="w-3 h-3" />
            </div>{" "}
            Occupied
          </div>
        </div>

        {/* Confirm Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: localSelectedSeat ? 1 : 0,
            y: localSelectedSeat ? 0 : 20,
          }}
          onClick={handleConfirm}
          disabled={!localSelectedSeat}
          className="px-12 py-4 bg-red-600 text-white font-bold text-lg uppercase tracking-widest rounded-full hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Seat {localSelectedSeat}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SeatSelection;
