// Set the current year in the footer
function setFooterYear() {
  const FOOTER_YEAR_ELEMENT = document.getElementById("footer_year");

  if (FOOTER_YEAR_ELEMENT) {
    FOOTER_YEAR_ELEMENT.textContent = new Date().getFullYear().toString();
  } else {
    console.error("Footer year element not found");
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setFooterYear);
} else {
  setFooterYear();
}