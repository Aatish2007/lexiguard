import React from 'react';

interface RiskGaugeProps {
  score: number;
  level?: 'LOW' | 'MEDIUM' | 'HIGH';
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, size = 180 }) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Semicircle or 270 degree arc
  const arcLength = circumference * 0.75;
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const strokeDashoffset = arcLength - (clampedScore / 100) * arcLength;

  // Determine effective risk level
  const effectiveLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
    level || (clampedScore > 70 ? 'HIGH' : clampedScore > 35 ? 'MEDIUM' : 'LOW');

  const RISK_COLORS = {
    HIGH: '#B42318',
    MEDIUM: '#B7791F',
    LOW: '#2F6B4F',
  };

  const riskColor = RISK_COLORS[effectiveLevel];
  let bgArcColor = '#e2e8f0';
  let statusText = 'Standard Legal Risk';
  let hindiText = 'कम जोखिम - सामान्य शर्तें';

  if (effectiveLevel === 'HIGH') {
    statusText = 'Significant Legal Risk';
    hindiText = 'अत्यधिक जोखिम - सावधान रहें';
  } else if (effectiveLevel === 'MEDIUM') {
    statusText = 'Moderate Legal Risk';
    hindiText = 'मध्यम जोखिम - संशोधन आवश्यक';
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full">
      {/* Circular Gauge Ring Container with exact bounding box */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-135"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={bgArcColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Colored progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={riskColor}
            className="transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Score & Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-sans leading-none tabular-nums">
            {clampedScore}
          </span>
          <span className="text-xs uppercase font-medium text-slate-400 tracking-wider mt-1.5">
            Risk Score / 100
          </span>
        </div>
      </div>

      {/* Risk Label & Hindi Text - at least 16px (mt-4 is 16px, using mt-5 for 20px) vertical spacing with proper text wrapping */}
      <div className="mt-5 flex flex-col items-center text-center gap-1.5 max-w-full px-2">
        <div
          className="inline-flex items-start text-left pl-2 border-l-2 max-w-full"
          style={{ borderColor: riskColor }}
        >
          <span
            className="text-xs sm:text-sm font-medium leading-snug break-words"
            style={{ color: riskColor }}
          >
            {effectiveLevel} RISK — {statusText}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium font-hindi break-words">
          {hindiText}
        </p>
      </div>
    </div>
  );
};
