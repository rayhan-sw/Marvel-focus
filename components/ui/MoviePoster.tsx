"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Film } from "lucide-react";

interface MoviePosterProps {
  posterPath: string | null | undefined;
  title: string;
  className?: string;
  size?: "w200" | "w300" | "w500" | "original";
  showFallbackTitle?: boolean;
}

/**
 * Reusable MoviePoster component with built-in fallback handling.
 * If the poster fails to load, displays a gradient placeholder with the movie title.
 */
export const MoviePoster = ({
  posterPath,
  title,
  className = "",
  size = "w500",
  showFallbackTitle = true,
}: MoviePosterProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // If no poster path or image failed to load, show fallback
  if (!posterPath || imageError) {
    return (
      <div
        className={`flex flex-col items-center justify-center p-4 ${className}`}
        style={{
          background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
        }}
      >
        <Film className="w-12 h-12 text-zinc-600 mb-3" />
        {showFallbackTitle && (
          <h3 className="text-white text-sm md:text-base font-bold text-center leading-tight px-2">
            {title}
          </h3>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className} overflow-hidden`}>
      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse z-10" />
      )}
      <Image
        src={`https://image.tmdb.org/t/p/${size}${posterPath}`}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`object-cover transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </div>
  );
};

/**
 * Helper function to get full TMDB image URL with fallback
 */
export const getTMDBImageUrl = (
  path: string | null | undefined,
  size: "w200" | "w300" | "w500" | "original" = "w500"
): string | null => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

/**
 * Helper to format runtime from minutes to "Xh Ym" format
 */
export const formatRuntime = (minutes: number | null | undefined): string => {
  if (!minutes || minutes <= 0) return "TBA";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export default MoviePoster;
