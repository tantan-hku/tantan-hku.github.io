(() => {
  const body = document.body;
  const menuToggle = document.getElementById('menu-toggle-btn');
  const navLinks = document.getElementById('nav-links-menu');
  const overlay = document.getElementById('menu-overlay');
  const backToTop = document.getElementById('back-to-top-btn');

  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    }
  };

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  }

  overlay?.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('show'));
  }

  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle('visible', window.scrollY > window.innerHeight / 2);
    };
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });
  }
})();
