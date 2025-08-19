//SmoothScrollProvider.tsx
'use client';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register ScrollSmoother plugin
    gsap.registerPlugin(ScrollTrigger,ScrollSmoother);

    // Initialize ScrollSmoother
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1, // How long (in seconds) it takes to "catch up" to the native scroll position
      effects: true, // Looks for data-speed and data-lag attributes on elements
      smoothTouch: 0.1, // Smoothing on touch devices
    });

    // Refresh ScrollSmoother on window resize
    const handleResize = () => smoother.refresh();
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      smoother.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
}