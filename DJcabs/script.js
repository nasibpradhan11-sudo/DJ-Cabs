/* ============================================================
   DJCabs — script.js
   ============================================================ */

const WA_NUMBER = '917047889960'; // WhatsApp number
const WA_BASE = `https://wa.me/${WA_NUMBER}`;

/* ----------------------------------------------------------
   Navbar: scroll shrink + hamburger menu
   ---------------------------------------------------------- */
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!navbar) return;

  // Scroll handler
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Initial check
  if (window.scrollY > 50) navbar.classList.add('scrolled');

  // Hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close when link clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // Active link highlight
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ----------------------------------------------------------
   Hero background parallax zoom
   ---------------------------------------------------------- */
(function initHero() {
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;
  setTimeout(() => bg.classList.add('loaded'), 100);

  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.3;
    bg.style.transform = `translateY(${offset}px) scale(1)`;
  }, { passive: true });
})();

/* ----------------------------------------------------------
   Scroll fade-in (IntersectionObserver)
   ---------------------------------------------------------- */
(function initFadeIn() {
  const targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        el.target.classList.add('visible');
        observer.unobserve(el.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
})();

/* ----------------------------------------------------------
   Reviews Carousel (auto-advances every 4 s)
   ---------------------------------------------------------- */
(function initCarousel() {
  const track = document.querySelector('.carousel-track');
  const dotsWrap = document.querySelector('.carousel-dots');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  if (!track) return;

  const cards = track.querySelectorAll('.review-card');
  let current = 0;
  let autoTimer;

  // Build dots
  if (dotsWrap) {
    cards.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });
  }

  function getVisible() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function getCardWidth() {
    if (!cards.length) return 364;
    const style = getComputedStyle(cards[0]);
    return cards[0].offsetWidth + parseInt(style.marginRight || 0) + 24; // +gap
  }

  function goTo(idx) {
    const total = cards.length;
    const visible = getVisible();
    const max = Math.max(0, total - visible);
    current = Math.min(Math.max(idx, 0), max);

    const w = getCardWidth();
    track.style.transform = `translateX(-${current * w}px)`;

    // Update dots
    if (dotsWrap) {
      dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }
  }

  function next() { goTo(current + 1 >= Math.max(0, cards.length - getVisible()) + 1 ? 0 : current + 1); }
  function prev() { goTo(current <= 0 ? Math.max(0, cards.length - getVisible()) : current - 1); }

  if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(autoTimer); next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(autoTimer); prev(); startAuto(); });

  function startAuto() {
    autoTimer = setInterval(next, 4500);
  }
  startAuto();

  window.addEventListener('resize', () => goTo(current));
})();

/* ----------------------------------------------------------
   Book Cab Form → WhatsApp
   ---------------------------------------------------------- */
(function initBookCabForm() {
  const form = document.getElementById('bookCabForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const get = key => fd.get(key)?.trim() || '-';

    const msg = [
      '🚕 *New Cab Booking Request*',
      '',
      `👤 *Name:* ${get('name')}`,
      `📞 *Phone:* ${get('phone')}`,
      `📍 *Pickup:* ${get('pickup')}`,
      `🏁 *Drop:* ${get('drop')}`,
      `📅 *Start Date:* ${get('startDate')}`,
      `📅 *End Date:* ${get('endDate')}`,
      `🗓 *Days:* ${get('days')}`,
      `🚗 *Cab Type:* ${get('cabType')}`,
      `👥 *Passengers:* ${get('passengers')}`,
      '',
      'Please confirm availability and fare. Thank you!'
    ].join('\n');

    const url = `${WA_BASE}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
})();

/* ----------------------------------------------------------
   Custom Package Form → WhatsApp
   ---------------------------------------------------------- */
(function initCustomForm() {
  const form = document.getElementById('customPackageForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const get = key => fd.get(key)?.trim() || '-';

    const msg = [
      '✨ *Custom Package Enquiry*',
      '',
      `👤 *Name:* ${get('name')}`,
      `📞 *Phone:* ${get('phone')}`,
      `📍 *Destinations:* ${get('destinations')}`,
      `📅 *Start Date:* ${get('startDate')}`,
      `🗓 *Duration:* ${get('days')}`,
      `👥 *Group Size:* ${get('groupSize')}`,
      `🏨 *Accommodation:* ${get('accommodation')}`,
      `📝 *Special Requests:* ${get('notes')}`,
      '',
      'Please help me plan exploring Darjeeling!'
    ].join('\n');

    const url = `${WA_BASE}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
})();

/* ----------------------------------------------------------
   Smooth counter animation for stats
   ---------------------------------------------------------- */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const duration = 1800;
      const step = target / (duration / 16);

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString() + suffix;
        if (current >= target) clearInterval(timer);
      }, 16);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ----------------------------------------------------------
   WhatsApp button helper
   ---------------------------------------------------------- */
function waLink(customMsg) {
  const msg = customMsg || 'Hi, I want to book a cab';
  return `${WA_BASE}?text=${encodeURIComponent(msg)}`;
}

// Set all .wa-link hrefs
document.querySelectorAll('.wa-link').forEach(a => {
  const msg = a.dataset.msg || 'Hi, I want to book a cab';
  a.href = waLink(msg);
  a.target = '_blank';
  a.rel = 'noopener';
});
