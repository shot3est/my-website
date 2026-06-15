/* MEIAN Photography — Main JS */

/* ── i18n ── */
const LANG_KEY = 'meian_lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'en';

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.hidden = el.dataset.lang !== lang;
  });
  localStorage.setItem(LANG_KEY, lang);
}

function toggleLang() {
  applyLang(currentLang === 'en' ? 'ja' : 'en');
}

applyLang(currentLang);

/* ── Navbar scroll effect ── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile burger menu ── */
const burger = document.querySelector('.nav-burger');
const mobileNav = document.querySelector('.nav-mobile');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    })
  );
}

/* ── Active nav link ── */
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

/* ── Fade-up on scroll ── */
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  fadeEls.forEach(el => observer.observe(el));
}

/* ── Gallery filter ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      galleryItems.forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

/* ── Lightbox ── */
const lightbox = document.querySelector('.lightbox');
const lbPhoto  = document.querySelector('.lb-photo-inner');
const lbCat    = document.querySelector('.lightbox-caption .cat');
const lbTtl    = document.querySelector('.lightbox-caption .ttl');
let lbItems = [], lbIdx = 0;

if (lightbox) {
  lbItems = [...document.querySelectorAll('.gallery-item')];

  const open = idx => {
    lbIdx = idx;
    const item = lbItems[idx];
    const cat  = item.dataset.cat || '';
    const ttl  = item.dataset.title || '';
    const cls  = item.dataset.ph || '';
    if (lbPhoto) {
      lbPhoto.className = 'photo-inner ' + cls;
      lbPhoto.innerHTML = `<span class="photo-icon">📷</span><span>${ttl}</span>`;
    }
    if (lbCat) lbCat.textContent = cat;
    if (lbTtl) lbTtl.textContent = ttl;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  lbItems.forEach((item, i) => item.addEventListener('click', () => open(i)));
  document.querySelector('.lb-close')?.addEventListener('click', close);
  document.querySelector('.lb-prev')?.addEventListener('click', () =>
    open((lbIdx - 1 + lbItems.length) % lbItems.length));
  document.querySelector('.lb-next')?.addEventListener('click', () =>
    open((lbIdx + 1) % lbItems.length));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  open((lbIdx - 1 + lbItems.length) % lbItems.length);
    if (e.key === 'ArrowRight') open((lbIdx + 1) % lbItems.length);
  });
}

/* ── Contact form ── */
const FORMSPREE_ID = 'REPLACE_WITH_YOUR_FORMSPREE_ID';
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const validate = field => {
    const group = field.closest('.form-group');
    if (!group) return true;
    const val = field.value.trim();
    let ok = val.length > 0;
    if (field.type === 'email' && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    group.classList.toggle('error', !ok);
    return ok;
  };
  contactForm.querySelectorAll('[required]').forEach(f => {
    f.addEventListener('blur', () => validate(f));
    f.addEventListener('input', () => {
      if (f.closest('.form-group')?.classList.contains('error')) validate(f);
    });
  });
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    let allOk = true;
    contactForm.querySelectorAll('[required]').forEach(f => { if (!validate(f)) allOk = false; });
    if (!allOk) return;

    const btn = contactForm.querySelector('[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span data-lang="en">Sending…</span><span data-lang="ja" hidden>送信中…</span>';
    btn.disabled = true;
    applyLang(currentLang);

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        contactForm.style.display = 'none';
        document.querySelector('.form-success')?.classList.add('show');
      } else {
        throw new Error('Server error');
      }
    } catch {
      btn.innerHTML = '<span data-lang="en">Failed — please try again</span><span data-lang="ja" hidden>送信失敗 — もう一度お試しください</span>';
      btn.disabled = false;
      applyLang(currentLang);
    }
  });
}

/* ── Hero parallax ── */
const heroBg = document.querySelector('.hero-pattern');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }, { passive: true });
}
