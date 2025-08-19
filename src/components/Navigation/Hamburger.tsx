import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'
import './hamburger.scss'
import { log } from 'console'
import HamburgerButton from '../ui/hamburgerButton'

gsap.registerPlugin(SplitText)

const HamburgerMenu = () => {
  const pathname = usePathname()

  const svgRef = useRef<SVGSVGElement>(null)
  const svgRef2 = useRef<SVGSVGElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const splitRef = useRef<gsap.core.Timeline | null>(null)

  // GSAP animation setup
  useGSAP(() => {
    const svg = svgRef.current
    const svg2 = svgRef2.current
    if (!svg || !svg2) return

    // Initial state (hidden)
    gsap.set(svg, { opacity: 1 })
    gsap.set(svg2, { opacity: 1 })
    gsap.set('.split', { opacity: 1 })
    gsap.set('.menu-container', { opacity: 0 })

    // Create SplitText instance
    const split = new SplitText('.split', {
      type: 'words,lines',
      linesClass: 'line',
      autoSplit: true,
      mask: 'lines',
    })

    // Create GSAP animation for lines
    splitRef.current = gsap.from(split.lines, {
      duration: 0.6,
      yPercent: 100,
      opacity: 0,
      stagger: 0.1,
      ease: 'expo.out',
      paused: true,
      delay: 0.5, // Pause initially to trigger on button click
      // Delay is not supported here; use timeline for sequencing if needed
    })

    gsap.set('#background-path', {
      attr: { d: 'M0,0 H100 V0 H100 V0 Q50,0 0,0 Z' }, // Completely collapsed
    })
    gsap.set('#background-path2', {
      attr: { d: 'M0,0 H100 V0 H100 V0 Q50,0 0,0 Z' }, // Completely collapsed
    })

    // Animation timeline
    const tl = gsap.timeline({ paused: true })
    const tl2 = gsap.timeline({ paused: true })
    const tl1 = gsap.timeline({ paused: true })
    const tl22 = gsap.timeline({ paused: true })

    const hideMenu = gsap.timeline({ paused: true })
    const showMenu = gsap.timeline({ paused: true })

    const tlcontOpen = gsap.timeline({ paused: true })
    const tlcontClose = gsap.timeline({ paused: true })

    tlcontOpen.to('.menu-container', {
      opacity: 1,
      duration: 0.1,
      ease: 'power2.inOut',
    })
    tlcontClose.to('.menu-container', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    })
    hideMenu.to('.menu-container', {
      display: 'none',
      delay: 0.5,
      ease: 'power2.inOut',
    })
    showMenu.to('.menu-container', {
      display: 'flex',

      ease: 'power2.inOut',
    })

    // Then to full rectangle
    tl.to('#background-path', {
      keyframes: [
        {
          attr: { d: 'M0,0 H100 V0 H100 V50 Q50,70 0,50 Z' }, // Bottom side is a semicircle
          duration: 0.5,
        },
        {
          attr: { d: 'M0,0 H100 V0 H100 V100 Q50,100 0,100 Z' }, // Full rectangle
          duration: 0.5,
        },
      ],
      ease: 'power2.inOut',
    })

    tl1.to('#background-path', {
      keyframes: [
        {
          attr: { d: 'M0,0 H100 V0 H100 V50 Q50,30 0,50 Z' }, // Bottom side is a semicircle
          duration: 0.5,
        },
        {
          attr: { d: 'M0,0 H100 V0 H100 V0 Q50,0 0,0 Z' }, // Full rectangle
          duration: 0.5,
        },
      ],
      ease: 'power2.inOut',
      delay: 0.2,
    })

    // Then to full rectangle
    tl2.to('#background-path2', {
      keyframes: [
        {
          attr: { d: 'M0,0 H100 V0 H100 V50 Q50,70 0,50 Z' }, // Bottom side is a semicircle
          duration: 0.5,
        },
        {
          attr: { d: 'M0,0 H100 V0 H100 V100 Q50,100 0,100 Z' }, // Full rectangle
          duration: 0.5,
        },
      ],
      ease: 'power2.inOut',
      delay: 0.2, // Slight delay for staggered effect
    })
    // Then to full rectangle
    tl22.to('#background-path2', {
      keyframes: [
        {
          attr: { d: 'M0,0 H100 V0 H100 V50 Q50,30 0,50 Z' }, // Bottom side is a semicircle
          duration: 0.5,
        },
        {
          attr: { d: 'M0,0 H100 V0 H100 V0 Q50,0 0,0 Z' }, // Full rectangle
          duration: 0.5,
        },
      ],
      ease: 'power2.inOut',
    })

    // Store timeline in ref so we can control it
    svgRef.current.timeline = tl
    svgRef.current.tlcontOpen = tlcontOpen
    svgRef.current.tlcontClose = tlcontClose
    svgRef.current.hideMenu = hideMenu
    svgRef.current.showMenu = showMenu
    svgRef.current.timeline2 = tl1
    svgRef2.current.timeline = tl2
    svgRef2.current.timeline2 = tl22

    // Cleanup: Revert SplitText on component unmount
    return () => {
      split.revert()
    }
  }, [])

  const toggleBackground = () => {
    const tl = svgRef.current?.timeline
    const tlcontO = svgRef.current?.tlcontOpen
    const tlcontC = svgRef.current?.tlcontClose
    const hideMenu = svgRef.current?.hideMenu
    const showMenu = svgRef.current?.showMenu
    const tl2 = svgRef2.current?.timeline
    const tl1 = svgRef.current?.timeline2
    const tl22 = svgRef2.current?.timeline2
    // if (!tl || !tl2) return

    if (isOpen) {
      tl1.restart() // Play animation backwards
      tl22.restart() // Play animation backwards
      if (splitRef.current) {
        splitRef.current.reverse()
      }
      tlcontC.restart()
      hideMenu.restart() // Hide menu after animation
    } else {
      tl.restart() // Play forwards
      tl2.restart() // Play forwards
      if (splitRef.current) {
        splitRef.current.restart(true)
      }
      showMenu.restart() // Show menu after animation1
      tlcontO.restart()
    }

    setIsOpen(!isOpen)
  }

  return (
    <div className="container absolute h-[100vh] w-ful top-0 left-0 z-10">
      <div className="fixed overflow-hidden w-full h-[100vh] z-10 left-0 top-0">
        {/* Toggle button */}
        <HamburgerButton onClick={toggleBackground} isOpen={isOpen} />

        {/* Animated SVG background */}
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="fixed h-[100vh] w-full z-10"
        >
          <path
            id="background-path"
            fill="#009B4A" // Purple color - change as needed
            // fill="#f5f1ee"
            // stroke="#312e81" // Darker stroke
            // strokeWidth="0.0"
          />
        </svg>
        <svg
          ref={svgRef2}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="fixed h-[100vh] w-full z-10"
        >
          <path
            id="background-path2"
            // fill="#009B4A" // Purple color - change as needed
            fill="#f5f1ee"
            // stroke="#312e81" // Darker stroke
            // strokeWidth="0.0"
          />
        </svg>

        <div
          className={`menu-container relative flex flex-col gap-2 items-start justify-center pl-10 h-[100vh] z-20 
    ${isOpen ? 'flex' : 'hidden'}`}
        >
          <Link className={`hamMenu ${pathname === '/' ? 'active' : ''}`} href="/">
            <span className="split hamMenu_Large">Home</span>
          </Link>
          <Link className={`hamMenu ${pathname === '/mission' ? 'active' : ''}`} href="/mission">
            <span className="split hamMenu_Large">Mission</span>
          </Link>
          <Link className={`hamMenu ${pathname === '/service' ? 'active' : ''}`} href="/service">
            <span className="split hamMenu_Large">Service</span>
          </Link>
          <Link className={`hamMenu ${pathname === '/company' ? 'active' : ''}`} href="/company">
            <span className="split hamMenu_Large">Company</span>
          </Link>
          <Link className={`hamMenu ${pathname === '/careers' ? 'active' : ''}`} href="/careers">
            <span className="split hamMenu_Large">Careers</span>
          </Link>
          <Link className={`hamMenu ${pathname === '/posts' ? 'active' : ''} mt-5`} href="/posts">
            <span className="split hamMenu">News</span>
          </Link>
          <Link
            className={`hamMenu ${pathname === '/contact' ? 'active' : ''} -mt-2`}
            href="/contact"
          >
            <span className="split hamMenu">Contact</span>
          </Link>
          <Link className={`hamMenu ${pathname === '/term' ? 'active' : ''} mt-5 `} href="/term">
            <span className="split hamMenu_tiny">Terms and Conditions</span>
          </Link>
          <Link className={`hamMenu ${pathname === '/policy' ? 'active' : ''} `} href="/policy">
            <span className="split hamMenu_tiny">Privacy Policy</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HamburgerMenu
