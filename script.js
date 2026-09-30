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

document.addEventListener('DOMContentLoaded', () => {
  const menuList = document.getElementById('menu-list');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const tabs = document.querySelectorAll('.offer-tab');

  const modal = document.getElementById('product-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalSizes = document.getElementById('modal-sizes');
  const modalAddins = document.getElementById('modal-addins');
  const modalPrice = document.getElementById('modal-price');

  let productsData = [];
  let currentCategory = 'all';
  let isExpanded = false;

  let currentProduct = null;
  let selectedSizePrice = 0;
  let selectedAddinsPrice = 0;

  async function fetchProducts() {
    try {
      const response = await fetch('./products.json');
      if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
      productsData = await response.json();
      renderMenu();
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  }

  function renderMenu() {
    if (!menuList) return;
    menuList.innerHTML = '';

    const itemsToRender = currentCategory === 'all'
      ? productsData
      : productsData.filter(item => item.category === currentCategory);

    itemsToRender.forEach((item, index) => {
      const card = document.createElement('div');
      card.classList.add('menu-list__item');
      card.dataset.id = item.id || index;

      if (window.innerWidth <= 768 && index >= 4 && !isExpanded) {
        card.classList.add('menu-list__item--hidden');
      }

      card.innerHTML = `
        <div class="menu-list__item-img">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="menu-list__item-info">
            <h2 class="menu-list__item-title">${item.name}</h2>
            <p class="menu-list__item-text">${item.description}</p>
            <p class="menu-list__item-price">$${item.price}</p>
        </div>
      `;

      card.addEventListener('click', () => openModal(item));

      menuList.appendChild(card);
    });

    updateLoadMoreButton(itemsToRender.length);
  }

  function openModal(item) {
    currentProduct = item;
    selectedSizePrice = 0;
    selectedAddinsPrice = 0;

    modalImg.src = item.image;
    modalImg.alt = item.name;
    modalTitle.textContent = item.name;
    modalDescription.textContent = item.description;

    renderSizes(item.sizes);

    renderAddins(item.addins);

    updateTotalPrice();

    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');

    document.addEventListener('keydown', handleEscKey);
  }

  function closeModal() {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');

    document.removeEventListener('keydown', handleEscKey);
  }

  function handleEscKey(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }
  function renderSizes(sizes) {
    modalSizes.innerHTML = '';
    if (!sizes) return;

    const sizeKeys = Object.keys(sizes);
    sizeKeys.forEach((key, idx) => {
      const sizeObj = sizes[key];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.classList.add('modal-option-btn');
      if (idx === 0) btn.classList.add('modal-option-btn--active');

      btn.innerHTML = `
        <span class="modal-option-btn__icon">${key.toUpperCase()}</span>
        <span>${sizeObj.size}</span>
      `;

      btn.addEventListener('click', () => {
        modalSizes.querySelectorAll('.modal-option-btn').forEach(b => b.classList.remove('modal-option-btn--active'));
        btn.classList.add('modal-option-btn--active');
        selectedSizePrice = parseFloat(sizeObj['add-price']) || 0;
        updateTotalPrice();
      });

      modalSizes.appendChild(btn);
    });
  }

  function renderAddins(addins) {
    modalAddins.innerHTML = '';
    if (!addins) return;

    addins.forEach((addin, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.classList.add('modal-option-btn');

      btn.innerHTML = `
        <span class="modal-option-btn__icon">${idx + 1}</span>
        <span>${addin.name}</span>
      `;

      btn.addEventListener('click', () => {
        btn.classList.toggle('modal-option-btn--active');

        const activeAddins = modalAddins.querySelectorAll('.modal-option-btn--active');
        selectedAddinsPrice = activeAddins.length * (parseFloat(addin['add-price']) || 0);
        updateTotalPrice();
      });

      modalAddins.appendChild(btn);
    });
  }

  function updateTotalPrice() {
    if (!currentProduct) return;
    const basePrice = parseFloat(currentProduct.price) || 0;
    const totalPrice = (basePrice + selectedSizePrice + selectedAddinsPrice).toFixed(2);
    modalPrice.textContent = `$${totalPrice}`;
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
 if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  function updateLoadMoreButton(totalItems) {
    if (!loadMoreBtn) return;
    if (window.innerWidth <= 768 && totalItems > 4 && !isExpanded) {
      loadMoreBtn.classList.add('menu-more-btn--visible');
    } else {
      loadMoreBtn.classList.remove('menu-more-btn--visible');
    }
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      isExpanded = true;
      const hiddenCards = menuList.querySelectorAll('.menu-list__item--hidden');
      hiddenCards.forEach(card => card.classList.remove('menu-list__item--hidden'));
      loadMoreBtn.classList.remove('menu-more-btn--visible');
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const currentTab = e.currentTarget;
      currentCategory = currentTab.dataset.tab;
      isExpanded = false;

      tabs.forEach(t => t.classList.remove('offer-tab--active'));
      currentTab.classList.add('offer-tab--active');

      renderMenu();
    });
  });

  window.addEventListener('resize', () => {
    renderMenu();
  });

  fetchProducts();
});