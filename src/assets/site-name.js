document.addEventListener('DOMContentLoaded', function() {
  // Get the site name from the H1 element
  const nameElement = document.querySelector('.name-overlay h1');
  if (nameElement) {
    // Set the CSS variable to match the content of the H1
    document.documentElement.style.setProperty('--site-name', `"${nameElement.textContent}"`);
  }
});