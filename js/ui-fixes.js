(function () {
  'use strict';

  if (window.__gamingToolsUiFixesLoaded) return;
  window.__gamingToolsUiFixesLoaded = true;

  function removeDuplicateCards(root = document) {
    root.querySelectorAll('.tool-grid, #suite-results, .suite-tool-grid').forEach((container) => {
      const seen = new Set();
      container.querySelectorAll('[data-tool-card]').forEach((card) => {
        const key = card.dataset.toolCard;
        if (!key || !seen.has(key)) {
          if (key) seen.add(key);
          return;
        }
        card.remove();
      });
    });
  }

  function install() {
    removeDuplicateCards();
    const observer = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof Element) removeDuplicateCards(node.parentElement || document);
      }));
    });
    observer.observe(document.querySelector('.page-wrap') || document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
