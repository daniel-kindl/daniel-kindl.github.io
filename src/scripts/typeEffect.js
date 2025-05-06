function typeEffect() 
{
    const currentPhrase = phrases[phraseIndex];
    const visibleText = currentPhrase.slice(0, charIndex);
    el.textContent = visibleText;

    if (!isDeleting && charIndex < currentPhrase.length) 
    {
      charIndex++;
    } 
    else if (isDeleting && charIndex > 0) 
    {
      charIndex--;
    } 
    else 
    {
      if (!isDeleting) 
      {
        // Pause after fully typing the phrase
        setTimeout( () => { isDeleting = true; typeEffect(); }, 1500 );
        return;
      } 
      else 
      {
        // Move to the next phrase after deleting
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const delay = isDeleting ? 40 : 100;
    setTimeout(typeEffect, delay);
}

AOS.init();

const phrases = ["Full Stack Software Engineer", "AI Enthusiast", "UX/UI Creator", "Gamer", "Calisthenics", "Car Enthusiast"];
const el = document.getElementById("typing-text");
let phraseIndex = 0, charIndex = 0, isDeleting = false;

typeEffect();