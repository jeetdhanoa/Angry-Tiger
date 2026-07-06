"use client";

import { useEffect } from "react";
import { initMotion } from "@/lib/motion";

export default function Motion() {
  useEffect(() => {
    initMotion();
  }, []);
  return null;
}
