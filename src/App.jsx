import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 0.9, smoothTouch: false });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); };
  }, []);
}

async function fetchManifest() {
  const res = await fetch("/art_manifest.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load art_manifest.json");
  return res.json();
}

function sliceIntoStacks(items) {
  // Ensure items is always an array to prevent undefined/null errors
  if (!Array.isArray(items)) {
    return [[], [], []];
  }
  const a = [], b = [], c = [];
  items.forEach((it, i) => { (i % 3 === 0 ? a : i % 3 === 1 ? b : c).push(it); });
  return [a, b, c];
}

const layout1 = [
  { top: "4vh",  left: "8vw",  w: "w-22", rot: -2.6, z: 12 },
  { top: "0vh",  left: "26vw", w: "w-20", rot:  3.8, z: 11 },
  { top: "14vh", left: "18vw", w: "w-24", rot:  0.6, z: 13 },
  { top: "10vh", left: "40vw", w: "w-18", rot: -7.0, z: 10 },
  { top: "22vh", left: "30vw", w: "w-26", rot:  2.4, z: 14 },
  { top: "28vh", left: "46vw", w: "w-20", rot: -3.2, z: 9  }
];

const layout2 = [
  { top: "0vh",  left: "18vw", w: "w-26", rot: -1.4, z: 13 },
  { top: "8vh",  left: "38vw", w: "w-22", rot:  4.2, z: 12 },
  { top: "18vh", left: "10vw", w: "w-24", rot: -6.5, z: 11 },
  { top: "26vh", left: "28vw", w: "w-28", rot:  1.0, z: 14 },
  { top: "34vh", left: "50vw", w: "w-20", rot: -2.2, z: 10 },
  { top: "40vh", left: "12vw", w: "w-22", rot:  0.8, z: 9  }
];

const layout3 = [
  { top: "2vh",  left: "12vw", w: "w-24", rot:  2.2, z: 12 },
  { top: "12vh", left: "34vw", w: "w-26", rot: -4.8, z: 11 },
  { top: "24vh", left: "18vw", w: "w-22", rot:  0.0, z: 13 },
  { top: "28vh", left: "44vw", w: "w-24", rot: -6.0, z: 10 },
  { top: "36vh", left: "26vw", w: "w-28", rot:  1.6, z: 14 },
  { top: "44vh", left: "8vw",  w: "w-20", rot: -1.2, z: 9  }
];

function Card({ item, index, layout, scrollYProgress }) {
  const L = layout[index % layout.length];
  const y = useTransform(scrollYProgress, [0, 1], [index * -60, index * 140]);
  const r = useTransform(scrollYProgress, [0, 0.5, 1], [L.rot - 6, L.rot, L.rot + 6]);
  const s = useTransform(scrollYProgress, [0, 1], [0.98, 1.02]);
  
  return (
    <motion.a href={item.link || item.src || item.image || "#"} className={`card ${L.w}`}
      style={{ top: L.top, left: L.left, zIndex: L.z, y, rotate: r, scale: s }} target="_blank" rel="noreferrer">
      <img src={item.src || item.image} alt={item.title || "art"} />
    </motion.a>
  );
}

function Stack({ items, layout }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Defensive check: ensure items is an array before mapping
  const safeItems = Array.isArray(items) ? items : [];
  
  return (
    <div className="section">
      <div ref={ref} className="stack">
        {safeItems.map((item, i) => (
          <Card key={i} item={item} index={i} layout={layout} scrollYProgress={scrollYProgress} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  useLenis();
  // Initialize with a default array to prevent empty state that causes hook inconsistencies
  const defaultData = [
    { src: "https://picsum.photos/id/1015/1200/800" },
    { src: "https://picsum.photos/id/1016/1200/800" },
    { src: "https://picsum.photos/id/1021/1200/800" },
    { src: "https://picsum.photos/id/1025/1200/800" },
    { src: "https://picsum.photos/id/1035/1200/800" },
    { src: "https://picsum.photos/id/1040/1200/800" },
    { src: "https://picsum.photos/id/1050/1200/800" },
    { src: "https://picsum.photos/id/1060/1200/800" }
  ];
  const [data, setData] = useState(defaultData);
  useEffect(() => {
    fetchManifest().then((manifest) => {
      // Ensure the fetched data is an array before setting state
      if (Array.isArray(manifest) && manifest.length > 0) {
        setData(manifest);
      }
      // If manifest is invalid, keep the default data
    }).catch(() => {
      // On error, keep the default data (already set in useState)
    });
  }, []);
  const [s1, s2, s3] = useMemo(() => sliceIntoStacks(data), [data]);
  return (
    <div className="page">
      <aside className="sidebar">
        <div className="brand">ANNA<br/>MILLS</div>
        <div className="brand-sub">DESIGN</div>
        <nav className="nav" style={{ marginTop: 18 }}>
          <a href="#about">About</a><a href="#work"><strong>Work</strong></a><a href="#contact">Contact</a>
        </nav>
        <p className="copy">Welcome to my website! Do stick around. Scrolling is encouraged here, it makes things happen.</p>
        <a className="nav" style={{ fontWeight: 600 }} href="#play">Play!</a>
      </aside>
      <main className="stage">
        <Stack items={s1} layout={layout1} />
        <Stack items={s2} layout={layout2} />
        <Stack items={s3} layout={layout3} />
      </main>
    </div>
  );
}
