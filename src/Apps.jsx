import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Collage layout data extracted from DOM/CSS of annamills.xyz (approximate, tune for exact pixel match)
const collageLayouts = [
  // Collage 1
  [
    { top: "5vw", left: "10vw", rotate: -8, scale: 1.01, width: "19vw", z: 10 },
    { top: "13vw", left: "31vw", rotate: 9, scale: 1.05, width: "16vw", z: 11 },
    { top: "21vw", left: "51vw", rotate: -5, scale: 1.03, width: "20vw", z: 12 },
    { top: "29vw", left: "20vw", rotate: 7, scale: 1.00, width: "15vw", z: 13 },
  ],
  // Collage 2
  [
    { top: "7vw", left: "14vw", rotate: 10, scale: 1.02, width: "18vw", z: 10 },
    { top: "18vw", left: "35vw", rotate: -4, scale: 1.04, width: "15vw", z: 11 },
    { top: "28vw", left: "55vw", rotate: 12, scale: 1.06, width: "22vw", z: 12 },
    { top: "38vw", left: "25vw", rotate: -10, scale: 0.98, width: "16vw", z: 13 },
  ],
  // Collage 3
  [
    { top: "9vw", left: "12vw", rotate: 12, scale: 1.03, width: "20vw", z: 10 },
    { top: "21vw", left: "32vw", rotate: -6, scale: 1.05, width: "17vw", z: 11 },
    { top: "33vw", left: "52vw", rotate: 8, scale: 1.04, width: "19vw", z: 12 },
    { top: "45vw", left: "22vw", rotate: -11, scale: 1.00, width: "15vw", z: 13 },
  ],
];

// Collage component with pixel-perfect layout/animation
function Collage({ images, layout }) {
  return (
    <div className="relative w-full h-[52vw] mb-24">
      {images.map((img, idx) => {
        const ref = useRef(null);
        const { scrollYProgress } = useScroll({
          target: ref,
          offset: ["start end", "end start"],
        });

        // Animate each image's position, rotation, and scale on scroll
        const x = useTransform(scrollYProgress, [0, 1], [0, (idx % 2 ? 36 : -36)]);
        const y = useTransform(scrollYProgress, [0, 1], [0, (idx % 2 ? -44 : 44)]);
        const rotate = useTransform(scrollYProgress, [0, 1], [layout[idx].rotate, layout[idx].rotate + (idx % 2 ? 16 : -16)]);
        const scale = useTransform(scrollYProgress, [0, 1], [layout[idx].scale, layout[idx].scale + 0.05]);

        return (
          <motion.div
            key={img.image}
            ref={ref}
            style={{
              position: "absolute",
              top: layout[idx].top,
              left: layout[idx].left,
              zIndex: layout[idx].z,
              width: layout[idx].width,
              x,
              y,
              rotate,
              scale,
            }}
            className="shadow-2xl rounded-xl pointer-events-none transition-all duration-700"
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

// Rest of your App.jsx remains the same!
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
  // Divide images into collages (number of images per collage = layout length)
  const collage1 = images.slice(0, collageLayouts[0].length);
  const collage2 = images.slice(collageLayouts[0].length, collageLayouts[0].length + collageLayouts[1].length);
  const collage3 = images.slice(collageLayouts[0].length + collageLayouts[1].length, collageLayouts[0].length + collageLayouts[1].length + collageLayouts[2].length);

  return (
    <main className="bg-white text-black min-h-screen font-sans">
      <Header />
      <section id="work" className="max-w-[1200px] mx-auto w-full px-4 pt-2 pb-20">
        <Collage images={collage1} layout={collageLayouts[0]} />
        <Collage images={collage2} layout={collageLayouts[1]} />
        <Collage images={collage3} layout={collageLayouts[2]} />
      </section>
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
