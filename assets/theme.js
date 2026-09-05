(() => {
  const key = 'site-theme';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const valid = value => ['system', 'light', 'dark'].includes(value);
  let preference = 'system';
  let button;
  let english = false;
  try {
    const saved = localStorage.getItem(key);
    if (valid(saved)) preference = saved;
  } catch { /* System appearance also works when storage is unavailable. */ }

  const apply = () => {
    document.documentElement.dataset.theme = preference === 'system'
      ? (system.matches ? 'dark' : 'light') : preference;
    if (button) {
      const dark = document.documentElement.dataset.theme === 'dark';
      const label = english
        ? (dark ? 'Switch to light mode' : 'Switch to dark mode')
        : (dark ? '切换为浅色模式' : '切换为深色模式');
      button.setAttribute('aria-label', label);
      button.title = label;
    }
  };
  apply();
  system.addEventListener('change', apply);
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      preference = valid(event.newValue) ? event.newValue : 'system';
      apply();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    english = document.documentElement.lang.startsWith('en');
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    const icon = document.createElement('span');
    icon.className = 'theme-toggle__icon';
    icon.setAttribute('aria-hidden', 'true');
    button.append(icon);
    button.addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch { /* Apply for this page. */ }
      apply();
    });
    apply();
    const footer = document.querySelector('.footer-row, .footer');
    if (footer) footer.append(button);
    else {
      const end = document.createElement('footer');
      end.className = 'theme-footer';
      end.append(button);
      document.body.append(end);
    }
  });
})();
