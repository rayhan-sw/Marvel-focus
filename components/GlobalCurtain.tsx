"use client";

import React from "react";
import { useCinemaStore } from "@/store/useCinemaStore";
import Curtain from "./Curtain";

const GlobalCurtain = () => {
  const { isCurtainVisible } = useCinemaStore();

  return <Curtain isClosed={isCurtainVisible} />;
};

export default GlobalCurtain;
