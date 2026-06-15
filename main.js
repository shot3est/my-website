/* HIKARI Photography — Main JS */

/* ── Navbar scroll effect ── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
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
        const match = cat === 'all' || item.dataset.cat === cat;
        item.style.display = match ? '' : 'none';
        if (match) item.style.animation = 'none';
        requestAnimationFrame(() => {
          if (match) item.style.animation = '';
        });
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
    const photo = item.querySelector('.gallery-photo');
    const cat   = item.dataset.cat || '';
    const ttl   = item.dataset.title || '';
    const cls   = item.dataset.ph || '';
    if (lbPhoto) {
      lbPhoto.className = 'photo-inner ' + cls;
      const icon = lbPhoto.querySelector('.photo-icon') || document.createElement('span');
      icon.className = 'photo-icon';
      icon.textContent = '📷';
      const txt = lbPhoto.querySelector('.ph-label') || document.createElement('span');
      txt.className = 'ph-label';
      txt.textContent = ttl;
      if (!lbPhoto.querySelector('.photo-icon')) lbPhoto.appendChild(icon);
      if (!lbPhoto.querySelector('.ph-label'))   lbPhoto.appendChild(txt);
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
    open((lbIdx - 1 + lbItems.length) % lbItems.length)
  );
  document.querySelector('.lb-next')?.addEventListener('click', () =>
    open((lbIdx + 1) % lbItems.length)
  );

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   open((lbIdx - 1 + lbItems.length) % lbItems.length);
    if (e.key === 'ArrowRight')  open((lbIdx + 1) % lbItems.length);
  });
}

/* ── Contact form ── */
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

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let allOk = true;
    contactForm.querySelectorAll('[required]').forEach(f => {
      if (!validate(f)) allOk = false;
    });
    if (!allOk) return;

    const btn = contactForm.querySelector('[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.style.display = 'none';
      document.querySelector('.form-success')?.classList.add('show');
    }, 1200);
  });
}

/* ── Hero parallax (subtle) ── */
const heroBg = document.querySelector('.hero-pattern');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBg.style.transform = `translateY(${y * 0.25}px)`;
  }, { passive: true });
}
