"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCinemaStore } from "@/store/useCinemaStore";
import {
  Play,
  Pause,
  LogOut,
  Coffee,
  Bell,
  Plus,
  Trash2,
  Check,
  ShoppingBag,
  Utensils,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lock,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import { getTMDBImageUrl } from "@/components/ui/MoviePoster";

const Review = dynamic(() => import("@/components/Review"), {
  loading: () => (
    <div className="animate-pulse bg-zinc-900 h-96 w-full rounded-3xl" />
  ),
});

export default function WatchPage() {
  const router = useRouter();
  const { selectedMovie, timer, setTimer, resetFlow, setCurtainVisible } =
    useCinemaStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  // Panel States
  const [isMissionOpen, setIsMissionOpen] = useState(true);
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState<"none" | "mission" | "shop">(
    "none"
  );

  // Shop State
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  // To-Do List State
  const [todos, setTodos] = useState<
    { id: number; text: string; completed: boolean }[]
  >([]);
  const [newTodo, setNewTodo] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  // Refs for background timer accuracy and notifications
  const timerRef = useRef(timer);
  const initialDuration = useRef(
    selectedMovie ? selectedMovie.runtime * 60 : 0
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Open curtains on mount
    const timer = setTimeout(() => {
      setCurtainVisible(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [setCurtainVisible]);

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  // Request Notification Permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Redirect if no movie selected
  useEffect(() => {
    if (isHydrated && !selectedMovie) {
      router.push("/");
    }
  }, [isHydrated, selectedMovie, router]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0 && selectedMovie) {
      setIsFinished(true);
      setIsPlaying(false);

      // Native Notification for background
      if (document.hidden && Notification.permission === "granted") {
        new Notification("Marvel Cinema Focus", {
          body: "Movie Finished! Time to review.",
        });
      }

      // Get poster URL with fallback
      const posterUrl = getTMDBImageUrl(selectedMovie.poster_path, "w342");

      // SweetAlert for foreground
      Swal.fire({
        title: "THE END",
        text: "Credits are rolling. You stayed focused!",
        imageUrl: posterUrl || undefined,
        imageWidth: posterUrl ? 150 : 0,
        imageAlt: "Movie Poster",
        background: "#121212",
        color: "#ffffff",
        confirmButtonText: "WRITE REVIEW",
        confirmButtonColor: "#e62429",
        backdrop: `rgba(0,0,0,0.9)`,
      });
    }
    return () => clearInterval(interval);
  }, [isPlaying, timer, setTimer, selectedMovie]);

  // Format time
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Background Notification Logic
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying && !isFinished) {
        // Send immediate notification when switching tabs
        if (Notification.permission === "granted") {
          try {
            new Notification("Marvel Cinema Focus", {
              body: `Focus Mode Active: ${formatTime(
                timerRef.current
              )} remaining.`,
              silent: true,
              icon: "/icon.png", // Assuming an icon exists, or fallback
            });
          } catch (e) {
            console.error("Notification failed:", e);
          }
        }
      }
    };

    // Notify every 15 minutes if hidden
    const backgroundInterval = setInterval(() => {
      if (document.hidden && isPlaying && !isFinished) {
        if (timerRef.current % 900 === 0 && timerRef.current > 0) {
          if (Notification.permission === "granted") {
            new Notification("Marvel Cinema Focus", {
              body: `${formatTime(timerRef.current)} remaining. Keep it up!`,
              tag: "timer-update",
            });
          }
        }
      }
    }, 1000);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(backgroundInterval);
    };
  }, [isPlaying, isFinished]);

  // Format time (Moved up)
  // const formatTime = ... (already defined above)

  // To-Do Functions
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
    setNewTodo("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  // Shop Functions
  const buyTime = (minutes: number, itemName: string) => {
    // Check if 15 minutes have passed
    const elapsedSeconds = initialDuration.current - timer;
    if (elapsedSeconds < 15 * 60) {
      Swal.fire({
        title: "Shop Closed",
        text: "Concession stand opens 15 minutes after the movie starts.",
        icon: "info",
        background: "#121212",
        color: "#ffffff",
        confirmButtonColor: "#e62429",
      });
      return;
    }

    // Check max items (2 unique items)
    if (purchasedItems.length >= 2) {
      Swal.fire({
        title: "Limit Reached",
        text: "You can only purchase a maximum of 2 items per session.",
        icon: "warning",
        background: "#121212",
        color: "#ffffff",
        confirmButtonColor: "#e62429",
      });
      return;
    }

    if (purchasedItems.includes(itemName)) {
      Swal.fire({
        title: "Already Purchased",
        text: "You have already purchased this item.",
        icon: "warning",
        background: "#121212",
        color: "#ffffff",
        confirmButtonColor: "#e62429",
      });
      return;
    }

    const secondsToReduce = minutes * 60;
    if (timer <= 0) return;

    const newTime = Math.max(0, timer - secondsToReduce);
    setTimer(newTime);
    setPurchasedItems([...purchasedItems, itemName]);

    Swal.fire({
      title: "Purchase Successful!",
      text: `You bought ${itemName}. Time reduced by ${minutes} minutes.`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      background: "#121212",
      color: "#ffffff",
      iconColor: "#e62429",
    });
  };

  const handleExit = () => {
    Swal.fire({
      title: "SO... THAT'S IT?",
      html: `
        <div class="text-zinc-300 mb-6 text-sm leading-relaxed px-2 md:px-4">
          <p class="mb-4">
            Wow. We barely started and you're already crawling back to the TikTok? I guess <span class="text-white font-bold">300 videos of brainrot</span> are more important than your actual life goals.
          </p>
          <p>
            Don't let me stop you from <span class="text-red-500 font-bold">frying your brain</span>. I know how much you love staring at a screen like a zombie.
          </p>
        </div>
        <div class="text-red-400 font-bold italic text-sm bg-red-900/10 p-4 rounded-xl border border-red-900/30 mx-2 md:mx-6">
          Your focus span is shorter than a movie trailer. Sad.
        </div>
      `,
      imageUrl: "/deadpool3.webp",
      imageWidth: 250,
      imageAlt: "Deadpool",
      showCancelButton: true,
      confirmButtonColor: "#e62429",
      cancelButtonColor: "#27272a",
      confirmButtonText: "I CHOOSE THE BRAINROT",
      cancelButtonText: "FINE, I'LL FOCUS!",
      background: "#0a0a0a",
      color: "#ffffff",
      reverseButtons: true,
      backdrop: `rgba(0,0,0,0.9)`,
      customClass: {
        popup:
          "border-2 border-red-900/50 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.3)]",
        title: "font-black uppercase tracking-wider text-red-500 text-2xl",
        confirmButton: "font-bold tracking-widest px-6 py-3 rounded-full",
        cancelButton:
          "font-bold tracking-widest px-6 py-3 rounded-full border border-white/10 hover:bg-white/5",
        image:
          "drop-shadow-xl animate-tear-through hover:scale-110 transition-transform duration-300",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        resetFlow();
        router.push("/");
      }
    });
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (!isHydrated) return null;
  if (!selectedMovie) return null;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white flex flex-col items-center justify-center">
      {/* Background Backdrop */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <Image
          src={`https://image.tmdb.org/t/p/w1280${selectedMovie.backdrop_path}`}
          alt="Backdrop"
          fill
          priority
          unoptimized
          className="object-cover opacity-70"
          sizes="100vw"
        />
      </div>

      {/* Top Controls */}
      <div className="absolute top-6 left-6 z-30">
        <button
          onClick={handleExit}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full hover:bg-red-600/80 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Exit Cinema
        </button>
      </div>

      {/* LEFT PANEL: To-Do List */}
      <div
        className={`
          flex flex-col gap-4 transition-all duration-300
          xl:absolute xl:left-8 xl:top-24 xl:bottom-8 xl:w-80 xl:z-30 xl:pointer-events-none xl:flex
          ${
            mobileMenu === "mission"
              ? "fixed inset-0 z-50 bg-black/95 p-6 pt-24 pointer-events-auto"
              : "hidden"
          }
        `}
      >
        <motion.div
          animate={{
            height: isMissionOpen || mobileMenu === "mission" ? "auto" : "60px",
          }}
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col overflow-hidden pointer-events-auto transition-all duration-300 h-full xl:h-auto"
          style={{
            maxHeight:
              isMissionOpen || mobileMenu === "mission" ? "80vh" : "60px",
          }}
        >
          <div
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => {
              if (window.innerWidth < 1280) {
                setMobileMenu("none");
              } else {
                setIsMissionOpen(!isMissionOpen);
              }
            }}
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-red-500" />
              Mission Objectives
            </h3>
            <div className="p-1 rounded-full hover:bg-white/10">
              {mobileMenu === "mission" ? (
                <X className="w-5 h-5" />
              ) : isMissionOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>

          <AnimatePresence>
            {(isMissionOpen || mobileMenu === "mission") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Add Todo */}
                <form onSubmit={addTodo} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add new task..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>

                {/* Todo List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar min-h-[200px]">
                  {todos.length === 0 ? (
                    <div className="text-center text-zinc-500 text-sm py-8 italic">
                      No active missions.
                      <br />
                      Add tasks to stay focused!
                    </div>
                  ) : (
                    todos.map((todo) => (
                      <motion.div
                        key={todo.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`group flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          todo.completed
                            ? "bg-white/5 border-transparent opacity-50"
                            : "bg-zinc-900/50 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            todo.completed
                              ? "bg-red-600 border-red-600 text-white"
                              : "border-zinc-500 hover:border-red-500"
                          }`}
                        >
                          {todo.completed && <Check className="w-3 h-3" />}
                        </button>
                        <span
                          className={`flex-1 text-sm truncate ${
                            todo.completed
                              ? "line-through text-zinc-500"
                              : "text-zinc-200"
                          }`}
                        >
                          {todo.text}
                        </span>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* RIGHT PANEL: Shop */}
      <div
        className={`
          flex flex-col gap-4 transition-all duration-300
          xl:absolute xl:right-8 xl:top-24 xl:bottom-8 xl:w-80 xl:z-30 xl:pointer-events-none xl:flex
          ${
            mobileMenu === "shop"
              ? "fixed inset-0 z-50 bg-black/95 p-6 pt-24 pointer-events-auto"
              : "hidden"
          }
        `}
      >
        <motion.div
          animate={{
            height: isShopOpen || mobileMenu === "shop" ? "auto" : "60px",
          }}
          className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col pointer-events-auto transition-all duration-300 h-full xl:h-auto"
          style={{
            maxHeight: isShopOpen || mobileMenu === "shop" ? "80vh" : "60px",
          }}
        >
          <div
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => {
              if (window.innerWidth < 1280) {
                setMobileMenu("none");
              } else {
                setIsShopOpen(!isShopOpen);
              }
            }}
          >
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-yellow-500" />
              Concession Stand
            </h3>
            <div className="p-1 rounded-full hover:bg-white/10">
              {mobileMenu === "shop" ? (
                <X className="w-5 h-5" />
              ) : isShopOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>

          <AnimatePresence>
            {(isShopOpen || mobileMenu === "shop") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col"
              >
                <p className="text-xs text-zinc-400 mb-4">
                  Buy items to reduce time. <br />
                  <span className="text-yellow-500/80">
                    Opens after 15 mins. Max 2 items.
                  </span>
                </p>

                <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2">
                  {/* Shop Items */}
                  {[
                    { name: "Cola", time: 5, icon: Coffee, price: "5m" },
                    { name: "Popcorn", time: 10, icon: Utensils, price: "10m" },
                    { name: "Nachos", time: 15, icon: Utensils, price: "15m" },
                    {
                      name: "Combo Meal",
                      time: 30,
                      icon: Utensils,
                      price: "30m",
                    },
                  ].map((item) => {
                    const isLocked = initialDuration.current - timer < 15 * 60;
                    const isMaxed = purchasedItems.length >= 2;
                    const isBought = purchasedItems.includes(item.name);
                    const isDisabled = isLocked || isMaxed || isBought;

                    return (
                      <button
                        key={item.name}
                        onClick={() => buyTime(item.time, item.name)}
                        disabled={isDisabled}
                        className={`w-full flex items-center justify-between p-3 border rounded-xl transition-all group relative overflow-hidden ${
                          isDisabled
                            ? "bg-zinc-900/30 border-white/5 opacity-60 cursor-not-allowed"
                            : "bg-zinc-900/50 hover:bg-zinc-800 border-white/5 hover:border-yellow-500/50"
                        }`}
                      >
                        {isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                            <Lock className="w-4 h-4 text-zinc-500" />
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg transition-colors ${
                              isBought
                                ? "bg-green-500/20 text-green-500"
                                : "bg-white/5 group-hover:bg-yellow-500/20 group-hover:text-yellow-500"
                            }`}
                          >
                            {isBought ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <item.icon className="w-4 h-4" />
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-sm text-zinc-200 group-hover:text-white">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-zinc-500">
                              {isBought ? "Purchased" : "Reduces time"}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-bold text-sm ${
                            isBought ? "text-green-500" : "text-yellow-500"
                          }`}
                        >
                          {isBought ? "DONE" : `-${item.price}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="relative z-20 w-full max-w-4xl px-4 flex flex-col items-center">
        {!isFinished ? (
          <>
            {/* Movie Title */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-center mb-8 tracking-tighter uppercase"
            >
              {selectedMovie.title}
            </motion.h1>

            {/* Timer Display */}
            <div className="relative mb-12">
              <div className="text-[12vw] md:text-[8rem] font-mono font-bold leading-none tracking-widest tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 drop-shadow-2xl">
                {formatTime(timer)}
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-6">
              <button
                onClick={handleTogglePlay}
                className={`group flex items-center gap-3 px-8 py-4 backdrop-blur-md border rounded-full transition-all ${
                  isPlaying
                    ? "bg-white/10 border-white/20 hover:bg-red-600/20 hover:border-red-600"
                    : "bg-red-600 border-red-500 hover:bg-red-500"
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-6 h-6 fill-current" />
                    <span className="font-bold tracking-widest">
                      TOILET BREAK
                    </span>
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    <span className="font-bold tracking-widest">
                      RESUME MOVIE
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Notification Hint */}
            <div className="mt-8 flex items-center gap-2 text-zinc-400 text-sm">
              <Bell className="w-4 h-4" />
              <span>Background notifications active</span>
            </div>
          </>
        ) : (
          <Review />
        )}
      </div>
      {/* Mobile Bottom Controls */}
      <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center gap-4 xl:hidden pointer-events-none">
        <button
          onClick={() =>
            setMobileMenu(mobileMenu === "mission" ? "none" : "mission")
          }
          className={`p-4 rounded-full shadow-lg backdrop-blur-md border transition-all pointer-events-auto ${
            mobileMenu === "mission"
              ? "bg-red-600 text-white border-red-500"
              : "bg-black/60 text-zinc-400 border-white/10"
          }`}
        >
          <CheckCircle2 className="w-6 h-6" />
        </button>

        <button
          onClick={() => setMobileMenu(mobileMenu === "shop" ? "none" : "shop")}
          className={`p-4 rounded-full shadow-lg backdrop-blur-md border transition-all pointer-events-auto ${
            mobileMenu === "shop"
              ? "bg-yellow-600 text-white border-yellow-500"
              : "bg-black/60 text-zinc-400 border-white/10"
          }`}
        >
          <ShoppingBag className="w-6 h-6" />
        </button>
      </div>
    </main>
  );
}
