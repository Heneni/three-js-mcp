// src/App.jsx  — replace the entire file with this
import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Header() {
  return (
    <header className="header">
      <h1 className="header-title">ANNA MILLS</h1>
      <nav className="header-nav">
        <a href="#about">ABOUT</a>
        <a href="#work">WORK</a>
        <a href="#contact">CONTACT</a>
      </nav>
    </header>
  );
}

function LeftRail() {
  return (
    <aside className="rail">
      <p>Welcome to my website! Do stick around. Scrolling is encouraged here, it makes things happen.</p>
      <div style={{ marginTop: 8, textTransform: "uppercase", fontWeight: 700 }}>PLAY!</div>
    </aside>
  );
}

function Collage({ images }) {
  // Four-card collage tuned to match the reference site’s proportions and overlap.
  // Each card has explicit vw-based dimensions, rotation, and z for “stack 1/2/3/4”.
  const cards = useMemo(
    () => [
      // stack 1
      { top: "0vw",   left: "28vw", width: "28vw", height: "28vw", rotate: 0,  z: 2, r: 24 },
      // stack 2
      { top: "3vw",   left: "64vw", width: "20vw", height: "20vw", rotate: 0,  z: 3, r: 20 },
      // stack 3
      { top: "34vw",  left: "43vw", width: "34vw", height: "20vw", rotate: 0,  z: 4, r: 22 },
      // stack 4
      { top: "38vw",  left: "66vw", width: "24vw", height: "24vw", rotate: 16, z: 5, r: 26 },
    ],
    []
  );

  const wrapRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // entrance
      gsap.fromTo(
        ".collage-card",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power2.out" }
      );

      // subtle parallax scrub per card
      gsap.utils.toArray(".collage-card").forEach((el, i) => {
        gsap.to(el, {
          yPercent: i % 2 === 0 ? -6 : -12,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="collage" ref={wrapRef} aria-label="Collage">
      {images.slice(0, cards.length).map((img, i) => {
        const c = cards[i];
        return (
          <div
            key={img.image + i}
            className="collage-card"
            style={{
              top: c.top,
              left: c.left,
              width: c.width,
              height: c.height,
              zIndex: c.z,
              borderRadius: `${c.r}px`,
              transform: `rotate(${c.rotate}deg)`,
            }}
          >
            <img src={img.image} alt={img.title || "Artwork"} draggable={false} />
          </div>
        );
      })}
    </div>
  );
}

function WorkPinned({ images }) {
  const pinRef = useRef(null);
  const imgRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // pin the section while scrubbing
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: "bottom top",
        pin: ".work-pin",
        pinSpacing: false,
        anticipatePin: 1,
      });

      // entrance for title/copy
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: pinRef.current, start: "top 70%", toggleActions: "play none none reverse" },
        }
      );

      // feature image settles as user scrolls
      gsap.fromTo(
        imgRef.current,
        { scale: 1.08, y: 20, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: { trigger: pinRef.current, start: "top top", end: "bottom top", scrub: true },
        }
      );
    }, pinRef);
    return () => ctx.revert();
  }, []);

  const feature = images[3]?.image || images[8]?.image || images[0]?.image || "";

  return (
    <section id="work" className="work-pin-wrap" ref={pinRef}>
      <div className="work-pin">
        <div className="work-card">
          <div>
            <h2 className="work-title" ref={titleRef}>Wolf • Alice • White Horses</h2>
            <p className="work-copy">A scrolling composition where type, gesture, and motion meet. As you move, the work relaxes into place.</p>
          </div>
          <img ref={imgRef} className="work-image" src={feature} alt="Feature" />
        </div>
      </div>
    </section>
  );
}

function SimpleGrid({ images }) {
  return (
    <section className="section">
      <div className="container">
        <div className="grid">
          {images.map((img, i) => (
            <img key={img.image + i} src={img.image} alt={img.title || "Artwork"} loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("/art_manifest.json")
      .then((r) => r.json())
      .then((data) => {
        const seen = new Set();
        const clean = data.filter((d) => d && d.image && !seen.has(d.image) && seen.add(d.image));
        setImages(clean);
      })
      .catch(() => setImages([]));
  }, []);

  return (
    <main>
      <Header />

      <section className="section">
        <div className="container intro">
          <LeftRail />
          <Collage images={images} />
        </div>
      </section>

      <WorkPinned images={images} />

      <section className="section">
        <div className="container">
          <SimpleGrid images={images.slice(27, 63)} />
          <SimpleGrid images={images.slice(63, 99)} />
        </div>
      </section>

      <section id="about" className="section">
        <div className="container">
          <h3>About</h3>
          <p>Heneni is a studio for unique visual experiences. We design from instinct and arrange for delight, inviting the viewer to participate through motion and playful discovery.</p>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container">
          <h3>Contact</h3>
          <p>Say hello at <a href="mailto:mark@heneniart.com">mark@heneniart.com</a>.</p>
        </div>
      </section>

      <div className="footer-spacer" />
    </main>
  );
}
