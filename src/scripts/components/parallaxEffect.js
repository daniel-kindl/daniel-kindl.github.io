/**
 * Parallax Effect Component
 * Creates depth effect on scroll
 */

class ParallaxEffect {
  constructor() {
    this.elements = [];
  }

  /**
   * Initialize parallax effect
   */
  init() {
    this.setupElements();
    window.addEventListener('scroll', () => this.handleScroll());
  }

  /**
   * Setup parallax elements
   */
  setupElements() {
    this.elements = [
      { selector: '.hero-background', speed: 0.5 },
      { selector: '.cursor-halo', speed: 0.3 },
    ];
  }

  /**
   * Handle scroll event
   */
  handleScroll() {
    const scrollY = window.pageYOffset;

    this.elements.forEach(({ selector, speed }) => {
      const element = document.querySelector(selector);
      if (element) {
        const offset = scrollY * speed;
        element.style.transform = `translateY(${offset}px)`;
      }
    });
  }
}

export const parallaxEffect = new ParallaxEffect();
