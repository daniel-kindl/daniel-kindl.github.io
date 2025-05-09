const TRACK    = document.querySelector('.carousel-track');
const TEMPLATE = document.querySelector('.project-template');

// GitHub username and list of repos to display
const GITHUB_USERNAME = "daniel-kindl";
const GITHUB_REPOS    = ["daniel-kindl.github.io"];

// Fetch repository metadata from GitHub
async function fetchRepo(repoName) 
{
  const URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`;
  const RES = await fetch(URL);
  if (!RES.ok) 
  {
    console.error(`Failed to fetch ${repoName}:`, RES.status);
    return null;
  }
  return await RES.json();
}

// Fetch programming languages used in a GitHub repository
async function fetchLanguages(repoName) 
{
  const URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/languages`;
  const RES = await fetch(URL);
  if (!RES.ok) 
  {
    console.error(`Failed to fetch languages for repo ${repoName}:`, RES.status);
    return null;
  }
  return await RES.json();
}

// Load project cards (real GitHub repos + placeholders if needed)
async function loadProjects() 
{
  for (const REPO_NAME of GITHUB_REPOS) 
  {
    const REPO = await fetchRepo(REPO_NAME);
    if (!REPO) continue;

    const LANGUAGES = await fetchLanguages(REPO_NAME);
    const LANG_TOP  = Object.keys(LANGUAGES).slice(0, 3);
    const LANG_TEXT = LANG_TOP.length ? `Tech: ${LANG_TOP.join(", ")}` : "Tech: Unknown";

    const CARD = TEMPLATE.cloneNode(true);
    CARD.classList.remove('project-template');
    CARD.style.display = 'flex';
    
    CARD.querySelector('.project-title').textContent = REPO.name;

    const MAX_DESC_LENGTH = 200;
    let desc = REPO.description || "No description available.";
    if (desc.length > MAX_DESC_LENGTH) desc = desc.slice(0, MAX_DESC_LENGTH).trim() + "...";
    CARD.querySelector('.project-desc').textContent = desc;

    CARD.querySelector('.project-link').href = REPO.html_url;
    CARD.querySelector('.project-langs').textContent = LANG_TEXT;

    TRACK.appendChild(CARD);
  }

  // Add placeholder cards if there are fewer than the visible minimum
  const CARDS_MAX           = 3;
  const PLACEHOLDERS_NEEDED = Math.max(0, CARDS_MAX - GITHUB_REPOS.length);

  for (let i = 0; i < PLACEHOLDERS_NEEDED; i++) 
  {
    const CARD = TEMPLATE.cloneNode(true);
    CARD.classList.remove('project-template');
    CARD.classList.add('placeholder');
    CARD.style.display = 'flex';
    CARD.querySelector('.project-title').textContent = "Coming Soon";
    CARD.querySelector('.project-desc').textContent = "More projects are on the way.";
    CARD.querySelector('.project-link').remove();
    CARD.querySelector('.project-langs').remove();
    TRACK.appendChild(CARD);
  }

  // Initialize carousel after all cards are loaded
  initCarousel();
}

// Initialize the carousel with infinite loop behavior
function initCarousel() 
{
  const TRACK         = document.querySelector('.carousel-track');
  const CARDS         = [...TRACK.querySelectorAll('.card:not(.project-template)')];
  const CARDS_VISIBLE = 3;
  const CARD_WIDTH    = 280 + 30;
  let currentIndex    = CARDS_VISIBLE;

  // Clone start and end segments to allow seamless looping
  const clonesStart = CARDS.slice(-CARDS_VISIBLE).map(c => c.cloneNode(true));
  const clonesEnd   = CARDS.slice(0, CARDS_VISIBLE).map(c => c.cloneNode(true));

  clonesStart.forEach(c => TRACK.insertBefore(c, TRACK.firstChild));
  clonesEnd.forEach(c => TRACK.appendChild(c));

  // Instantly jump to first real card
  function jumpTo(index) 
  {
    TRACK.style.transition = 'none';
    TRACK.style.transform  = `translateX(-${index * CARD_WIDTH}px)`;
  }

  // Animate carousel movement to specified index
  function moveTo(index) 
  {
    TRACK.style.transition = 'transform 0.4s ease';
    TRACK.style.transform  = `translateX(-${index * CARD_WIDTH}px)`;
  }

  jumpTo(currentIndex); // Initial position (first real card)

  // Carousel navigation buttons
  document.querySelector('.next').addEventListener('click', () => 
  {
    currentIndex++;
    moveTo(currentIndex);
  });

  document.querySelector('.prev').addEventListener('click', () => 
  {
    currentIndex--;
    moveTo(currentIndex);
  });

  // Infinite loop correction after transition ends
  TRACK.addEventListener('transitionend', () => 
  {
    const TOTAL = CARDS.length;
    if (currentIndex >= TOTAL + CARDS_VISIBLE) 
    {
      currentIndex = CARDS_VISIBLE;
      jumpTo(currentIndex);
    } 
    else if (currentIndex < CARDS_VISIBLE) 
    {
      currentIndex = TOTAL + CARDS_VISIBLE - 1;
      jumpTo(currentIndex);
    }
  });
}

// Start the project loading and carousel initialization
loadProjects();
