import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

function HamburgerButton({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) {
  const burgerRef = useRef<SVGSVGElement>(null)
  const crossRef = useRef<SVGSVGElement>(null)
  const tl = useRef<gsap.core.Timeline>()

  useEffect(() => {
    const burgerLines = burgerRef.current?.querySelectorAll('path')
    const crossLines = crossRef.current?.querySelectorAll('line')

    if (!burgerLines || !crossLines) return

    // Hide cross initially
    gsap.set(crossLines, { opacity: 0, scaleX: 0, transformOrigin: 'center center' })

    // Timeline
    tl.current = gsap.timeline({ paused: true })
    tl.current
      // Hamburger hides
      .to(burgerLines, {
        duration: 0.25,
        scaleX: 0,
        opacity: 0,
        transformOrigin: 'right center',
        stagger: 0.07,
        ease: 'power2.inOut',
      })
      // Cross appears with delay
      .to(
        crossLines,
        {
          duration: 0.3,
          opacity: 1,
          scaleX: 1,
          stagger: 0.08,
          ease: 'power2.out',
        },
        '+=0.1' // delay after hamburger finishes
      )
  }, [])

  useEffect(() => {
    if (tl.current) {
      if (isOpen) {
        tl.current.play()
      } else {
        tl.current.reverse()
      }
    }
  }, [isOpen])

  return (
    <button
      onClick={onClick}
      className="fixed w-[60px] h-[60px] right-8 z-30 top-4 bg-[#0e3c3b] p-3 rounded-full shadow-lg text-black transform transition-transform duration-300 ease-in-out hover:scale-110"
    >
      {/* Hamburger */}
      <svg
        ref={burgerRef}
        viewBox="0 0 24 24"
        width="28"
        height="28"
        aria-hidden="true"
        className="absolute inset-0 m-auto"
      >
        <path d="M4 7h16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 12h16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 17h16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>

      {/* Cross */}
      <svg
        ref={crossRef}
        viewBox="0 0 24 24"
        width="28"
        height="28"
        aria-hidden="true"
        className="absolute inset-0 m-auto"
      >
        <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="6" y1="18" x2="18" y2="6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  )
}

export default HamburgerButton
