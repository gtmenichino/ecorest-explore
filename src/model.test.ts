import { describe, expect, it } from "vitest";
import {
  calculateHSI,
  calculateHabitatUnits,
  calculateSuitabilityIndices,
  defaultInputs,
  parseInputsFromSearch
} from "./model";

describe("barred owl model calculations", () => {
  it("matches the verified default R example outputs", () => {
    const siValues = calculateSuitabilityIndices(defaultInputs);
    expect(siValues[0]).toBeCloseTo(1, 6);
    expect(siValues[1]).toBeCloseTo(0.1842105, 6);
    expect(siValues[2]).toBeCloseTo(1, 6);

    const hsi = calculateHSI(siValues);
    expect(hsi).toBeCloseTo(0.4291975, 6);
    expect(calculateHabitatUnits(hsi, defaultInputs.qty)).toBeCloseTo(42.91975, 5);
  });

  it("falls back to defaults for invalid query values", () => {
    const parsed = parseInputsFromSearch("?trees=abc&dbh=20&canopy=60&qty=-4");
    expect(parsed.trees).toBe(defaultInputs.trees);
    expect(parsed.dbh).toBe(20);
    expect(parsed.canopy).toBe(60);
    expect(parsed.qty).toBe(0);
  });
});
