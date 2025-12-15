export interface Movie {
  id: number | string;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  runtime: number;
  phase: number;
  type?: "movie" | "placeholder";
}

export interface MarvelPhase {
  name: string;
  phase: number;
  movies: Movie[];
}

export interface TMDBMovieDetail {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  runtime: number;
}
