/**
 * Smooth Scroll Component
 * Implements momentum scrolling using Lenis
 */

class SmoothScroll {
  constructor() {
    this.lenis = null;
  }

  init() {
    // Initialize Lenis
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Connect Lenis to requestAnimationFrame
    requestAnimationFrame(this.raf.bind(this));

    // Connect to anchor links for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          this.lenis.scrollTo(target);
        }
      });
    });
  }

  raf(time) {
    this.lenis.raf(time);
    requestAnimationFrame(this.raf.bind(this));
  }

  /**
   * Stop scrolling (e.g. when modal is open)
   */
  stop() {
    this.lenis.stop();
  }

  /**
   * Resume scrolling
   */
  start() {
    this.lenis.start();
  }
}

export const smoothScroll = new SmoothScroll();
