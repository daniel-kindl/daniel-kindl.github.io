// Animate a typewriter effect for rotating phrases
function typeEffect() 
{
  const CURRENT_PHRASE       = PHRASES[phraseIndex];
  const VISIBLE_TEXT         = CURRENT_PHRASE.slice(0, charIndex);
  TYPING_ELEMENT.textContent = VISIBLE_TEXT;

  if (!isDeleting && charIndex < CURRENT_PHRASE.length) 
  {
    charIndex++; // Typing forward
  } 
  else if (isDeleting && charIndex > 0) 
  {
    charIndex--; // Deleting backward
  } 
  else 
  {
    if (!isDeleting) 
    {
      // Pause after fully typing, then start deleting
      setTimeout(() => 
      {
        isDeleting = true;
        typeEffect();
      }, 1500);
      return;
    } 
    else 
    {
      // Move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % PHRASES.length;
    }
  }

  const DELAY = isDeleting ? 40 : 100; // Speed of typing/deleting
  setTimeout(typeEffect, DELAY);
}

// Animate on scroll (AOS library)
AOS.init();

// Constants for typing animation
const PHRASES = [
  "Full Stack Software Engineer",
  "AI Enthusiast",
  "UX/UI Creator",
  "Gamer",
  "Car Enthusiast"
];

const TYPING_ELEMENT = document.getElementById("typing-text");

// State variables
let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;

// Start the typing animation
typeEffect();