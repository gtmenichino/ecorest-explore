# `ecorest` Barred Owl Example

This repository contains a minimal R script that demonstrates the documented `ecorest` workflow for the built-in `barredowl` model.

## Prerequisite

`Rscript` must be available on your machine. On this machine it is already available.

## Run It

From `c:\Users\gtmen\Desktop\ProjectsCodex\ecorest-explore`, run:

```powershell
Rscript .\barredowl_example.R
```

On the first run, the script installs `ecorest` from CRAN using `https://cloud.r-project.org` if it is not already installed. Later runs reuse the installed package.

## Expected Result

For the built-in `HSImodels$barredowl` inputs in the script:

- Suitability indices should be approximately `1`, `0.1842105`, `1`
- Overall HSI should be approximately `0.4291975`
- With `habitat_quantity <- 100`, habitat units should be approximately `42.91975`

## Customize It

Edit the constants at the top of [barredowl_example.R](c:\Users\gtmen\Desktop\ProjectsCodex\ecorest-explore\barredowl_example.R):

- `model`
- `inputs`
- `habitat_quantity`

If you change `model`, update `inputs` so the names match the variables required by that model.
