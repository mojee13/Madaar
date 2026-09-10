import { useId, useState } from 'react';
import { number } from '../utils/format';
import { categoryMetrics } from '../data/analytics';
export function VisitsChart({ values, labels }: { values: number[]; labels: string[] }) {
  const id = useId().replaceAll(':', '');
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.ceil(Math.max(...values) / 500) * 500;
  const w = 680,
    h = 220,
    pad = 20;
  const points = values.map((v, i) => [
    pad + (i * (w - pad * 2)) / (values.length - 1),
    h - pad - (v / max) * (h - pad * 2),
  ]);
  const path = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
  return (
    <div className="visits-chart">
      <div className="chart-body">
        <div className="chart-y-axis">
          {[max, Math.round(max * 0.75), Math.round(max / 2), Math.round(max / 4), 0].map(
            (v, i) => (
              <span key={i}>{number(v)}</span>
            ),
          )}
        </div>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          role="img"
          aria-label={`بازدیدهای نمونه: ${values.map((v, i) => `${labels[i]} ${number(v)}`).join('، ')}`}
        >
          <defs>
            <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#83ae7b" stopOpacity=".28" />
              <stop offset="100%" stopColor="#83ae7b" stopOpacity=".01" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              x2={w}
              y1={pad + (i * (h - pad * 2)) / 4}
              y2={pad + (i * (h - pad * 2)) / 4}
              stroke="#e7ece8"
              strokeDasharray="4 5"
            />
          ))}
          <path d={`${path} L${w - pad},${h - pad} L${pad},${h - pad} Z`} fill={`url(#${id})`} />
          <path d={path} fill="none" stroke="#24694f" strokeWidth="3" strokeLinejoin="round" />
          {points.map(([x, y], i) => (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <circle cx={x} cy={y} r="16" fill="transparent" />
              <circle
                cx={x}
                cy={y}
                r={hover === i ? 6 : 4}
                fill="#fff"
                stroke="#24694f"
                strokeWidth="2"
              />
              {hover === i && (
                <g>
                  <rect
                    x={Math.min(w - 80, Math.max(0, x - 36))}
                    y={Math.max(0, y - 37)}
                    width="74"
                    height="26"
                    rx="6"
                    fill="#163c35"
                  />
                  <text
                    x={Math.min(w - 43, Math.max(37, x))}
                    y={Math.max(17, y - 19)}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="13"
                  >
                    {number(values[i])}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
      <div className="chart-x-axis" dir="ltr">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
      <details className="chart-data-details">
        <summary>مشاهده داده‌های نمودار</summary>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {labels.map((l) => (
                  <th key={l}>{l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {values.map((v, i) => (
                  <td key={i}>{number(v)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
export function CategoryChart() {
  let offset = 0;
  return (
    <div className="category-chart">
      <div className="donut">
        <svg viewBox="0 0 180 180" role="img" aria-label="سهم دسته‌ها از بازدید نمونه">
          <circle cx="90" cy="90" r="64" fill="none" stroke="#edf2ee" strokeWidth="22" />
          {categoryMetrics.map((c) => {
            const start = offset;
            offset += c.value;
            return (
              <circle
                key={c.name}
                cx="90"
                cy="90"
                r="64"
                fill="none"
                stroke={c.color}
                strokeWidth="22"
                pathLength="100"
                strokeDasharray={`${c.value - 1} ${101 - c.value}`}
                strokeDashoffset={-start}
                transform="rotate(-90 90 90)"
              />
            );
          })}
        </svg>
        <span>
          <strong>۱۰۰٪</strong>
          <small>بازدید محصولات</small>
        </span>
      </div>
      <div className="donut-legend">
        {categoryMetrics.map((c) => (
          <div key={c.name}>
            <span style={{ background: c.color }} />
            <span>{c.name}</span>
            <b>{number(c.value)}٪</b>
          </div>
        ))}
      </div>
    </div>
  );
}
