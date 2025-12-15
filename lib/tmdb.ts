import axios from "axios";
import { Movie, TMDBMovieDetail } from "@/types";
import { STATIC_MARVEL_DATA } from "@/lib/marvelData";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const fetchMarvelMovies = async (): Promise<Movie[]> => {
  // Use STATIC_MARVEL_DATA as the source of truth for titles, runtimes, and phases.
  // We only use the API to fetch updated images (poster/backdrop) if available.

  if (!API_KEY || API_KEY === "your_api_key_here") {
    console.warn("No valid TMDB API Key found. Using static data only.");
    return STATIC_MARVEL_DATA;
  }

  try {
    // Fetch details for ALL defined Marvel IDs in parallel to get images
    const moviePromises = STATIC_MARVEL_DATA.map(async (staticMovie: Movie) => {
      try {
        // Skip fetching for placeholder movies or non-numeric IDs
        if (
          staticMovie.type === "placeholder" ||
          typeof staticMovie.id !== "number"
        ) {
          return staticMovie;
        }

        const response = await tmdbClient.get<TMDBMovieDetail>(
          `/movie/${staticMovie.id}`
        );
        const data = response.data;

        // Merge API data (images) with Static data (runtime/title/phase)
        // We prioritize Static Data for Runtime/Title as per user request
        if (data) {
          return {
            ...staticMovie,
            poster_path: data.poster_path || staticMovie.poster_path,
            backdrop_path: data.backdrop_path || staticMovie.backdrop_path,
            // Optional: Update overview if API has it
            overview: data.overview || staticMovie.overview,
          };
        }
        return staticMovie;
      } catch (error) {
        // If API fails for a specific movie, just return the static data
        return staticMovie;
      }
    });

    const results = await Promise.all(moviePromises);
    return results;
  } catch (error) {
    console.error("Error fetching Marvel movies:", error);
    return STATIC_MARVEL_DATA;
  }
};

// Helper untuk mendapatkan full image URL
export const getImageUrl = (
  path: string,
  size: "w500" | "original" = "w500"
) => {
  if (!path) return "/placeholder-movie.png"; // Add a placeholder if needed
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
