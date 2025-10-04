// Constants for typing animation
const PHRASES = [
  "Software Engineer",
  "AI Enthusiast",
  "Gamer",
];

const TYPING_ELEMENT = document.getElementById("typing-text");

// State variables
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

// Animate a typewriter effect for rotating phrases
function typeEffect() {
  // Safety check: ensure element exists
  if (!TYPING_ELEMENT) {
    console.error("Typing element not found");
    return;
  }

  const CURRENT_PHRASE = PHRASES[phraseIndex];
  const VISIBLE_TEXT = CURRENT_PHRASE.slice(0, charIndex);
  TYPING_ELEMENT.textContent = VISIBLE_TEXT;

  if (!isDeleting && charIndex < CURRENT_PHRASE.length) {
    charIndex++; // Typing forward
  } else if (isDeleting && charIndex > 0) {
    charIndex--; // Deleting backward
  } else {
    if (!isDeleting) {
      // Pause after fully typing, then start deleting
      setTimeout(() => {
        isDeleting = true;
        typeEffect();
      }, 1500);
      return;
    } else {
      // Move to the next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % PHRASES.length;
    }
  }

  const DELAY = isDeleting ? 40 : 100; // Speed of typing/deleting
  setTimeout(typeEffect, DELAY);
}

// Initialize AOS (Animate On Scroll)
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  } else {
    console.warn("AOS library not loaded");
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initAOS();
    typeEffect();
  });
} else {
  // DOM already loaded
  initAOS();
  typeEffect();
}