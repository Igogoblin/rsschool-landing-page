// ПЕРЕКЛЮЧЕНИЕ ТЕМЫ (LIGHT / DARK)

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');

  if (!themeToggle) return;

  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  };

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme;
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
});

// БУРГЕР-МЕНЮ И НАВИГАЦИЯ

document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (!burgerBtn || !navMenu) return;

  const navLinks = navMenu.querySelectorAll('a');
  const isMenuPage = window.location.pathname.includes('menu.html');

  function toggleMenu() {
    const isOpen = navMenu.classList.toggle('nav--active');
    burgerBtn.classList.toggle('menu__btn--active', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
    burgerBtn.setAttribute('aria-expanded', isOpen);
  }

  function closeMenu() {
    burgerBtn.classList.remove('menu__btn--active');
    navMenu.classList.remove('nav--active');
    document.body.classList.remove('no-scroll');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }

  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();

   if (window.innerWidth > 850 && !isMenuPage) {
      window.location.href = './menu.html';
      return;
    }

    toggleMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('nav--active') &&
      !navMenu.contains(e.target) &&
      !burgerBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 850) {
      closeMenu();
    }
  });
});

// СЛАЙДЕР (FAVORITE COFFEE)

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('slider-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dots = document.querySelectorAll('.slider-dots__dot');
  const cards = document.querySelectorAll('.slider-card');

  if (!track || !prevBtn || !nextBtn || cards.length === 0) return;

  let currentIndex = 0;
  const totalSlides = cards.length;

function updateSlider(index) {
  if (index < 0) {
    currentIndex = totalSlides - 1;
  } else if (index >= totalSlides) {
    currentIndex = 0;
  } else {
    currentIndex = index;
  }

  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  dots.forEach((dot, idx) => {
    const isActive = idx === currentIndex;
    dot.classList.toggle('slider-dots__dot--active', isActive);

    const line = dot.querySelector('.slider-dots__line');
    if (line) {
      line.style.animation = 'none';
      void line.offsetWidth;
      line.style.animation = '';
    }
  });
}

  nextBtn.addEventListener('click', () => updateSlider(currentIndex + 1));
  prevBtn.addEventListener('click', () => updateSlider(currentIndex - 1));

  // Клики по полоскам
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const index = Number(e.currentTarget.dataset.index);
      if (!isNaN(index)) {
        updateSlider(index);
      }
    });
  });

  let startX = 0;
  let endX = 0;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        updateSlider(currentIndex + 1);
      } else {
        updateSlider(currentIndex - 1);
      }
    }
  }, { passive: true });
});