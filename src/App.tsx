import { useEffect, useMemo, useState } from "react";
import CurveChart from "./CurveChart";
import {
  buildShareUrl,
  calculateHSI,
  calculateHabitatUnits,
  calculateSuitabilityIndices,
  clamp,
  curves,
  defaultInputs,
  parseInputsFromSearch,
  roundForDisplay,
  type InputKey,
  type Inputs
} from "./model";

type CardProps = {
  label: string;
  value: string;
  accent?: boolean;
};

function MetricCard({ label, value, accent = false }: CardProps) {
  return (
    <article className={accent ? "metric-card metric-card--accent" : "metric-card"}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function getInitialInputs(): Inputs {
  if (typeof window === "undefined") {
    return defaultInputs;
  }

  return parseInputsFromSearch(window.location.search);
}

export default function App() {
  const [inputs, setInputs] = useState<Inputs>(getInitialInputs);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const siValues = useMemo(() => calculateSuitabilityIndices(inputs), [inputs]);
  const hsi = useMemo(() => calculateHSI(siValues), [siValues]);
  const habitatUnits = useMemo(() => calculateHabitatUnits(hsi, inputs.qty), [hsi, inputs.qty]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("trees", String(inputs.trees));
    params.set("dbh", String(inputs.dbh));
    params.set("canopy", String(inputs.canopy));
    params.set("qty", String(inputs.qty));
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [inputs]);

  function updateInput(key: InputKey, value: number) {
    setInputs((current) => {
      if (key === "qty") {
        return { ...current, qty: Math.max(value, 0) };
      }

      const curve = curves.find((entry) => entry.key === key);
      if (!curve) {
        return current;
      }

      return {
        ...current,
        [key]: clamp(value, curve.min, curve.max)
      };
    });
    setCopyState("idle");
  }

  async function handleCopyLink() {
    try {
      const shareUrl = buildShareUrl(inputs, new URL(window.location.href));
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Barred Owl Habitat Explorer</p>
          <h1>Adjust forest conditions and see habitat suitability respond in real time.</h1>
          <p className="hero__lede">
            This static web app ports the built-in <code>ecorest</code> barred owl model into the
            browser. Share any scenario with a URL and compare how each input shifts the suitability
            curves, HSI, and habitat units.
          </p>
        </div>

        <div className="hero__summary">
          <MetricCard label="SI 1" value={roundForDisplay(siValues[0])} />
          <MetricCard label="SI 2" value={roundForDisplay(siValues[1])} />
          <MetricCard label="SI 3" value={roundForDisplay(siValues[2])} />
          <MetricCard label="HSI" value={roundForDisplay(hsi)} accent />
          <MetricCard label="Habitat Units" value={roundForDisplay(habitatUnits, 5)} accent />
        </div>
      </section>

      <section className="layout-grid">
        <aside className="control-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Scenario Inputs</p>
              <h2>Current conditions</h2>
            </div>
            <button className="ghost-button" type="button" onClick={() => setInputs(defaultInputs)}>
              Reset defaults
            </button>
          </div>

          <div className="control-list">
            {curves.map((curve, index) => (
              <label className="control" key={curve.key}>
                <div className="control__header">
                  <span>{curve.label}</span>
                  <strong>
                    {inputs[curve.key]} {curve.unit}
                  </strong>
                </div>
                <input
                  aria-label={curve.label}
                  type="range"
                  min={curve.min}
                  max={curve.max}
                  step={curve.step}
                  value={inputs[curve.key]}
                  onChange={(event) => updateInput(curve.key, Number(event.target.value))}
                />
                <input
                  aria-label={`${curve.label} value`}
                  className="control__number"
                  type="number"
                  min={curve.min}
                  max={curve.max}
                  step={curve.step}
                  value={inputs[curve.key]}
                  onChange={(event) => updateInput(curve.key, Number(event.target.value))}
                />
                <small>
                  Variable {index + 1}: <code>{curve.key}</code>
                </small>
              </label>
            ))}

            <label className="control">
              <div className="control__header">
                <span>Habitat quantity</span>
                <strong>{inputs.qty}</strong>
              </div>
              <input
                aria-label="Habitat quantity"
                type="range"
                min={0}
                max={500}
                step={1}
                value={inputs.qty}
                onChange={(event) => updateInput("qty", Number(event.target.value))}
              />
              <input
                aria-label="Habitat quantity value"
                className="control__number"
                type="number"
                min={0}
                max={500}
                step={1}
                value={inputs.qty}
                onChange={(event) => updateInput("qty", Number(event.target.value))}
              />
              <small>Habitat units are calculated as HSI × quantity.</small>
            </label>
          </div>

          <div className="panel-actions">
            <button className="primary-button" type="button" onClick={handleCopyLink}>
              Copy shareable link
            </button>
            <span className="panel-status" role="status">
              {copyState === "copied" && "Link copied."}
              {copyState === "error" && "Clipboard unavailable."}
            </span>
          </div>
        </aside>

        <section className="results-panel">
          <div className="results-panel__header">
            <div>
              <p className="eyebrow">Suitability Curves</p>
              <h2>Model response</h2>
            </div>
            <p>
              The highlighted marker shows your current input on each piecewise linear suitability
              curve.
            </p>
          </div>

          <div className="curve-grid">
            {curves.map((curve, index) => (
              <CurveChart
                key={curve.key}
                curve={curve}
                currentInput={inputs[curve.key]}
                currentSI={siValues[index]}
              />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
