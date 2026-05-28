/*  Web3Forms config  */
const W3F_ACCESS_KEY = '2adf4b5e-abef-43b5-b29f-16a5b10dc7a8';

/*  Modal */
const modal      = document.getElementById('contact-modal');
const openBtn    = document.getElementById('open-modal');
const closeBtn   = document.getElementById('close-modal');
const cfForm     = document.getElementById('contact-form');
const cfSubmit   = document.getElementById('cf-submit');
const cfBtnText  = document.getElementById('cf-btn-text');
const cfSuccess  = document.getElementById('cf-success');
const cfError    = document.getElementById('cf-error');

function openModal() {
  modal.classList.add('open');
  modal.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // Reset estado del formulario
  cfForm.reset();
  cfForm.classList.remove('hidden');
  cfSuccess.classList.add('hidden');
  cfError.classList.add('hidden');
  cfBtnText.textContent = 'Enviar';
  cfSubmit.disabled = false;
  cfSubmit.style.opacity = '1';
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/*Form submit */
cfForm.addEventListener('submit', async e => {
  e.preventDefault();
  cfError.classList.add('hidden');
  cfBtnText.textContent = 'Enviando…';
  cfSubmit.disabled = true;
  cfSubmit.style.opacity = '.65';

  const data = new FormData(cfForm);
  data.append('access_key', W3F_ACCESS_KEY);

  try {
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
    const json = await res.json();
    if (json.success) {
      cfForm.classList.add('hidden');
      cfSuccess.classList.remove('hidden');
    } else {
      throw new Error(json.message);
    }
  } catch (err) {
    console.error('Web3Forms error:', err);
    cfError.classList.remove('hidden');
    cfBtnText.textContent = 'Enviar';
    cfSubmit.disabled = false;
    cfSubmit.style.opacity = '1';
  }
});

/* AOS  */
AOS.init({
  duration: 680,
  easing: 'ease-out-cubic',
  once: true,
  offset: 55,
});

/*  Navbar scroll glass  */
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 48);
};
window.addEventListener('scroll', onScroll, { passive: true });

/*  Hamburger toggle  */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(l =>
  l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  })
);

/*  Project Showcase v2 (Peek Carousel + Grid)  */
(function () {
  const pfeatWrap   = document.getElementById('pfeat-wrap');
  const pfeatTrack  = document.getElementById('pfeat-track');
  const pfeatSlides = Array.from(pfeatTrack.querySelectorAll('.pfeat-slide'));
  const gridCards   = Array.from(document.querySelectorAll('.proj-gc'));
  const filterBtns  = document.querySelectorAll('.f-btn');
  let pool = [...pfeatSlides];
  let cur  = 0;
  let timer;

  function translate(realIdx) {
    const sw  = pfeatWrap.offsetWidth - 200;
    const off = 100 - realIdx * (sw + 20);
    pfeatTrack.style.transform = `translateX(${off}px)`;
  }

  function go(idx) {
    pfeatSlides.forEach(s => s.classList.remove('active'));
    gridCards.forEach(c => c.classList.remove('active'));
    pool[idx].classList.add('active');
    cur = idx;
    const realIdx = pfeatSlides.indexOf(pool[idx]);
    translate(realIdx);
    const match = gridCards.find(c => parseInt(c.dataset.pfeatIdx) === realIdx);
    if (match) match.classList.add('active');
  }

  const start = () => { timer = setInterval(() => go((cur + 1) % pool.length), 4500); };
  const stop  = () => clearInterval(timer);

  document.getElementById('pfeat-prev').addEventListener('click', () => { stop(); go((cur - 1 + pool.length) % pool.length); start(); });
  document.getElementById('pfeat-next').addEventListener('click', () => { stop(); go((cur + 1) % pool.length); start(); });

  gridCards.forEach(card => {
    card.addEventListener('click', () => {
      const slideIdx = parseInt(card.dataset.pfeatIdx);
      const poolIdx  = pool.indexOf(pfeatSlides[slideIdx]);
      if (poolIdx !== -1) { stop(); go(poolIdx); start(); }
    });
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      gridCards.forEach(c => c.classList.toggle('hidden', f !== 'all' && c.dataset.cat !== f));
      pool = f === 'all' ? [...pfeatSlides] : pfeatSlides.filter(s => s.dataset.cat === f);
      stop(); go(0); start();
    });
  });

  window.addEventListener('resize', () => {
    const realIdx = pfeatSlides.indexOf(pool[cur]);
    translate(realIdx);
  }, { passive: true });

  go(0); start();
})();

/*  Image reels (multi-image inside a slide)  */
document.querySelectorAll('.img-reel').forEach(reel => {
  const imgs = Array.from(reel.querySelectorAll('.reel-img'));
  const container = reel.closest('.pfeat-visual') || reel.closest('.showcase-right');
  const dots = container ? Array.from(container.querySelectorAll('.reel-dot')) : [];
  let cur = 0;
  let timer;

  function go(idx) {
    imgs[cur].classList.remove('active');
    dots[cur]?.classList.remove('active');
    cur = (idx + imgs.length) % imgs.length;
    imgs[cur].classList.add('active');
    dots[cur]?.classList.add('active');
  }

  dots.forEach((d, i) => d.addEventListener('click', e => {
    e.stopPropagation();
    clearInterval(timer);
    go(i);
    timer = setInterval(() => go(cur + 1), 3200);
  }));

  timer = setInterval(() => go(cur + 1), 3200);
});

/*  Active section highlight  */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('a.nav-link:not(.mob-link)');

const sectionObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${id}`;
        link.style.color = active ? 'var(--cyan)' : 'var(--muted)';
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObs.observe(s));

