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

// document.addEventListener('DOMContentLoaded', () => {
//   const track = document.getElementById('slider-track');
//   const prevBtn = document.getElementById('slider-prev');
//   const nextBtn = document.getElementById('slider-next');
//   const dots = document.querySelectorAll('.slider-dots__dot');
//   const cards = document.querySelectorAll('.slider-card');

// if (!track || !prevBtn || !nextBtn) return;

//   let currentIndex = 0;
//   const totalSlides = cards.length;

//   function updateSlider(index) {
//     currentIndex = index;

//     if (currentIndex < 0) {
//       currentIndex = totalSlides - 1;
//     } else if (currentIndex >= totalSlides) {
//       currentIndex = 0;
//     }

//     track.style.transform = `translateX(-${currentIndex * 100}%)`;

//     dots.forEach((dot, idx) => {
//       dot.classList.toggle('slider-dots__dot--active', idx === currentIndex);
//     });
//   }

//   nextBtn.addEventListener('click', () => updateSlider(currentIndex + 1));
//   prevBtn.addEventListener('click', () => updateSlider(currentIndex - 1));

//   dots.forEach(dot => {
//     dot.addEventListener('click', (e) => {
//       const index = Number(e.target.dataset.index);
//       updateSlider(index);
//     });
//   });

//   let startX = 0;
//   let endX = 0;

//   track.addEventListener('touchstart', (e) => {
//     startX = e.touches[0].clientX;
//   }, { passive: true });

//   track.addEventListener('touchend', (e) => {
//     endX = e.changedTouches[0].clientX;
//     handleSwipe();
//   }, { passive: true });

//   function handleSwipe() {
//     const diff = startX - endX;
//     if (Math.abs(diff) > 50) {
//       if (diff > 0) {
//         updateSlider(currentIndex + 1);
//       } else {
//         updateSlider(currentIndex - 1);
//       }
//     }
//   }
// });
// ---------------------------------------------------------
// document.addEventListener('DOMContentLoaded', () => {
//   const track = document.getElementById('slider-track');
//   const prevBtn = document.getElementById('slider-prev');
//   const nextBtn = document.getElementById('slider-next');
//   const dots = document.querySelectorAll('.slider-dots__dot');
//   const cards = document.querySelectorAll('.slider-card');

//   // Защита: если на странице нет элементов слайдера
//   if (!track || !prevBtn || !nextBtn || cards.length === 0) return;

//   let currentIndex = 0;
//   const totalSlides = cards.length;

//   function updateSlider(index) {
//     // Корректное зацикливание индексов
//     if (index < 0) {
//       currentIndex = totalSlides - 1;
//     } else if (index >= totalSlides) {
//       currentIndex = 0;
//     } else {
//       currentIndex = index;
//     }

//     // Сдвиг трека
//     track.style.transform = `translateX(-${currentIndex * 100}%)`;

//     // Переключение активности точек
//     dots.forEach((dot, idx) => {
//       dot.classList.toggle('slider-dots__dot--active', idx === currentIndex);
//     });
//   }

//   // Нажатие на стрелки
//   nextBtn.addEventListener('click', () => updateSlider(currentIndex + 1));
//   prevBtn.addEventListener('click', () => updateSlider(currentIndex - 1));

//   // Нажатие на индикаторы (dots)
//   dots.forEach((dot) => {
//     dot.addEventListener('click', (e) => {
//       // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: e.currentTarget гарантирует взятие dataset именно с кнопки
//       const targetDot = e.currentTarget;
//       const index = Number(targetDot.dataset.index);
//       if (!isNaN(index)) {
//         updateSlider(index);
//       }
//     });
//   });

//   // Поддержка свайпов на мобильных устройствах
//   let startX = 0;
//   let endX = 0;

//   track.addEventListener('touchstart', (e) => {
//     startX = e.touches[0].clientX;
//   }, { passive: true });

//   track.addEventListener('touchend', (e) => {
//     endX = e.changedTouches[0].clientX;
//     handleSwipe();
//   }, { passive: true });

//   function handleSwipe() {
//     const diff = startX - endX;
//     if (Math.abs(diff) > 50) { // Порог свайпа в 50px
//       if (diff > 0) {
//         updateSlider(currentIndex + 1); // Свайп влево -> следующий
//       } else {
//         updateSlider(currentIndex - 1); // Свайп вправо -> предыдущий
//       }
//     }
//   }
// });
// -----------------------------------------------------
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

  // Сдвигаем трек
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  // Переключаем активную полоску
  dots.forEach((dot, idx) => {
    const isActive = idx === currentIndex;
    dot.classList.toggle('slider-dots__dot--active', isActive);

    // КЛЮЧЕВОЙ МОМЕНТ: Перезапуск CSS-анимации
    const line = dot.querySelector('.slider-dots__line');
    if (line) {
      line.style.animation = 'none';
      void line.offsetWidth; // Принудительный reflow браузера
      line.style.animation = '';
    }
  });
}

  // Клики по кнопкам "Вперед" / "Назад"
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

  // Свайпы на мобильных устройствах
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
        updateSlider(currentIndex + 1); // Свайп влево
      } else {
        updateSlider(currentIndex - 1); // Свайп вправо
      }
    }
  }, { passive: true });
});