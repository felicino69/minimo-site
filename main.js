document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
  }

  const portfolioFilters = document.querySelectorAll('.portfolio-filters .reel-tab');
  const creditGroups = document.querySelectorAll('.credit-group');
  portfolioFilters.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      portfolioFilters.forEach((t) => t.classList.toggle('active', t === tab));
      creditGroups.forEach((group) => {
        group.classList.toggle('hidden', filter !== 'all' && group.dataset.category !== filter);
      });
    });
  });

  const formTabs = document.querySelectorAll('.form-tabs .reel-tab');
  const contactForms = document.querySelectorAll('.contact-form');
  formTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.form;
      formTabs.forEach((t) => t.classList.toggle('active', t === tab));
      contactForms.forEach((f) => f.classList.toggle('active', f.dataset.form === target));
    });
  });

  const heroVideo = document.querySelector('.hero-reel-bg');
  const muteToggle = document.querySelector('.mute-toggle');
  if (heroVideo && muteToggle) {
    muteToggle.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      muteToggle.innerHTML = heroVideo.muted ? '&#128264;' : '&#128266;';
    });
  }

  const moduleCards = document.querySelectorAll('.module-card');
  const lightbox = document.querySelector('.lightbox');
  const lightboxVideo = lightbox ? lightbox.querySelector('video') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  document.querySelectorAll('.reel-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!lightbox || !lightboxVideo) return;
      lightboxVideo.src = btn.dataset.src;
      lightbox.classList.add('open');
      lightboxVideo.muted = false;
      lightboxVideo.play().catch(() => {});
    });
  });

  moduleCards.forEach((card) => {
    const preview = card.querySelector('video');
    card.addEventListener('mouseenter', () => preview && preview.play().catch(() => {}));
    card.addEventListener('mouseleave', () => preview && preview.pause());
    card.addEventListener('click', () => {
      if (!lightbox || !lightboxVideo) return;
      lightboxVideo.src = card.dataset.src;
      lightbox.classList.add('open');
      lightboxVideo.play().catch(() => {});
    });
  });

  function closeLightbox() {
    if (!lightbox || !lightboxVideo) return;
    lightbox.classList.remove('open');
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Autoplay tech-module previews when scrolled into view (muted, so allowed)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target.querySelector('video');
      if (!video) return;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
  }, { threshold: 0.4 });

  moduleCards.forEach((card) => observer.observe(card));
});
