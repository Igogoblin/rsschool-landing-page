document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');

  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  };

  // Инициализация темы при загрузке
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  // Клик по всей области переключателя
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.dataset.theme;
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.getElementById('burger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('nav a');

  function toggleMenu() {
    const isOpen = burgerBtn.classList.toggle('menu__btn--active');
    navMenu.classList.toggle('nav--active');
    document.body.classList.toggle('no-scroll');
    burgerBtn.setAttribute('aria-expanded', isOpen);
  }

  function closeMenu() {
    burgerBtn.classList.remove('menu__btn--active');
    navMenu.classList.remove('nav--active');
    document.body.classList.remove('no-scroll');
    burgerBtn.setAttribute('aria-expanded', 'false');
  }

  // Клик по бургеру
  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Если мы на десктопе (видно текст Menu), клик ведет на страницу menu.html
    if (window.innerWidth > 768) {
      window.location.href = './menu.html';
    } else {
      toggleMenu();
    }
  });

  // Закрытие при клике по любой ссылке меню
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Закрытие при клике вне меню
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
      closeMenu();
    }
  });
});
// слайдер
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('slider-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dots = document.querySelectorAll('.slider-dots__dot');
  const cards = document.querySelectorAll('.slider-card');

  let currentIndex = 0;
  const totalSlides = cards.length;

  // Обновление положения слайдера и индикаторов
  function updateSlider(index) {
    currentIndex = index;

    // Зацикливание вызова (с 3-го слайда переходит на 1-й и наоборот)
    if (currentIndex < 0) {
      currentIndex = totalSlides - 1;
    } else if (currentIndex >= totalSlides) {
      currentIndex = 0;
    }

    // Сдвиг трека на ширину 100% за каждый индекс
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Обновление активной полоски в dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('slider-dots__dot--active', idx === currentIndex);
    });
  }

  // Клик по кнопкам "Вперед" / "Назад"
  nextBtn.addEventListener('click', () => updateSlider(currentIndex + 1));
  prevBtn.addEventListener('click', () => updateSlider(currentIndex - 1));

  // Клик по полоскам (dots)
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = Number(e.target.dataset.index);
      updateSlider(index);
    });
  });

  // Поддержка свайпов на тач-экранах (для мобильных)
  let startX = 0;
  let endX = 0;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = startX - endX;
    if (Math.abs(diff) > 50) { // Минимальная дистанция для свайпа (50px)
      if (diff > 0) {
        updateSlider(currentIndex + 1); // Свайп влево
      } else {
        updateSlider(currentIndex - 1); // Свайп вправо
      }
    }
  }
});