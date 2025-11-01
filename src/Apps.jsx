import React, { useEffect, useState } from "react";

// This component matches the visible collage layout (non-uniform, overlapping, and rotated)
function Collage({ images }) {
  // Hard-coded positions and transforms for 4 images (matching the visible layout in the screenshot)
  const collageLayout = [
    // Top left image — large, upright
    {
      top: '0vw',
      left: '28vw',
      width: '28vw',
      height: '28vw',
      rotate: 0,
      z: 2,
      borderRadius: '24px'
    },
    // Top right image — medium, upright
    {
      top: '3vw',
      left: '64vw',
      width: '20vw',
      height: '20vw',
      rotate: 0,
      z: 3,
      borderRadius: '20px'
    },
    // Middle left image — medium, upright
    {
      top: '34vw',
      left: '43vw',
      width: '34vw',
      height: '20vw',
      rotate: 0,
      z: 4,
      borderRadius: '22px'
    },
    // Bottom right image — rotated, large
    {
      top: '38vw',
      left: '66vw',
      width: '24vw',
      height: '24vw',
      rotate: 16,
      z: 5,
      borderRadius: '26px'
    }
  ];

  return (
    <div className="relative w-full h-[62vw]">
      {images.slice(0, collageLayout.length).map((img, idx) => {
        const layout = collageLayout[idx];
        return (
          <div
            key={img.image}
            style={{
              position: 'absolute',
              top: layout.top,
              left: layout.left,
              width: layout.width,
              height: layout.height,
              zIndex: layout.z,
              borderRadius: layout.borderRadius,
              transform: `rotate(${layout.rotate}deg)`
            }}
            className="shadow-2xl bg-white"
          >
            <img
              src={img.image}
              alt={img.title || "Artwork"}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: layout.borderRadius
              }}
              draggable={false}
            />
          </div>
        );
      })}
    </div>
  );
}

function Header() {
  return (
    <header className="w-full pt-16 pb-6 flex flex-col items-center">
      <h1 style={{
        fontFamily: 'sans-serif',
        fontWeight: 900,
        fontSize: '4rem',
        letterSpacing: '0.05em',
        textAlign: 'center'
      }}>ANNA MILLS</h1>
      <div style={{ margin: "1.5rem 0 1.5rem 0" }}>
        <nav className="flex space-x-12 text-base font-semibold uppercase tracking-wider mb-4" style={{ justifyContent: "center" }}>
          <a href="#about" style={{ fontFamily: "Inter, Arial, sans-serif", color: "#222", marginRight: "2rem" }}>ABOUT</a>
          <a href="#work" style={{ fontFamily: "Inter, Arial, sans-serif", color: "#222", marginRight: "2rem" }}>WORK</a>
          <a href="#contact" style={{ fontFamily: "Inter, Arial, sans-serif", color: "#222" }}>CONTACT</a>
        </nav>
      </div>
    </header>
  );
}

function Welcome() {
  return (
    <div className="flex flex-col items-center mt-6">
      <p style={{
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: "1rem",
        color: "#222",
        textAlign: "center",
        marginBottom: "0.5rem"
      }}>
        Welcome to my website! Do stick around. Scrolling is encouraged here, it makes things happen.
      </p>
      <div style={{
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: "1rem",
        color: "#222",
        textAlign: "center",
        marginTop: "0.5rem"
      }}>
        PLAY!
      </div>
    </div>
  );
}

function App() {
  const [images, setImages] = useState([]);
  useEffect(() => {
    fetch("/art_manifest.json")
      .then((r) => r.json())
      .then((data) => setImages(data));
  }, []);

  return (
    <main className="bg-white text-black min-h-screen font-sans">
      <Header />
      <div className="flex flex-row w-full max-w-[1400px] mx-auto mt-10">
        <div style={{ width: "28vw", minWidth: "320px", display: "flex", flexDirection: "column", alignItems: "center", marginRight: "2vw" }}>
          <Welcome />
        </div>
        <div style={{ flex: "1 1 0", position: "relative" }}>
          <Collage images={images} />
        </div>
      </div>
    </main>
  );
}

export default App;
