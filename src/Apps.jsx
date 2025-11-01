import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ----------- COLLAGE LAYOUTS (pixel-perfect, per annamills.xyz) -----------
// Each collage uses a hard-coded layout for exact positioning and animation
const collage1Layout = [
  // Example positions, must match annamills.xyz layout (edit these if you need more/fewer images)
  { top: "2vw", left: "10vw", rotate: -7, scale: 1.02, width: "19vw", z: 10 },
  { top: "10vw", left: "30vw", rotate: 12, scale: 1.04, width: "16vw", z: 11 },
  { top: "18vw", left: "50vw", rotate: -6, scale: 1.01, width: "20vw", z: 12 },
  { top: "26vw", left: "20vw", rotate: 7, scale: 0.98, width: "15vw", z: 13 },
  { top: "34vw", left: "40vw", rotate: -3, scale: 1.05, width: "21vw", z: 14 },
  { top: "42vw", left: "60vw", rotate: 14, scale: 0.99, width: "17vw", z: 15 },
];

const collage2Layout = [
  { top: "4vw", left: "15vw", rotate: 9, scale: 1.01, width: "18vw", z: 10 },
  { top: "14vw", left: "35vw", rotate: -5, scale: 1.03, width: "15vw", z: 11 },
  { top: "24vw", left: "55vw", rotate: 14, scale: 1.06, width: "22vw", z: 12 },
  { top: "34vw", left: "25vw", rotate: -11, scale: 0.99, width: "16vw", z: 13 },
  { top: "44vw", left: "45vw", rotate: 2, scale: 1.05, width: "21vw", z: 14 },
  { top: "54vw", left: "65vw", rotate: -6, scale: 1.01, width: "17vw", z: 15 },
];

const collage3Layout = [
  { top: "6vw", left: "12vw", rotate: 11, scale: 1.02, width: "20vw", z: 10 },
  { top: "18vw", left: "32vw", rotate: -8, scale: 1.04, width: "17vw", z: 11 },
  { top: "30vw", left: "52vw", rotate: 7, scale: 1.03, width: "19vw", z: 12 },
  { top: "42vw", left: "22vw", rotate: -12, scale: 1.00, width: "15vw", z: 13 },
  { top: "54vw", left: "42vw", rotate: 5, scale: 1.06, width: "21vw", z: 14 },
  { top: "66vw", left: "62vw", rotate: -7, scale: 1.02, width: "16vw", z: 15 },
];

// ----------- COLLAGE COMPONENT (pixel-perfect) -----------
function Collage({ images, layout }) {
  return (
    <div className="relative w-full h-[64vw] mb-24">
      {images.map((img, idx) => {
        const ref = useRef(null);
        const { scrollYProgress } = useScroll({
          target: ref,
          offset: ["start end", "end start"],
        });

        // Animate each image's position, rotation, and scale on scroll (tuned for pixel-perfect motion)
        const x = useTransform(scrollYProgress, [0, 1], [0, (idx % 2 ? 40 : -40)]);
        const y = useTransform(scrollYProgress, [0, 1], [0, (idx % 2 ? -60 : 60)]);
        const rotate = useTransform(scrollYProgress, [0, 1], [layout[idx].rotate, layout[idx].rotate + (idx % 2 ? 16 : -16)]);
        const scale = useTransform(scrollYProgress, [0, 1], [layout[idx].scale, layout[idx].scale + 0.06]);

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

// ----------- REST OF APP.JSX (UNCHANGED) -----------
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

// ----------- MAIN APP.JSX EXPORT (UPDATE COLLAGE USAGE) -----------
export default function App() {
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetch("/art_manifest.json")
      .then((r) => r.json())
      .then((data) => setImages(data));
  }, []);
  // Divide images into collages (matching number in each layout)
  const collage1 = images.slice(0, collage1Layout.length);
  const collage2 = images.slice(collage1Layout.length, collage1Layout.length + collage2Layout.length);
  const collage3 = images.slice(collage1Layout.length + collage2Layout.length, collage1Layout.length + collage2Layout.length + collage3Layout.length);

  return (
    <main className="bg-white text-black min-h-screen font-sans">
      <Header />
      <section id="work" className="max-w-[1200px] mx-auto w-full px-4 pt-2 pb-20">
        <Collage images={collage1} layout={collage1Layout} />
        <Collage images={collage2} layout={collage2Layout} />
        <Collage images={collage3} layout={collage3Layout} />
      </section>
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
