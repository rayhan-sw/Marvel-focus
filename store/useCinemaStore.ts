import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Movie } from "@/types";

type SelectionMode = "manual" | "random" | null;
type BookingStep =
  | "mode-select"
  | "browsing"
  | "spinning"
  | "seats"
  | "ticket"
  | "watching";

interface CinemaState {
  movies: Movie[];
  selectedMovie: Movie | null;
  selectedSeat: string | null;
  selectionMode: SelectionMode;
  timer: number; // in seconds
  bookingStep: BookingStep;
  isCurtainVisible: boolean;

  // Actions
  setMovies: (movies: Movie[]) => void;
  setSelectedMovie: (movie: Movie) => void;
  setSelectedSeat: (seat: string) => void;
  setSelectionMode: (mode: SelectionMode) => void;
  setTimer: (time: number) => void;
  setBookingStep: (step: BookingStep) => void;
  setCurtainVisible: (visible: boolean) => void;
  resetFlow: () => void;
}

export const useCinemaStore = create<CinemaState>()(
  persist(
    (set) => ({
      movies: [],
      selectedMovie: null,
      selectedSeat: null,
      selectionMode: null,
      timer: 0,
      bookingStep: "mode-select",
      isCurtainVisible: false,

      setMovies: (movies) => set({ movies }),
      setSelectedMovie: (movie) =>
        set({ selectedMovie: movie, timer: movie.runtime * 60 }),
      setSelectedSeat: (seat) => set({ selectedSeat: seat }),
      setSelectionMode: (mode) => set({ selectionMode: mode }),
      setTimer: (time) => set({ timer: time }),
      setBookingStep: (step) => set({ bookingStep: step }),
      setCurtainVisible: (visible) => set({ isCurtainVisible: visible }),
      resetFlow: () =>
        set({
          selectedMovie: null,
          selectedSeat: null,
          selectionMode: null,
          timer: 0,
          bookingStep: "mode-select",
        }),
    }),
    {
      name: "marvel-cinema-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedMovie: state.selectedMovie,
        timer: state.timer,
        bookingStep: state.bookingStep,
        selectionMode: state.selectionMode,
        selectedSeat: state.selectedSeat,
      }),
    }
  )
);
