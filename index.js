document.documentElement.classList.add('js-on');

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Header, progress bar and hero parallax
const header = document.getElementById('header');
const progress = document.getElementById('progress');
const heroImg = document.querySelector('#heroFrame img');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);
  const h = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (y / h) * 100 + '%';
  if (heroImg && y < innerHeight) heroImg.style.transform = `translateY(${-y * 0.06}px)`;
}, { passive: true });

// Mobile menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const toggleMenu = open => {
  burger.classList.toggle('open', open);
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
};
burger.addEventListener('click', () => toggleMenu(!nav.classList.contains('open')));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

// Scroll reveal (staggered inside groups)
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const siblings = [...e.target.parentElement.children].filter(c => c.classList.contains('reveal'));
    e.target.style.transitionDelay = Math.max(0, siblings.indexOf(e.target)) * 0.12 + 's';
    e.target.classList.add('in');
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal, .reveal-left').forEach(el => io.observe(el));

// Lightbox
const items = [...document.querySelectorAll('.g img')];
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
let current = 0;
const show = i => {
  current = (i + items.length) % items.length;
  lbImg.src = items[current].src;
  lbImg.alt = items[current].alt;
};
const openLb = i => { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
items.forEach((img, i) => img.closest('.g').addEventListener('click', () => openLb(i)));
document.getElementById('lbClose').addEventListener('click', closeLb);
document.getElementById('lbPrev').addEventListener('click', () => show(current - 1));
document.getElementById('lbNext').addEventListener('click', () => show(current + 1));
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});
// Swipe on phones
let sx = 0;
lb.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
lb.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
});