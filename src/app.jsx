import React, { useEffect, useState } from 'react';

function Collage({ images }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 mb-14">
      {images.map((img, idx) => (
        <div key={img.image + idx} className="rounded-xl overflow-hidden shadow hover:shadow-lg transition">
          <img src={img.image} alt={img.title || "Artwork"} className="object-cover w-full h-72" loading="lazy" />
        </div>
      ))}
    </section>
  );
}

export default function App() {
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetch("/public/art_manifest.json")
      .then(r => r.json())
      .then(data => setImages(data));
  }, []);
  
  // Divide images for multiple collages
  const collage1 = images.slice(0, 12);
  const collage2 = images.slice(12, 24);
  const collage3 = images.slice(24, 36);

  return (
    <main className="bg-white text-black min-h-screen font-sans flex flex-col items-center">
      {/* Header and navigation */}
      {/* ...header code... */}
      
      <section id="work" className="max-w-5xl w-full px-4 py-16">
        <Collage images={collage1} />
        <Collage images={collage2} />
        <Collage images={collage3} />
      </section>
      {/* About and Contact sections as before */}
    </main>
  );
}
