// src/scroll.js
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initSmoothScroll() {
  const lenis = new Lenis({ smoothWheel: true, wheelMultiplier: 1.0, lerp: 0.12 })
  function raf(time) {
    lenis.raf(time)
    ScrollTrigger.update()
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  // If you wrap content in a custom scroller, uncomment and set scrollerProxy here.
  return lenis
}

export function initScrollTriggers() {
  // Parallax amplitude by data-speed (e.g., data-speed="0.6")
  document.querySelectorAll('.js-card').forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-speed') || '0.6')
    gsap.fromTo(el, { y: gsap.utils.random(-40, -10) }, {
      y: () => gsap.utils.random(10, 40),
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
    gsap.to(el, {
      rotation: () => gsap.utils.random(-4, 4),
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
  })

  // Pinned feature section with gentle entrance
  const feature = document.querySelector('#work .js-feature')
  if (feature) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#work',
        start: 'top top',
        end: '+=140%',
        scrub: true,
        pin: true
      }
    })
    tl.fromTo('.js-feature-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
      .fromTo('.js-feature-image', { y: 80, scale: 0.96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.7 }, 0.1)
      .fromTo('.js-feature-copy', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.15)
  }
}
