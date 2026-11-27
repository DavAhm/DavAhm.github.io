// Home page: make the transparent top bar solid once you scroll past the hero
const bar = document.querySelector('.topbar--over');
if (bar) {
  const update = () => bar.classList.toggle('is-solid', window.scrollY > 80);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// Footer year
document.querySelectorAll('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));
