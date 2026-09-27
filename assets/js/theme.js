(() => {
  const root = document.documentElement;
  const storageKey = 'jaewoo-academic-theme';

  root.classList.replace('no-js', 'js');

  try {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      root.dataset.theme = savedTheme;
    }
  } catch {}

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('#theme-toggle');
    const themeColor = document.querySelector('meta[name="theme-color"]');

    function updateTheme() {
      const isDark = root.dataset.theme === 'dark';
      const label = isDark ? button.dataset.lightLabel : button.dataset.darkLabel;

      button.setAttribute('aria-label', label);
      button.setAttribute('aria-pressed', String(isDark));
      button.title = label;
      themeColor.content = getComputedStyle(root).getPropertyValue('--paper').trim();
    }

    button.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      updateTheme();

      try {
        localStorage.setItem(storageKey, root.dataset.theme);
      } catch {}
    });

    updateTheme();
  });
})();
