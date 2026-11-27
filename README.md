# GamingTools

A lightweight, responsive browser-based gaming performance toolkit built with HTML, CSS and vanilla JavaScript. Designed for GitHub Pages; no build step or framework required.

## Run locally

Open `index.html` in a browser, or serve this directory with any static HTTP server. The Clipboard and Share APIs may require HTTPS or localhost. All measurements run in the browser. Personal bests, preferences and recent tests are kept in localStorage on the current device.

## Tools

- **CPS Test:** 1–60 second test, optional right-click input, live rate, per-second chart, result sharing/copying and local personal best.
- **Reaction Time:** five randomized visual-cue rounds with false-start handling, round results and summary chart.
- **Aim Trainer:** 30-second target session with hit/miss accuracy and activity chart.
- **Cursor Test:** pointer path visualization and event-derived on-screen distance/speed estimates. It does not measure sensor drift.
- **Keyboard Test:** key highlighting, event code and recent key history.

## Deploy to GitHub Pages

In the repository settings, open **Pages**, select the `main` branch and `/ (root)` as the source, then save. The site uses relative asset paths and can also be hosted under a project subpath.

## Notes

- No example or fabricated performance results are used. A personal best appears only after a completed measured session.
- Browser event timing and rendering affect measurements. These tools are for personal comparison and practice, not laboratory-grade benchmarks.
- Google Fonts are an optional external font resource; system fallbacks are defined in the stylesheet.
