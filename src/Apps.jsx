import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function AnimatedCollage({ images, range = 60 }) {
  // Group images into rows of 3 for visual jumbling
  const rows = [];
  for (let i = 0; i < images.length; i += 3) {
    rows.push(images.slice(i, i + 3));
  }

  return (
    <div className="mb-24">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-7 justify-center mb-0">
          {row.map((img, idx) => {
            const ref = useRef(null);
            const { scrollYProgress } = useScroll({
              target: ref,
              offset: ["start end", "end start"]
            });

            const y = useTransform(
              scrollYProgress,
              [0, 1],
              [-range - (rowIdx + idx) * 8, range + (rowIdx + idx) * 10]
            );
            const r = useTransform(
              scrollYProgress,
              [0, 1],
              [-10 + idx * 3, 10 - idx * 3]
            );
            const s = useTransform(
              scrollYProgress,
              [0, 1],
              [0.96, 1.08 - idx * 0.02]
            );

            return (
              <motion.div
                ref={ref}
                style={{
                  y,
                  rotate: r,
                  scale: s
                }}
                className="relative will-change-transform select-none"
                key={img.image}
              >
                <motion.img
                  src={img.image}
                  alt={img.title || "Artwork"}
                  style={{ scale: s, rotate: r }}
                  className="shadow-2xl rounded-xl pointer-events-none max-w-[min(32vw,320px)] h-auto"
                  loading="lazy"
                />
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Header() {
  return (
    <header className="w-full py-12 flex flex-col items-center">
      <h1 className="font-bold text-5xl sm:text-7xl mb-2 tracking-tight">Anna Mills</h1>
      <p className="text-base sm:text-lg font-light mb-8">Unique Visual Experiences for Curious People</p>
      <nav className="flex space-x-8 text-sm uppercase tracking-wide">
        <a href="#work" className="hover:underline">Work</a>
        <a href="#about" className="hover:underline">About</a>
        <a href="#contact" className="hover:underline">Contact</a>
      </nav>
    </header>
  );
}

function About() {
  return (
    <section id="about" className="max-w-xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">About</h2>
      <p className="text-base text-gray-700">
        Anna Mills is a studio for unique visual experiences. We design from instinct and arrange for delight, inviting the viewer to participate through motion and playful discovery.
      </p>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="max-w-xl mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Contact</h2>
      <p className="text-base text-gray-700">
        Say hello at <a href="mailto:mark@heneniart.com" className="underline">mark@heneniart.com</a>.
      </p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 mt-12 text-center text-xs text-gray-400">
      <p>
        © {new Date().getFullYear()} Anna Mills.<br />
        Website code by Heneni.<br />
        <a href="mailto:mark@heneniart.com" className="underline">Email me</a>
      </p>
    </footer>
  );
}

export default function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("/art_manifest.json")
      .then((r) => r.json())
      .then((data) => setImages(data));
  }, []);

  // Divide images into animated collages (adjust slice ranges for your art)
  const collage1 = images.slice(0, 12);
  const collage2 = images.slice(12, 24);
  const collage3 = images.slice(24, 36);

  return (
    <main className="bg-white text-black min-h-screen font-sans flex flex-col items-center">
      <Header />
      <section id="work" className="max-w-5xl w-full px-4 py-16">
        <AnimatedCollage images={collage1} />
        <AnimatedCollage images={collage2} />
        <AnimatedCollage images={collage3} />
      </section>
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
