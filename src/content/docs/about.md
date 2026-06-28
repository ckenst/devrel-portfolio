---
title: About This Portfolio
description: Notes on how this public Starlight portfolio was adapted from PDF source material.
---

This site is a public, web-native version of a developer relations portfolio originally prepared as PDF material.

The source materials included:

- A private developer relations portfolio PDF created for a job application.
- An AI-generated portfolio draft with a tighter public-facing structure.

This Starlight version keeps the useful public signals and removes the PDF-first reading experience. The goal is to make the portfolio easier to browse, maintain, and link from GitHub Pages.

## Maintenance Notes

- Content lives in `src/content/docs/`.
- Navigation is configured in `astro.config.mjs`.
- GitHub Pages deployment is handled by `.github/workflows/deploy.yml`.
- The original PDFs remain in the repository root for reference and are not published as site assets.
