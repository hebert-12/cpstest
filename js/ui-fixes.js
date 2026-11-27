(function () {
  'use strict';

  if (window.__gamingToolsUiFixesLoaded) return;
  window.__gamingToolsUiFixesLoaded = true;

  const STORAGE_KEY = 'gamingtools.ui.v1';
  const DEFAULT_THEME = {
    accent: '#9475ff',
    background: '#101114',
    panel: '#191b20',
    text: '#f1f1f3'
  };

  function readTheme() {
    try {
      return { ...DEFAULT_THEME, ...(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')) };
    } catch (error) {
      return { ...DEFAULT_THEME };
    }
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty('--purple', theme.accent);
    root.style.setProperty('--ui-accent', theme.accent);
    root.style.setProperty('--bg', theme.background);
    root.style.setProperty('--panel', theme.panel);
    root.style.setProperty('--text', theme.text);
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch (error) {
      console.warn('GamingTools: unable to save theme.', error);
    }
  }

  function removeDuplicateCards(root = document) {
    root.querySelectorAll('.tool-grid, #suite-results, .suite-tool-grid').forEach((container) => {
      const seen = new Map();
      container.querySelectorAll('[data-tool-card], .tool-card').forEach((card) => {
        const key = card.dataset.toolCard || card.dataset.open || card.querySelector('.tool-title')?.textContent?.trim();
        if (!key) return;
        if (!seen.has(key)) {
          seen.set(key, card);
        } else {
          card.remove();
        }
      });
    });
  }

  function removeDuplicateNavigation() {
    const seen = new Map();

    document.querySelectorAll('.main-nav [data-view], .mobile-nav-wrap [data-view], #mobile-nav option').forEach((element) => {
      const id = element.dataset.view || element.value;
      if (!id) return;
      if (!seen.has(id)) {
        seen.set(id, element);
      } else if (!element.matches('option')) {
        element.remove();
      }
    });

    const mobile = document.querySelector('#mobile-nav');
    if (mobile) {
      const optionIds = new Set();
      [...mobile.options].forEach((option) => {
        if (!option.value || optionIds.has(option.value)) {
          option.remove();
        } else {
          optionIds.add(option.value);
        }
      });
    }
  }

  function addThemeSettings() {
    const settingsView = document.querySelector('#view-settings');
    if (!settingsView) return;

    let panel = settingsView.querySelector('#theme-settings');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'theme-settings';
      panel.className = 'settings-card card theme-settings';
      panel.innerHTML = `
        <div class="settings-row theme-setting-heading">
          <div><b>Appearance colors</b><p>Choose colors for the accent, background, panels and text.</p></div>
          <button type="button" class="button secondary" id="theme-reset">Reset colors</button>
        </div>
        <div class="theme-color-grid">
          <label><span>Accent</span><input type="color" id="theme-accent" value="#9475ff"></label>
          <label><span>Background</span><input type="color" id="theme-background" value="#101114"></label>
          <label><span>Panels</span><input type="color" id="theme-panel" value="#191b20"></label>
          <label><span>Text</span><input type="color" id="theme-text" value="#f1f1f3"></label>
        </div>
      `;

      const existingCard = settingsView.querySelector('.settings-card');
      if (existingCard) {
        existingCard.after(panel);
      } else {
        settingsView.appendChild(panel);
      }
    }

    let theme = readTheme();
    applyTheme(theme);

    const fields = {
      accent: panel.querySelector('#theme-accent'),
      background: panel.querySelector('#theme-background'),
      panel: panel.querySelector('#theme-panel'),
      text: panel.querySelector('#theme-text')
    };

    Object.entries(fields).forEach(([name, input]) => {
      input.value = theme[name];
      input.addEventListener('input', () => {
        theme = { ...theme, [name]: input.value };
        applyTheme(theme);
        saveTheme(theme);
      });
    });

    panel.querySelector('#theme-reset').addEventListener('click', () => {
      theme = { ...DEFAULT_THEME };
      Object.entries(fields).forEach(([name, input]) => {
        input.value = theme[name];
      });
      applyTheme(theme);
      saveTheme(theme);
    }, { once: false });
  }

  function install() {
    applyTheme(readTheme());
    removeDuplicateCards();
    removeDuplicateNavigation();
    addThemeSettings();

    const observer = new MutationObserver((records) => {
      let shouldClean = false;
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) shouldClean = true;
        });
      });
      if (shouldClean) {
        removeDuplicateCards();
        removeDuplicateNavigation();
        addThemeSettings();
      }
    });

    observer.observe(document.querySelector('.page-wrap') || document.body, {
      childList: true,
      subtree: true
    });

    document.addEventListener('gamingtools:viewchange', () => {
      removeDuplicateCards();
      removeDuplicateNavigation();
      addThemeSettings();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
