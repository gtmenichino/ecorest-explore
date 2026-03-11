# Barred Owl HSI Explorer

This repository now contains a static web application for exploring the built-in `ecorest` barred owl model in the browser. Users can adjust the three habitat inputs, see each suitability curve update live, and share any scenario with a URL.

The original R parity script remains at [barredowl_example.R](/c:/Users/gtmen/Desktop/ProjectsCodex/ecorest-explore/barredowl_example.R).

## What it does

- Ports the verified `ecorest 2.0.1` barred owl model into browser-side TypeScript
- Visualizes the three suitability curves with live scenario markers
- Computes the three suitability indices, overall HSI, and habitat units
- Stores scenario state in the URL for easy sharing
- Builds to static files suitable for GitHub Pages

## Local development

Install dependencies:

```powershell
npm install
```

Start the dev server:

```powershell
npm run dev
```

Open the local URL printed by Vite.

## Build and preview

Create the production build:

```powershell
npm run build
```

Preview the built site locally:

```powershell
npm run preview
```

Run tests:

```powershell
npm test
```

## GitHub Pages

This app uses `base: "./"` in Vite so the built `dist/` output works as a static GitHub Pages site without a custom server.

Typical deployment flow:

1. Run `npm run build`
2. Publish the contents of `dist/` to GitHub Pages
3. Ensure Pages is configured to serve the built static files

If you use a GitHub Actions deployment workflow, publish the `dist/` directory as the Pages artifact.

## Model reference

The v1 web app does not run R in the browser. It ports the verified barred owl model behavior from `ecorest`:

- Tree count curve: `(0, 0.1)`, `(2, 1)`, `(4, 1)`
- Average DBH curve: `(0, 0)`, `(13, 0)`, `(51, 1)`
- Canopy cover curve: `(0, 0)`, `(20, 0)`, `(60, 1)`, `(100, 1)`
- Default scenario: `trees=4`, `dbh=20`, `canopy=60`, `qty=100`
- Verified outputs: `SI = [1, 0.1842105, 1]`, `HSI = 0.4291975`, `HU = 42.91975`
