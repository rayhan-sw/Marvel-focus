import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { useCinemaStore } from "@/store/useCinemaStore";
import { useRouter } from "next/navigation";
import { formatRuntime } from "@/components/ui/MoviePoster";
import Swal from "sweetalert2";

const Review = () => {
  const router = useRouter();
  const { selectedMovie, resetFlow } = useCinemaStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = () => {
    // Simulate submission
    Swal.fire({
      title: "Review Logged!",
      text: "Your focus session has been recorded in the multiverse.",
      icon: "success",
      background: "#121212",
      color: "#ffffff",
      confirmButtonColor: "#e62429",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      resetFlow();
      router.push("/");
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.8 }}
      className="relative w-full max-w-lg mx-auto"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-3xl blur opacity-30 animate-pulse" />

      <div className="relative flex flex-col items-center p-8 md:p-10 bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-900/20 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center w-full">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-900/50">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
            Session Complete
          </h2>
          <p className="text-zinc-400 mb-8 text-center leading-relaxed">
            You maintained focus for{" "}
            <span className="text-white font-bold">
              {formatRuntime(selectedMovie?.runtime)}
            </span>{" "}
            watching{" "}
            <span className="text-red-500 font-bold">
              {selectedMovie?.title}
            </span>
            .
          </p>

          {/* Star Rating */}
          <div className="flex gap-3 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-all duration-200 ${
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                      : "text-zinc-700 fill-zinc-900/50"
                  }`}
                  strokeWidth={1.5}
                />
              </motion.button>
            ))}
          </div>

          {/* Review Textarea */}
          <div className="w-full mb-8 group">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-red-500 transition-colors">
              Focus Log
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What did you accomplish during this session?"
              className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all resize-none text-sm leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={rating === 0}
            className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg ${
              rating > 0
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-900/20 cursor-pointer"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            <span>Submit Review</span>
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Review;
