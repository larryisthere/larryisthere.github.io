(() => {
  const key = 'site-theme';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const valid = value => ['system', 'light', 'dark'].includes(value);
  let preference = 'system';
  let select;
  try {
    const saved = localStorage.getItem(key);
    if (valid(saved)) preference = saved;
  } catch { /* System appearance also works when storage is unavailable. */ }

  const apply = () => {
    document.documentElement.dataset.theme = preference === 'system'
      ? (system.matches ? 'dark' : 'light') : preference;
    if (select) select.value = preference;
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
    const english = document.documentElement.lang.startsWith('en');
    const control = document.createElement('label');
    control.className = 'theme-control';
    const label = document.createElement('span');
    label.textContent = english ? 'Appearance' : '外观';
    select = document.createElement('select');
    select.name = 'appearance';
    const names = english ? ['System', 'Light', 'Dark'] : ['跟随系统', '浅色', '深色'];
    ['system', 'light', 'dark'].forEach((value, i) => {
      select.add(new Option(names[i], value));
    });
    select.value = preference;
    select.addEventListener('change', () => {
      preference = select.value;
      try { localStorage.setItem(key, preference); } catch { /* Apply for this page. */ }
      apply();
    });
    control.append(label, select);
    const footer = document.querySelector('.footer-row, .footer');
    if (footer) footer.append(control);
    else {
      const end = document.createElement('footer');
      end.className = 'theme-footer';
      end.append(control);
      document.body.append(end);
    }
  });
})();
