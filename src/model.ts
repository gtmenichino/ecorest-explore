export type InputKey = "trees" | "dbh" | "canopy" | "qty";

export type Inputs = Record<InputKey, number>;

export type CurvePoint = {
  x: number;
  y: number;
};

export type CurveDefinition = {
  key: Exclude<InputKey, "qty">;
  label: string;
  shortLabel: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  points: CurvePoint[];
};

export const defaultInputs: Inputs = {
  trees: 4,
  dbh: 20,
  canopy: 60,
  qty: 100
};

export const curves: CurveDefinition[] = [
  {
    key: "trees",
    label: "Large trees per 0.4 ha plot",
    shortLabel: "Tree count",
    unit: "trees",
    min: 0,
    max: 6,
    step: 0.1,
    points: [
      { x: 0, y: 0.1 },
      { x: 2, y: 1 },
      { x: 4, y: 1 }
    ]
  },
  {
    key: "dbh",
    label: "Average diameter of overstory trees",
    shortLabel: "Average DBH",
    unit: "cm",
    min: 0,
    max: 60,
    step: 0.5,
    points: [
      { x: 0, y: 0 },
      { x: 13, y: 0 },
      { x: 51, y: 1 }
    ]
  },
  {
    key: "canopy",
    label: "Overstory canopy cover",
    shortLabel: "Canopy cover",
    unit: "%",
    min: 0,
    max: 100,
    step: 1,
    points: [
      { x: 0, y: 0 },
      { x: 20, y: 0 },
      { x: 60, y: 1 },
      { x: 100, y: 1 }
    ]
  }
];

export const plotDomainPadding = {
  trees: { min: 0, max: 6 },
  dbh: { min: 0, max: 60 },
  canopy: { min: 0, max: 100 }
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function interpolateCurve(points: CurvePoint[], input: number): number {
  if (points.length === 0) {
    throw new Error("Curve points are required.");
  }

  const sorted = [...points].sort((a, b) => a.x - b.x);

  if (input <= sorted[0].x) {
    return sorted[0].y;
  }

  const last = sorted[sorted.length - 1];
  if (input >= last.x) {
    return last.y;
  }

  for (let index = 0; index < sorted.length - 1; index += 1) {
    const left = sorted[index];
    const right = sorted[index + 1];
    if (input >= left.x && input <= right.x) {
      if (left.x === right.x) {
        return right.y;
      }
      const ratio = (input - left.x) / (right.x - left.x);
      return left.y + ratio * (right.y - left.y);
    }
  }

  return last.y;
}

export function calculateSuitabilityIndices(inputs: Inputs): number[] {
  return curves.map((curve) => interpolateCurve(curve.points, inputs[curve.key]));
}

// ecorest metadata marks barredowl as Eqtn = "CR"; the verified built-in
// barredowl outputs match sqrt(SI1 * SI2 * SI3).
export function calculateHSI(siValues: number[]): number {
  if (siValues.length !== 3) {
    throw new Error("Barred owl HSI requires exactly three suitability indices.");
  }

  const [si1, si2, si3] = siValues;
  return Math.sqrt(si1 * si2 * si3);
}

export function calculateHabitatUnits(hsi: number, quantity: number): number {
  return hsi * quantity;
}

export function roundForDisplay(value: number, digits = 6): string {
  return value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
}

export function buildShareUrl(inputs: Inputs, currentUrl: URL): string {
  const next = new URL(currentUrl.toString());
  next.searchParams.set("trees", String(inputs.trees));
  next.searchParams.set("dbh", String(inputs.dbh));
  next.searchParams.set("canopy", String(inputs.canopy));
  next.searchParams.set("qty", String(inputs.qty));
  return next.toString();
}

export function parseInputsFromSearch(search: string): Inputs {
  const params = new URLSearchParams(search);
  const values: Inputs = { ...defaultInputs };

  for (const curve of curves) {
    const raw = params.get(curve.key);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) {
        values[curve.key] = clamp(parsed, curve.min, curve.max);
      }
    }
  }

  const rawQty = params.get("qty");
  if (rawQty !== null) {
    const parsedQty = Number(rawQty);
    if (Number.isFinite(parsedQty)) {
        values.qty = clamp(parsedQty, 0, 500);
      }
    }

  return values;
}
