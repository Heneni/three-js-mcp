import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function Collage({ images, seed = 0 }) {
  // This matches the "jumbled" layout of annamills.xyz: images offset, some overlaps, animated on scroll
  return (
    <div className="relative flex flex-wrap justify-center gap-0 py-16" style={{ minHeight: "52vw" }}>
      {images.map((img, idx) => {
        const ref = useRef(null);
        // Slightly different values for each image
        const { scrollYProgress } = useScroll({
          target: ref,
          offset: ["start end", "end start"],
        });
        // Use seed and idx to shuffle positions
        const x = useTransform(scrollYProgress, [0, 1], [
          -60 + ((idx + seed) % 6) * 30,
          60 - ((idx + seed) % 6) * 30,
        ]);
        const y = useTransform(scrollYProgress, [0, 1], [
          -40 + ((idx + seed) % 5) * 18,
          40 - ((idx + seed) % 7) * 18,
        ]);
        const rotate = useTransform(scrollYProgress, [0, 1], [
          -7 + ((idx + seed) % 8) * 2,
          7 - ((idx + seed) % 5) * 2,
        ]);
        const scale = useTransform(scrollYProgress, [0, 1], [
          1 - ((idx + seed) % 3) * 0.04,
          1.04 + ((idx + seed) % 3) * 0.02,
        ]);
        // For pixel-perfect overlap, set width and some negative margins
        let classNames =
          "absolute shadow-2xl rounded-xl pointer-events-none transition-all duration-700";
        classNames += " " +
          [
            "w-[19vw] h-auto",
            "w-[16vw] h-auto",
            "w-[20vw] h-auto",
            "w-[18vw] h-auto",
            "w-[15vw] h-auto",
            "w-[21vw] h-auto",
            "w-[17vw] h-auto",
            "w-[16vw] h-auto",
            "w-[22vw] h-auto",
          ][idx % 9];
        // For pixel-perfect positioning, use inline style for offset
        const basePositions = [
          { top: "2vw", left: "10vw" },
          { top: "6vw", left: "24vw" },
          { top: "0vw", left: "36vw" },
          { top: "10vw", left: "53vw" },
          { top: "22vw", left: "29vw" },
          { top: "16vw", left: "42vw" },
          { top: "26vw", left: "18vw" },
          { top: "32vw", left: "38vw" },
          { top: "38vw", left: "56vw" },
        ];
        const style = {
          ...basePositions[idx % basePositions.length],
        };
        return (
          <motion.div
            key={img.image}
            ref={ref}
            style={{
              ...style,
              x,
              y,
              rotate,
              scale,
              zIndex: 10 + idx,
            }}
            className={classNames}
          >
            <motion.img
              src={img.image}
              alt={img.title || "Artwork"}
              loading="lazy"
              className="rounded-xl w-full h-auto"
              draggable={false}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

function Header() {
  return (
    <header className="w-full pt-16 pb-6 flex flex-col items-center">
      <h1 className="font-black text-[clamp(3rem,10vw,7rem)] tracking-tight leading-none mb-2">Anna Mills</h1>
      <p className="text-lg font-light mb-12 tracking-wide text-gray-700">Unique Visual Experiences for Curious People</p>
      <nav className="flex space-x-12 text-base font-semibold uppercase tracking-wider mb-4">
        <a href="#work" className="hover:opacity-60 transition-opacity">Work</a>
        <a href="#about" className="hover:opacity-60 transition-opacity">About</a>
        <a href="#contact" className="hover:opacity-60 transition-opacity">Contact</a>
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
  // Divide images into collages (adjust slice ranges for your art)
  const collage1 = images.slice(0, 9);
  const collage2 = images.slice(9, 18);
  const collage3 = images.slice(18, 27);

  return (
    <main className="bg-white text-black min-h-screen font-sans">
      <Header />
      <section id="work" className="max-w-[1200px] mx-auto w-full px-4 pt-2 pb-20">
        <Collage images={collage1} seed={0} />
        <Collage images={collage2} seed={100} />
        <Collage images={collage3} seed={200} />
      </section>
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
