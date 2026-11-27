(function () {
  'use strict';

  const SCRIPT_URLS = [
    'js/typing.js',
    'js/suite.js',
    'js/feature-pack.js',
    'js/extra-tools.js',
    'js/ui-fixes.js'
  ];
  const STYLE_URLS = [
    'css/suite.css',
    'css/typing.css',
    'css/repair.css',
    'css/feature-pack.css',
    'css/extra-tools.css',
    'css/ui-polish.css'
  ];

  function loadStyles() {
    STYLE_URLS.forEach((href) => {
      if (document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    });
  }

  function loadScriptsSequentially() {
    if (window.__gamingToolsModulesLoaded) return;
    window.__gamingToolsModulesLoaded = true;

    let index = 0;
    const next = () => {
      if (index >= SCRIPT_URLS.length) return;
      const script = document.createElement('script');
      script.src = SCRIPT_URLS[index++];
      script.onload = next;
      script.onerror = () => {
        console.error(`GamingTools: failed to load ${script.src}`);
        next();
      };
      document.body.appendChild(script);
    };
    next();
  }

  function initKeyboard() {
    const panel = document.querySelector('#keyboard-panel');
    if (!panel || panel.dataset.keyboardReady === 'true') return;
    panel.dataset.keyboardReady = 'true';

    const $ = (selector) => document.querySelector(selector);
    const layout = $('#keyboard-layout');
    const historyEl = $('#keyboard-history');
    const view = $('#view-keyboard');
    if (!layout || !historyEl || !view) return;

    const rows = [
      ['Escape', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
      ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
      ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
      ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
      ['Control', 'Alt', ' ', 'Alt', 'Control']
    ];
    let count = 0;
    let recent = [];

    function keyLabel(key) {
      if (key === ' ') return 'Space';
      if (key === 'Control') return 'Ctrl';
      if (key === 'CapsLock') return 'Caps';
      return key;
    }

    function build() {
      layout.replaceChildren();
      rows.forEach((row) => {
        const line = document.createElement('div');
        line.className = 'key-row';
        row.forEach((label) => {
          const key = document.createElement('span');
          key.className = 'keycap';
          key.dataset.key = label.toLowerCase();
          key.textContent = keyLabel(label);
          if (label === ' ') key.classList.add('space-key');
          if (['Backspace', 'CapsLock', 'Enter', 'Shift', 'Control', 'Tab'].includes(label)) key.classList.add('wide-key');
          line.appendChild(key);
        });
        layout.appendChild(line);
      });
    }

    function render() {
      historyEl.replaceChildren();
      if (!recent.length) {
        const empty = document.createElement('span');
        empty.className = 'empty-state';
        empty.textContent = 'No keys pressed yet.';
        historyEl.appendChild(empty);
        return;
      }
      recent.forEach((item) => {
        const chip = document.createElement('span');
        chip.className = 'key-history-item';
        chip.textContent = item;
        historyEl.appendChild(chip);
      });
    }

    function reset() {
      count = 0;
      recent = [];
      layout.querySelectorAll('.keycap.pressed').forEach((el) => el.classList.remove('pressed'));
      $('#keyboard-count').textContent = '0';
      $('#keyboard-last').textContent = '—';
      $('#keyboard-code').textContent = '—';
      $('#keyboard-key').textContent = '—';
      $('#keyboard-location').textContent = '—';
      render();
    }

    function editable(target) {
      return target instanceof Element && Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
    }

    function matchingKey(event) {
      const normalized = event.key.toLowerCase();
      return [...layout.querySelectorAll('.keycap')].find((el) =>
        el.dataset.key === normalized || el.textContent.toLowerCase() === normalized
      );
    }

    function onKeyDown(event) {
      if (!view.classList.contains('active') || editable(event.target)) return;
      const keyEl = matchingKey(event);
      keyEl?.classList.add('pressed');
      if (event.repeat) return;

      const shown = event.key === ' ' ? 'Space' : event.key;
      count += 1;
      recent = [shown, ...recent].slice(0, 12);
      $('#keyboard-count').textContent = String(count);
      $('#keyboard-last').textContent = shown;
      $('#keyboard-code').textContent = event.code || '—';
      $('#keyboard-key').textContent = shown;
      $('#keyboard-location').textContent = String(event.location);
      render();
    }

    function onKeyUp(event) {
      matchingKey(event)?.classList.remove('pressed');
    }

    build();
    panel.addEventListener('click', () => panel.focus());
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    $('#keyboard-clear')?.addEventListener('click', reset);
    $('#keyboard-reset')?.addEventListener('click', reset);
    document.addEventListener('gamingtools:viewchange', () => {
      layout.querySelectorAll('.keycap.pressed').forEach((el) => el.classList.remove('pressed'));
    });
    render();
  }

  function init() {
    loadStyles();
    initKeyboard();
    loadScriptsSequentially();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
