cran_repo <- "https://cloud.r-project.org"
model <- "barredowl"
habitat_quantity <- 100
inputs <- c(
  num.trees.mtoe51cm.dbh.0.4ha = 4,
  avg.dbh.overstory.trees.cm = 20,
  can.cov.overstory.trees.pct = 60
)

install_or_update <- function(package, force = FALSE) {
  if (force || !requireNamespace(package, quietly = TRUE)) {
    action <- if (force) "Reinstalling" else "Installing"
    cat(sprintf("%s '%s' from CRAN...\n", action, package))
    install.packages(package, repos = cran_repo)
  }
}

install_or_update("ecorest")

if (!requireNamespace("ecorest", quietly = TRUE)) {
  install_or_update("R6", force = TRUE)
  if (!requireNamespace("ecorest", quietly = TRUE)) {
    install_or_update("ecorest", force = TRUE)
  }
}

if (!requireNamespace("ecorest", quietly = TRUE)) {
  stop("The 'ecorest' package could not be loaded after dependency repair.")
}

library(ecorest)

curves <- HSImodels[[model]]
if (is.null(curves)) {
  stop(sprintf("Model '%s' was not found in HSImodels.", model))
}

variable_names <- colnames(curves)[seq(1, ncol(curves), by = 2)]
missing_inputs <- setdiff(variable_names, names(inputs))
if (length(missing_inputs) > 0) {
  stop(sprintf(
    "Missing input values for: %s",
    paste(missing_inputs, collapse = ", ")
  ))
}

ordered_inputs <- unname(inputs[variable_names])
si <- SIcalc(curves, ordered_inputs)
model_hsi <- function(siv) HSIeqtn(model, siv, HSImetadata)
hsi <- model_hsi(si)
hu <- HUcalc(si, habitat_quantity, model_hsi)

cat(sprintf("ecorest example for model: %s\n\n", model))
cat("Model variables:\n")
print(variable_names)

cat("\nInput values:\n")
print(inputs[variable_names])

cat("\nSuitability indices:\n")
print(si)

cat("\nOverall HSI:\n")
print(hsi)

cat("\nHabitat units summary:\n")
print(hu)
