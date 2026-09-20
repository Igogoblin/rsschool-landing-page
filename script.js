document.addEventListener('DOMContentLoaded', () => {
  const btnLight = document.getElementById('btn-light');
  const btnDark = document.getElementById('btn-dark');

  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  };

  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    setTheme(prefersDark ? 'dark' : 'light');
  }

  btnLight.addEventListener('click', () => {
    setTheme('light');
  });

  btnDark.addEventListener('click', () => {
    setTheme('dark');
  });
});