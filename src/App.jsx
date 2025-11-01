import React, { useEffect, useState } from "react";

// Collage component for displaying a grid of images
function Collage({ images, title, subtitle }) {
  return (
    <section className="mb-20">
      {(title || subtitle) && (
        <div className="mb-8 text-center">
          {title && <h2 className="text-2xl font-semibold mb-2">{title}</h2>}
          {subtitle && <p className="text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
        {images.map((img, idx) => (
          <div key={img.image + idx} className="rounded-xl overflow-hidden shadow hover:shadow-lg transition">
            <img
              src={img.image}
              alt={img.title || "Artwork"}
              className="object-cover w-full h-72"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
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
    // Adjust path if your manifest is elsewhere (e.g. public/art_manifest.json)
    fetch("/src/art_manifest.json")
      .then((r) => r.json())
      .then((data) => setImages(data));
  }, []);

  // Divide images into collages (customize slice ranges as needed)
  const collage1 = images.slice(0, 12);
  const collage2 = images.slice(12, 24);
  const collage3 = images.slice(24, 36);

  return (
    <main className="bg-white text-black min-h-screen font-sans flex flex-col items-center">
      <Header />
      <section id="work" className="max-w-5xl w-full px-4 py-16">
        <Collage images={collage1} title="Collage 1" subtitle="First set of images" />
        <Collage images={collage2} title="Collage 2" subtitle="Second set of images" />
        <Collage images={collage3} title="Collage 3" subtitle="Third set of images" />
      </section>
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
