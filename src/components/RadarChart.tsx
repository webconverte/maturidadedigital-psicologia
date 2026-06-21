import React from 'react';

interface RadarChartProps {
  scores: {
    presence: number;
    instagram: number;
    whatsapp: number;
    metrics: number;
  };
}

export const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
  const width = 540;
  const height = 540;
  const centerX = width / 2;      // 270
  const centerY = height / 2;     // 270
  const maxRadius = 180;          // Maximized radar radius to leverage maximum space

  // Pillars list
  const pillars = [
    { key: 'presence', label: 'Presença & Google', maxVal: 100, val: scores.presence },
    { key: 'instagram', label: 'Instagram & Conteúdo', maxVal: 100, val: scores.instagram },
    { key: 'whatsapp', label: ' WhatsApp & Vendas', maxVal: 100, val: scores.whatsapp },
    { key: 'metrics', label: 'Dados & Gestão', maxVal: 100, val: scores.metrics },
  ];

  // Radar has 4 axes. Angles in degrees (0 = right, 90 = down, 180 = left, 270 = up)
  // Let's start with -90 (up) and rotate clockwise: Q1 (up), Q2 (right), Q3 (down), Q4 (left)
  const getCoordinates = (pIdx: number, val: number) => {
    const angleDeg = -90 + pIdx * 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    // Normalize value between 0 and 100
    const ratio = Math.max(0, Math.min(100, val)) / 100;
    const radius = maxRadius * ratio;
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);
    return { x, y };
  };

  // Generate background circles/grids for 25%, 50%, 75%, 100%
  const gridLevels = [25, 50, 75, 100];

  // Helper for straight lines or polygon points of grid
  const getGridPoints = (level: number) => {
    return pillars.map((_, idx) => {
      const { x, y } = getCoordinates(idx, level);
      return `${x},${y}`;
    }).join(' ');
  };

  // Points for current scores user path
  const userPoints = pillars.map((_, idx) => {
    const { x, y } = getCoordinates(idx, pillars[idx].val);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto">
      <div className="relative w-full max-w-full sm:max-w-[480px] mx-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            {/* High-fidelity branding gradient for user data */}
            <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C7F26B" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#88A65B" stopOpacity="0.55" />
            </radialGradient>
            
            {/* Drop shadow for custom indicators */}
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.4" floodColor="#000000" />
            </filter>
          </defs>
 
          {/* Draw Grid Web (radar shape - concentric squares/polygons since 4 pillars) */}
          {gridLevels.map((level, lIdx) => (
            <polygon
              key={`grid-${level}`}
              points={getGridPoints(level)}
              fill="none"
              stroke="#041840"
              strokeWidth={lIdx === gridLevels.length - 1 ? "1.5" : "1"}
              strokeDasharray={lIdx === gridLevels.length - 1 ? "0" : "3 3"}
            />
          ))}
 
          {/* Scale Labels */}
          {gridLevels.map((level) => {
            const { x, y } = getCoordinates(0, level); // vertical top axis values
            return (
              <text
                key={`value-lbl-${level}`}
                x={x - 12}
                y={y + 13}
                className="font-mono text-[10px] sm:text-[11px] fill-slate-400 font-bold"
              >
                {level}%
              </text>
            );
          })}
 
          {/* Draw Axis Lines */}
          {pillars.map((_, idx) => {
            const endpoint = getCoordinates(idx, 100);
            return (
              <line
                key={`axis-line-${idx}`}
                x1={centerX}
                y1={centerY}
                x2={endpoint.x}
                y2={endpoint.y}
                stroke="#041840"
                strokeWidth="1.5"
              />
            );
          })}
 
          {/* Dynamic filled user shape representing user's digital maturity */}
          <polygon
            points={userPoints}
            fill="url(#radarGrad)"
            stroke="#C7F26B"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="transition-all duration-700 ease-in-out"
          />
 
          {/* Data Points (Markers) & Hover states */}
          {pillars.map((p, idx) => {
            const { x, y } = getCoordinates(idx, p.val);
            return (
              <g key={`marker-grp-${idx}`} className="group cursor-help">
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  className="fill-web-lime stroke-web-dark stroke-2 shadow-lg transition-all duration-300 group-hover:scale-125 group-hover:fill-white"
                  filter="url(#softShadow)"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  className="fill-web-lime/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </g>
            );
          })}
 
          {/* Axis Labels (Pillar names) */}
          {pillars.map((p, idx) => {
            const point = getCoordinates(idx, 100);
            
            // Adjust offsets based on layout positions to avoid overlaps
            let textAnchor = "middle";
            let dy = "3";
            let dx = "0";
 
            if (idx === 0) { // Top (Presence)
              dy = "-18";
            } else if (idx === 1) { // Right (Instagram)
              textAnchor = "start";
              dx = "14";
              dy = "4";
            } else if (idx === 2) { // Bottom (Whatsapp)
              dy = "22";
            } else if (idx === 3) { // Left (Metrics)
              textAnchor = "end";
              dx = "-14";
              dy = "4";
            }
 
            return (
              <g key={`lbl-grp-${idx}`}>
                <text
                  x={point.x + Number(dx)}
                  y={point.y + Number(dy)}
                  textAnchor={textAnchor}
                  className="text-[11px] sm:text-[12px] font-bold fill-slate-100 font-display uppercase tracking-wider"
                >
                  {p.label}
                </text>
                <text
                  x={point.x + Number(dx)}
                  y={point.y + Number(dy) + 14}
                  textAnchor={textAnchor}
                  className="text-[12px] sm:text-[13px] font-mono fill-web-lime font-black"
                >
                  {p.val}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
 
      <div className="mt-5 grid grid-cols-2 gap-3.5 w-full text-xs sm:text-sm border-t border-web-dark/85 pt-4">
        {pillars.map((p) => (
          <div key={`legend-${p.key}`} className="flex items-center space-x-2 bg-web-dark/45 px-3 py-2 rounded-xl border border-web-green/5">
            <span className="w-2.5 h-2.5 rounded-full bg-web-lime shrink-0"></span>
            <span className="text-slate-300 font-semibold text-xs sm:text-sm truncate">{p.label}</span>
            <span className="font-mono text-web-lime ml-auto font-black text-xs sm:text-sm">{p.val}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
