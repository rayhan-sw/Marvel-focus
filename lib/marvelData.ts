/**
 * Marvel Cinematic Universe - Movies Only Dataset
 * STRICTLY MOVIES ONLY - No TV Shows, No Series, No Specials
 */

import { Movie } from "@/types";

export interface MarvelPhase {
  id: string;
  name: string;
  phase: number;
  movies: Movie[];
}

// PHASE 1: THE BEGINNING (2008-2012)
const PHASE_1_MOVIES: Movie[] = [
  {
    id: 1726,
    title: "Iron Man",
    phase: 1,
    runtime: 126,
    release_date: "2008-05-02",
    poster_path: "/78lPtwv72eTNqFW9CO8osuKVyJe.jpg",
    backdrop_path: "/cyecB7godJ6kNHGONFjUyVN9OX5.jpg",
    overview:
      "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
  },
  {
    id: 1724,
    title: "The Incredible Hulk",
    phase: 1,
    runtime: 112,
    release_date: "2008-06-13",
    poster_path: "/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg",
    backdrop_path: "/xfBnQ4mgf1jWlCWgzdpFc8ALI7l.jpg",
    overview:
      "Scientist Bruce Banner scours the globe for an antidote to the unbridled force of rage within him: the Hulk.",
  },
  {
    id: 10138,
    title: "Iron Man 2",
    phase: 1,
    runtime: 124,
    release_date: "2010-05-07",
    poster_path: "/6WBeq4fCfn7AN0o21W9qNcRF7l9.jpg",
    backdrop_path: "/jxdScc7AjBpNaDbj5Yp1n76kdBz.jpg",
    overview:
      "With the world now aware of his dual life as the armored superhero Iron Man, billionaire inventor Tony Stark faces pressure from the government, the press, and the public.",
  },
  {
    id: 10195,
    title: "Thor",
    phase: 1,
    runtime: 115,
    release_date: "2011-05-06",
    poster_path: "/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg",
    backdrop_path: "/cDJ61O1STtbWNBwefuqVrRe3d7l.jpg",
    overview:
      "Against his father Odin's will, The Mighty Thor—a powerful but arrogant warrior god—recklessly reignites an ancient war.",
  },
  {
    id: 1771,
    title: "Captain America: The First Avenger",
    phase: 1,
    runtime: 124,
    release_date: "2011-07-22",
    poster_path: "/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg",
    backdrop_path: "/3lbTiIN8cVonMUBtsq8vhyIPXJF.jpg",
    overview:
      "During World War II, Steve Rogers is a sickly man from Brooklyn who's transformed into super-soldier Captain America to aid in the war effort.",
  },
  {
    id: 24428,
    title: "The Avengers",
    phase: 1,
    runtime: 143,
    release_date: "2012-05-04",
    poster_path: "/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
    backdrop_path: "/kwUQFeFXOOpgloMgZaadhzkbTI4.jpg",
    overview:
      "When an unexpected enemy emerges and threatens global safety and security, Nick Fury gathers a team of superheroes to form The Avengers.",
  },
];

// PHASE 2: EXPANSION (2013-2015)
const PHASE_2_MOVIES: Movie[] = [
  {
    id: 68721,
    title: "Iron Man 3",
    phase: 2,
    runtime: 130,
    release_date: "2013-05-03",
    poster_path: "/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg",
    backdrop_path: "/n9X2DKItL3V0yq1q1jrk8z5GAkS.jpg",
    overview:
      "When Tony Stark's world is torn apart by a formidable terrorist called the Mandarin, he starts an odyssey of rebuilding and retribution.",
  },
  {
    id: 76338,
    title: "Thor: The Dark World",
    phase: 2,
    runtime: 112,
    release_date: "2013-11-08",
    poster_path: "/wp6OxE4poJ4G7c0U2ZIXasTSMR7.jpg",
    backdrop_path: "/3FweBee0xZoY77uO1bhUOlQorNH.jpg",
    overview:
      "Thor fights to restore order across the cosmos, but an ancient race led by the vengeful Malekith returns to plunge the universe back into darkness.",
  },
  {
    id: 100402,
    title: "Captain America: The Winter Soldier",
    phase: 2,
    runtime: 136,
    release_date: "2014-04-04",
    poster_path: "/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg",
    backdrop_path: "/c3GKRLHvLpZ0oMHzVNfn8eVT3FN.jpg",
    overview:
      "After the cataclysmic events in New York with The Avengers, Steve Rogers lives quietly in Washington, D.C. and struggles to adjust to the modern world.",
  },
  {
    id: 118340,
    title: "Guardians of the Galaxy",
    phase: 2,
    runtime: 121,
    release_date: "2014-08-01",
    poster_path: "/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg",
    backdrop_path: "/wY4E3V8XpR7aCMU9ulZe4PPFt8T.jpg",
    overview:
      "Light years from Earth, 26 years after being abducted, Peter Quill finds himself the prime target of a manhunt after discovering an orb wanted by Ronan the Accuser.",
  },
  {
    id: 99861,
    title: "Avengers: Age of Ultron",
    phase: 2,
    runtime: 141,
    release_date: "2015-05-01",
    poster_path: "/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg",
    backdrop_path: "/6tKvez1p0drtUXTMoksy3RVXy2G.jpg",
    overview:
      "When Tony Stark tries to jumpstart a dormant peacekeeping program, things go awry and Earth's Mightiest Heroes are put to the ultimate test.",
  },
  {
    id: 102899,
    title: "Ant-Man",
    phase: 2,
    runtime: 117,
    release_date: "2015-07-17",
    poster_path: "/rQRnQfUl3kfp78nCWq8Ks04vnq1.jpg",
    backdrop_path: "/kvXLZqY0Ngl1XSw7EaMQO0C1CCj.jpg",
    overview:
      "Armed with the astonishing ability to shrink in scale but increase in strength, con-man Scott Lang must embrace his inner hero.",
  },
];

// PHASE 3: INFINITY SAGA (2016-2019)
const PHASE_3_MOVIES: Movie[] = [
  {
    id: 271110,
    title: "Captain America: Civil War",
    phase: 3,
    runtime: 147,
    release_date: "2016-05-06",
    poster_path: "/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg",
    backdrop_path: "/6VrvuVIjjXcXpFkEN507PXNMX8A.jpg",
    overview:
      "Following the events of Age of Ultron, the collective governments of the world pass an act designed to regulate all superhuman activity.",
  },
  {
    id: 284052,
    title: "Doctor Strange",
    phase: 3,
    runtime: 115,
    release_date: "2016-11-04",
    poster_path: "/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
    backdrop_path: "/xfBnQ4mgf1jWlCWgzdpFc8ALI7l.jpg",
    overview:
      "After his career is destroyed, a brilliant but arrogant surgeon gets a new lease on life when a sorcerer takes him under her wing.",
  },
  {
    id: 283995,
    title: "Guardians of the Galaxy Vol. 2",
    phase: 3,
    runtime: 136,
    release_date: "2017-05-05",
    poster_path: "/y4MBh0EjBlMuOzv9axM4qJlmhzz.jpg",
    backdrop_path: "/aJn9XeesqsrSLKcHfHP4u5985hn.jpg",
    overview:
      "The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father.",
  },
  {
    id: 315635,
    title: "Spider-Man: Homecoming",
    phase: 3,
    runtime: 133,
    release_date: "2017-07-07",
    poster_path: "/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg",
    backdrop_path: "/vc8bCGjdVp0UbMNLzHnHSLRbBWQ.jpg",
    overview:
      "Following the events of Captain America: Civil War, Peter Parker attempts to balance his life in high school with his career as Spider-Man.",
  },
  {
    id: 284053,
    title: "Thor: Ragnarok",
    phase: 3,
    runtime: 130,
    release_date: "2017-11-03",
    poster_path: "/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg",
    backdrop_path: "/kaIfm5ryEOwYg8mLbq8HkPuM1Fo.jpg",
    overview:
      "Thor is imprisoned on the other side of the universe and finds himself in a race against time to get back to Asgard to stop Ragnarok.",
  },
  {
    id: 284054,
    title: "Black Panther",
    phase: 3,
    runtime: 134,
    release_date: "2018-02-16",
    poster_path: "/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
    backdrop_path: "/6ELJEzQJ3Y45HczvreC3dg0GV5R.jpg",
    overview:
      "King T'Challa returns home to Wakanda to assume the throne, but when a powerful old enemy reappears, T'Challa's mettle as king is tested.",
  },
  {
    id: 299536,
    title: "Avengers: Infinity War",
    phase: 3,
    runtime: 149,
    release_date: "2018-04-27",
    poster_path: "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    backdrop_path: "/lmZFxXgJE3vgrciwuDib0N8CfQo.jpg",
    overview:
      "As the Avengers and their allies continue to protect the world, a new danger emerges from the cosmic shadows: Thanos.",
  },
  {
    id: 363088,
    title: "Ant-Man and the Wasp",
    phase: 3,
    runtime: 118,
    release_date: "2018-07-06",
    poster_path: "/rv1AWImgx386ULjcf62VYaW8zSt.jpg",
    backdrop_path: "/6P3c80EOm7BodndGBUAqVlwcL1Y.jpg",
    overview:
      "Just when his time under house arrest is about to end, Scott Lang puts his freedom at risk to help Hope van Dyne and Dr. Hank Pym.",
  },
  {
    id: 299537,
    title: "Captain Marvel",
    phase: 3,
    runtime: 123,
    release_date: "2019-03-08",
    poster_path: "/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg",
    backdrop_path: "/w2PMyoyLU22YvrGK3smVM9fW1jj.jpg",
    overview:
      "The story follows Carol Danvers as she becomes one of the universe's most powerful heroes when Earth is caught in the middle of a galactic war.",
  },
  {
    id: 299534,
    title: "Avengers: Endgame",
    phase: 3,
    runtime: 181,
    release_date: "2019-04-26",
    poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdrop_path: "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    overview:
      "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.",
  },
  {
    id: 429617,
    title: "Spider-Man: Far From Home",
    phase: 3,
    runtime: 129,
    release_date: "2019-07-02",
    poster_path: "/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg",
    backdrop_path: "/5myQbDzw3l8K9yofUXRJ4UTVgam.jpg",
    overview:
      "Peter Parker and his friends go on a summer trip to Europe, but they will hardly be able to rest—Peter will have to agree to help Nick Fury.",
  },
];

// PHASE 4: MULTIVERSE SAGA (2021-2022)
const PHASE_4_MOVIES: Movie[] = [
  {
    id: 497698,
    title: "Black Widow",
    phase: 4,
    runtime: 134,
    release_date: "2021-07-09",
    poster_path: "/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg",
    backdrop_path: "/keIxh0wPr2Ymj0Btjh4gW7JJ89e.jpg",
    overview:
      "Natasha Romanoff, aka Black Widow, confronts the darker parts of her ledger when a dangerous conspiracy tied to her past arises.",
  },
  {
    id: 566525,
    title: "Shang-Chi and the Legend of the Ten Rings",
    phase: 4,
    runtime: 132,
    release_date: "2021-09-03",
    poster_path: "/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg",
    backdrop_path: "/cinER0ESG0eJ49kXlExM0MEWGxW.jpg",
    overview:
      "Shang-Chi must confront the past he thought he left behind when he is drawn into the web of the mysterious Ten Rings organization.",
  },
  {
    id: 524434,
    title: "Eternals",
    phase: 4,
    runtime: 156,
    release_date: "2021-11-05",
    poster_path: "/bcCBq9N1EMo3daNIjWJ8kYvrQm6.jpg",
    backdrop_path: "/c6H7Z4u73ir3cIoCteuhJh7UCAR.jpg",
    overview:
      "The Eternals, a race of immortal beings with superhuman powers, have secretly lived on Earth for thousands of years reuniting to protect humanity.",
  },
  {
    id: 634649,
    title: "Spider-Man: No Way Home",
    phase: 4,
    runtime: 148,
    release_date: "2021-12-17",
    poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop_path: "/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
    overview:
      "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero.",
  },
  {
    id: 453395,
    title: "Doctor Strange in the Multiverse of Madness",
    phase: 4,
    runtime: 126,
    release_date: "2022-05-06",
    poster_path: "/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
    backdrop_path: "/wcKFYIiVDvRURrzglV9kGu7fpfY.jpg",
    overview:
      "Doctor Strange, with the help of mystical allies, travels into the multiverse to face a mysterious new adversary.",
  },
  {
    id: 616037,
    title: "Thor: Love and Thunder",
    phase: 4,
    runtime: 118,
    release_date: "2022-07-08",
    poster_path: "/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg",
    backdrop_path: "/p1F51Lvj3sMopG948F5HsBbl43C.jpg",
    overview:
      "Thor enlists the help of Valkyrie, Korg and ex-girlfriend Jane Foster to fight Gorr the God Butcher, who intends to make the gods extinct.",
  },
  {
    id: 505642,
    title: "Black Panther: Wakanda Forever",
    phase: 4,
    runtime: 161,
    release_date: "2022-11-11",
    poster_path: "/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    backdrop_path: "/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg",
    overview:
      "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje fight to protect Wakanda from intervening world powers in the wake of King T'Challa's death.",
  },
];

// PHASE 5: MULTIVERSE SAGA CONTINUES (2023-2025)
const PHASE_5_MOVIES: Movie[] = [
  {
    id: 640146,
    title: "Ant-Man and the Wasp: Quantumania",
    phase: 5,
    runtime: 124, // 2h 4m
    release_date: "2023-02-17",
    poster_path: "/ngl2FKBlU4fhbdsrtdom9LVLBXw.jpg",
    backdrop_path: "/3CxUndGhUcZdt1Zggjdb2HkLLQX.jpg",
    overview:
      "Scott Lang and Hope Van Dyne, along with Hank Pym and Janet Van Dyne, explore the Quantum Realm, where they interact with strange creatures and embark on an adventure that goes beyond the limits of what they thought was possible.",
  },
  {
    id: 447365,
    title: "Guardians of the Galaxy Vol. 3",
    phase: 5,
    runtime: 150, // 2h 30m
    release_date: "2023-05-05",
    poster_path: "/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
    backdrop_path: "/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg",
    overview:
      "Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and one of their own - a mission that could mean the end of the Guardians if not successful.",
  },
  {
    id: 609681,
    title: "The Marvels",
    phase: 5,
    runtime: 105, // 1h 45m
    release_date: "2023-11-10",
    poster_path: "/9GBhzXMFjgcZ3FdR9w3bUMMTps5.jpg",
    backdrop_path: "/pwGmXVKUgKN13psUjlhC9zBcq1o.jpg",
    overview:
      "Carol Danvers gets her powers entangled with those of Kamala Khan and Monica Rambeau, forcing them to work together to save the universe.",
  },
  {
    id: 533535,
    title: "Deadpool & Wolverine",
    phase: 5,
    runtime: 128, // 2h 8m
    release_date: "2024-07-26",
    poster_path: "/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop_path: "/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
    overview:
      "Deadpool is offered a place in the MCU by the Time Variance Authority, but instead recruits a reluctant Wolverine to save his universe from extinction.",
  },
  {
    id: 822119,
    title: "Captain America: Brave New World",
    phase: 5,
    runtime: 118, // 1h 58m
    release_date: "2025-02-14",
    poster_path: "/pzIddUEMWhWzfvLI3TwxUG2wGoi.jpg",
    backdrop_path: "/gsVC7HnCZ9sxvDG14MhzYTeFLDG.jpg",
    overview:
      "Sam Wilson, in his first solo outing as Captain America, finds himself in the middle of an international incident and must stop a global plot orchestrated by the Leader and President Thaddeus Ross.",
  },
  {
    id: 986056,
    title: "Thunderbolts*",
    phase: 5,
    runtime: 127, // 2h 7m
    release_date: "2025-05-02",
    poster_path: "/jkYJxrEDFqk6r9mekMfuXt0HgVn.jpg",
    backdrop_path: "/tn2cRUfEe6hrlFu0tPPVFNKCulU.jpg",
    overview:
      "A group of anti-heroes and reformed villains, including Yelena Belova, Bucky Barnes, and Red Guardian, are sent on a covert mission by the government that is not what it seems.",
  },
];

// PHASE 6: SECRET WARS (2025+)
const PHASE_6_MOVIES: Movie[] = [
  {
    id: 617126,
    title: "The Fantastic Four: First Steps",
    phase: 6,
    runtime: 115, // 1h 55m (estimated)
    release_date: "2025-07-25",
    poster_path: "/zDFQkDFdirI2hiJwHI87WxlDkza.jpg",
    backdrop_path: "/pz4ZmXPs4hLWLWAcnP6EBZL9mQw.jpg",
    overview:
      "Set against the vibrant backdrop of a 1960s-inspired, retro-futuristic world, Marvel's First Family takes center stage as they balance their lives as heroes with family dynamics while facing a cosmic threat from Galactus and the Silver Surfer.",
  },
  {
    id: "coming-soon-1",
    title: "Avengers: Doomsday",
    phase: 6,
    runtime: 180,
    release_date: "2026-05-01",
    poster_path: "",
    backdrop_path: "",
    overview:
      "The Avengers face their greatest threat yet as Doctor Doom rises to power.",
    type: "placeholder",
  },
  {
    id: "coming-soon-2",
    title: "Avengers: Secret Wars",
    phase: 6,
    runtime: 180,
    release_date: "2027-05-07",
    poster_path: "",
    backdrop_path: "",
    overview: "The ultimate culmination of the Multiverse Saga.",
    type: "placeholder",
  },
];

// EXPORTS
export const MARVEL_PHASES: MarvelPhase[] = [
  { id: "phase-1", name: "Phase 1", phase: 1, movies: PHASE_1_MOVIES },
  { id: "phase-2", name: "Phase 2", phase: 2, movies: PHASE_2_MOVIES },
  { id: "phase-3", name: "Phase 3", phase: 3, movies: PHASE_3_MOVIES },
  { id: "phase-4", name: "Phase 4", phase: 4, movies: PHASE_4_MOVIES },
  { id: "phase-5", name: "Phase 5", phase: 5, movies: PHASE_5_MOVIES },
  { id: "phase-6", name: "Phase 6", phase: 6, movies: PHASE_6_MOVIES },
];

// Flat array of all movies
export const STATIC_MARVEL_DATA: Movie[] = MARVEL_PHASES.flatMap(
  (phase) => phase.movies
);

// Helper functions
export const getMoviesByPhase = (phaseNumber: number): Movie[] => {
  const phase = MARVEL_PHASES.find((p) => p.phase === phaseNumber);
  return phase?.movies || [];
};

export const getAvailablePhases = (): number[] => {
  return MARVEL_PHASES.map((p) => p.phase);
};

export const getTotalMovieCount = (): number => {
  return STATIC_MARVEL_DATA.filter((m) => m.type !== "placeholder").length;
};

export const getFeaturedMovie = (): Movie => {
  // Return Captain America: Civil War as featured
  return PHASE_3_MOVIES[0];
};
