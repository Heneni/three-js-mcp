import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
const site = {
  nav: [
    { label: 'ABOUT', href: '#about' },
    { label: 'WORK', href: '#work' },
    { label: 'CONTACT', href: '#contact' },
  ],
}
const useParallax = (ref, range = [-60, 60]) => {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], range)
  const r = useTransform(scrollYProgress, [0, 1], [-6, 6])
  const s = useTransform(scrollYProgress, [0, 1], [0.96, 1.04])
  return { y, r, s }
}
const Card = ({ src, i, alt }) => {
  const ref = useRef(null)
  const { y, r, s } = useParallax(ref, [-40 - (i % 5) * 4, 40 + (i % 5) * 4])
  return (
    <motion.div ref={ref} style={{ y, rotate: r }} className="relative will-change-transform select-none">
      <motion.img src={src} alt={alt || 'Artwork'} loading="lazy" style={{ scale: s }}
        className="shadow-2xl rounded-xl pointer-events-none max-w-[min(40vw,360px)] h-auto md:max-w-[min(40vw,360px)]" />
    </motion.div>
  )
}
const LeftRail = () => (
  <aside className="hidden md:flex md:flex-col md:items-start md:gap-3 md:sticky md:top-8 md:self-start" aria-label="Site">
    <div className="inline-flex flex-col gap-3">
      <div className="text-5xl md:text-7xl font-black tracking-tight leading-none">HENENI</div>
      <div className="uppercase text-xs tracking-[0.3em] opacity-70">Unique Visual Experiences for Curious People</div>
    </div>
    <nav className="mt-10 flex flex-row md:flex-col gap-6 text-xs uppercase">
      {site.nav.map((n) => (<a key={n.href} href={n.href} className="hover:opacity-60 transition-opacity">{n.label}</a>))}
    </nav>
    <p className="mt-8 w-44 text-[11px] leading-relaxed opacity-80">Welcome to my website! Do stick around. Scrolling is encouraged here, it makes things happen.</p>
    <a href="#work" className="mt-2 text-[11px] uppercase">Play!</a>
  </aside>
)
const Collage = ({ images }) => {
  const groups = useMemo(() => {
    const chunk = 9; const g = []; for (let i = 0; i < Math.min(images.length, 45); i += chunk) g.push(images.slice(i, i + chunk)); return g
  }, [images])
  return (
    <section aria-label="Collage" className="relative">
      {groups.map((g, gi) => (
        <div key={gi} className="relative mb-40 flex flex-wrap gap-6 justify-center">
          {g.map((img, i) => (<Card key={img.image + i} src={img.image} i={i + gi * 10} alt={img.title} />))}
        </div>
      ))}
    </section>
  )
}
const Grid = ({ images }) => (
  <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {images.slice(0, 36).map((img, idx) => (
      <motion.img key={img.image + idx} src={img.image} alt={img.title} loading="lazy" whileHover={{ scale: 1.02 }} className="rounded-xl shadow-xl" />
    ))}
  </section>
)
export default function Showcase() {
  const [images, setImages] = useState([])
  useEffect(() => {
    fetch('./art_manifest.json').then(r => r.json()).then(data => {
      const seen = new Set(); const clean = data.filter(d => d && d.image && !seen.has(d.image) && seen.add(d.image)); setImages(clean)
    }).catch(()=>{})
  }, [])
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-[260px,1fr] gap-8 pt-8">
          <LeftRail />
          <section>
            <Collage images={images.slice(0, 27)} />
            <section id="work" className="relative h-[140vh]">
              <div className="sticky top-0 flex items-end justify-center h-[100vh] overflow-visible">
                <div className="w-full max-w-5xl px-6 pb-20 grid md:grid-cols-[1fr,360px] gap-10 items-end">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold">Wolf • Alice • White Horses</h2>
                    <p className="opacity-80 max-w-prose">A scrolling composition where type, gesture, and motion meet. As you move, the work relaxes into place.</p>
                  </div>
                  <img src={images[3]?.image || images[8]?.image || images[0]?.image || ''} className="rounded-2xl shadow-2xl" alt="Feature" />
                </div>
              </div>
            </section>
            <section className="my-32 space-y-24">
              <Grid images={images.slice(27, 63)} />
              <Grid images={images.slice(63, 99)} />
            </section>
            <section id="about" className="my-40 max-w-2xl">
              <h3 className="text-2xl font-semibold mb-4">About</h3>
              <p className="opacity-80 leading-relaxed">Heneni is a studio for unique visual experiences. We design from instinct and arrange for delight, inviting the viewer to participate through motion and playful discovery.</p>
            </section>
            <section id="contact" className="my-24 max-w-2xl">
              <h3 className="text-2xl font-semibold mb-4">Contact</h3>
              <p className="opacity-80">Say hello at <a className="underline" href="mailto:mark@heneniart.com">mark@heneniart.com</a>.</p>
              <div className="h-24" />
            </section>
          </section>
        </div>
      </div>
    </main>
  )
}