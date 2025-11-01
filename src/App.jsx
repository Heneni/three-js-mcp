import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ————————————————————————————————
// LEFT RAIL (sticky) — matches proportions of annamills.xyz
// ————————————————————————————————
function LeftRail() {
  return (
    <aside
      className="fixed left-[4vw] top-[6vh] w-[16vw] min-w-[180px] max-w-[260px] select-none"
      aria-label="Site intro"
    >
      <h1 className="leading-[0.9] tracking-tight mb-6">
        <span className="block text-[5.8vw] min-[1200px]:text-[70px] font-black">ANNA</span>
        <span className="block text-[5.8vw] min-[1200px]:text-[70px] font-black">MILLS</span>
        <span className="block text-[2.4vw] min-[1200px]:text-[28px] font-medium opacity-80">DESIGN</span>
      </h1>

      <img
        src="/images/anna-portrait.png"
        alt=""
        className="w-[70%] mb-4 pointer-events-none"
        draggable="false"
      />

      <nav className="text-[11px] tracking-[0.08em] mb-3 space-x-5">
        <a href="#about" className="hover:opacity-60">ABOUT</a>
        <a href="#work" className="hover:opacity-60">WORK</a>
        <a href="#contact" className="hover:opacity-60">CONTACT</a>
      </nav>

      <p className="text-[11px] leading-tight mb-3 opacity-80">
        Welcome to my website! Do stick around.
        Scrolling is encouraged here, it makes things happen.
      </p>

      <button
        type="button"
        className="text-[11px] underline underline-offset-4 hover:opacity-70"
      >
        PLAY!
      </button>
    </aside>
  );
}

// ————————————————————————————————
// COLLAGE ENGINE
// Absolute positions in vw/vh for pixel-consistent stacks.
// Each item gets subtle x/y/rotate/scale transforms scrubbed to scroll.
// ————————————————————————————————

/**
 * Layout notes:
 *  • The reference site uses three obvious “stacks” that sit roughly
 *    center/right while the left rail is sticky. We fix widths in vw so
 *    proportions stay identical across breakpoints.
 *  • top/left are in viewport units; width is in vw; z is manual layer order.
 *  • rotate/scale are base values; tiny deltas are added from scroll.
 */
const stack1 = [
  { top: "6vh",  left: "32vw", width: "22vw", rotate: -4,  scale: 1.02, z: 10, src: "/images/stack/a1.jpg" },
  { top: "3vh",  left: "46vw", width: "18vw", rotate:  7,  scale: 1.00, z: 12, src: "/images/stack/a2.jpg" },
  { top: "18vh", left: "40vw", width: "20vw", rotate: -2,  scale: 1.04, z: 11, src: "/images/stack/a3.jpg" },
  { top: "26vh", left: "52vw", width: "16vw", rotate:  10, scale: 0.99, z: 13, src: "/images/stack/a4.jpg" }
];

const stack2 = [
  { top: "46vh", left: "34vw", width: "24vw", rotate:  5,  scale: 1.03, z: 10, src: "/images/stack/b1.jpg" },
  { top: "54vh", left: "49vw", width: "19vw", rotate: -8,  scale: 1.02, z: 12, src: "/images/stack/b2.jpg" },
  { top: "66vh", left: "41vw", width: "20vw", rotate:  2,  scale: 1.05, z: 11, src: "/images/stack/b3.jpg" },
  { top: "64vh", left: "57vw", width: "16vw", rotate:  12, scale: 1.00, z: 13, src: "/images/stack/b4.jpg" }
];

const stack3 = [
  { top: "98vh", left: "36vw", width: "22vw", rotate: -6,  scale: 1.01, z: 10, src: "/images/stack/c1.jpg" },
  { top: "104vh",left: "50vw", width: "18vw", rotate:  7,  scale: 1.00, z: 12, src: "/images/stack/c2.jpg" },
  { top: "118vh",left: "42vw", width: "20vw", rotate: -1,  scale: 1.04, z: 11, src: "/images/stack/c3.jpg" },
  { top: "128vh",left: "58vw", width: "16vw", rotate:  9,  scale: 0.99, z: 13, src: "/images/stack/c4.jpg" }
];

// A single collage “section” that scrubs item transforms to its own scroll range.
function CollageSection({ layout }) {
  const ref = useRef(null);

  // Tie transforms to the section’s vertical progress.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Small shared curves to keep the motion subtle and cohesive.
  const y      = useTransform(scrollYProgress, [0, 1], [0, -60]);    // gentle upward drift
  const x      = useTransform(scrollYProgress, [0, 1], [0,  40]);    // slight right push
  const rotAdd = useTransform(scrollYProgress, [0, 1], [0,  -6]);    // mild counter-twist
  const sclAdd = useTransform(scrollYProgress, [0, 1], [0.0, 0.04]); // tiny scale up

  return (
    <section ref={ref} className="relative h-[120vh] w-full">
      {layout.map((item, idx) => {
        // Stagger strength so deeper z-layers move a hair differently.
        const zMod = (idx % 3) * 0.25;

        const ix = useTransform(x,    v => v * (0.8 + zMod));
        const iy = useTransform(y,    v => v * (0.8 + zMod));
        const ir = useTransform(rotAdd, v => item.rotate + v * (0.9 + zMod));
        const is = useTransform(sclAdd, v => item.scale  + v * (1.0 + zMod));

        return (
          <motion.img
            key={idx}
            src={item.src}
            alt=""
            draggable="false"
            className="rounded-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.08)] will-change-transform"
            style={{
              position: "absolute",
              top: item.top,
              left: item.left,
              width: item.width,
              zIndex: item.z,
              x: ix,
              y: iy,
              rotate: ir,
              scale: is
            }}
          />
        );
      })}
    </section>
  );
}

export default function App() {
  return (
    <div id="work" className="min-h-[320vh] bg-[#fff] text-black">
      <LeftRail />

      {/* The scrollable canvas lives to the right of the rail; reserve that space */}
      <main className="ml-[24vw] pr-[6vw]">
        {/* Give a little breathing room above first stack to match the reference */}
        <div className="h-[10vh]" />

        <CollageSection layout={stack1} />
        <CollageSection layout={stack2} />
        <CollageSection layout={stack3} />

        {/* Below the stacks, drop into large project tiles (the reference shows this) */}
        <section className="relative w-full mt-[16vh]">
          <div className="grid grid-cols-2 gap-[6vw]">
            <img src="/images/tiles/tile1.jpg" alt="" className="rounded-[18px]" />
            <img src="/images/tiles/tile2.jpg" alt="" className="rounded-[18px]" />
          </div>
          <div className="h-[30vh]" />
        </section>
      </main>
    </div>
  );
}
