import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { CurveDefinition } from "./model";

type CurveChartProps = {
  curve: CurveDefinition;
  currentInput: number;
  currentSI: number;
};

export default function CurveChart({
  curve,
  currentInput,
  currentSI
}: CurveChartProps) {
  return (
    <article className="curve-card">
      <div className="curve-card__header">
        <div>
          <p className="eyebrow">{curve.shortLabel}</p>
          <h3>{curve.label}</h3>
        </div>
        <div className="curve-card__value">
          <span>{currentInput}</span>
          <small>
            SI {currentSI.toFixed(3)}
          </small>
        </div>
      </div>

      <div className="curve-chart">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={curve.points} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="4 6" stroke="rgba(73, 92, 77, 0.18)" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[curve.min, curve.max]}
              tickLine={false}
              axisLine={false}
            >
              <Label value={curve.unit} position="insideBottom" offset={-10} />
            </XAxis>
            <YAxis
              domain={[0, 1]}
              tickCount={6}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              formatter={(value) => [Number(value).toFixed(3), "Suitability Index"]}
              labelFormatter={(value) => `${curve.shortLabel}: ${value}`}
            />
            <Line
              type="linear"
              dataKey="y"
              stroke="#204936"
              strokeWidth={3}
              dot={{ r: 4, fill: "#204936", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
            <ReferenceDot
              x={currentInput}
              y={currentSI}
              r={7}
              fill="#d06f32"
              stroke="#fff7ee"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
