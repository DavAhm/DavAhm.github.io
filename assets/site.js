// Mobile menu toggle
const btn = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');
if (btn && menu) {
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
}

// Home page: make the transparent top bar solid once you scroll past the hero
const bar = document.querySelector('.topbar--over');
if (bar) {
  const update = () => bar.classList.toggle('is-solid', window.scrollY > 80 || menu.classList.contains('open'));
  window.addEventListener('scroll', update, { passive: true });
  btn && btn.addEventListener('click', update);
  update();
}

// Footer year
document.querySelectorAll('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));
