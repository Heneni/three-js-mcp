// src/main.jsx  — replace the entire file with this
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

// Lenis smooth scrolling
import Lenis from "@studio-freight/lenis";

const root = createRoot(document.getElementById("root"));
root.render(<App />);

// Initialize Lenis once and hook into requestAnimationFrame
const lenis = new Lenis({ duration: 1.1, smoothWheel: true, smoothTouch: false });
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
