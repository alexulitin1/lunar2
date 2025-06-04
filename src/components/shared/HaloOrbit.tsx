import React from 'react';

interface RingSpec { r: number; width: number; dur: number; dot: number; }
const rings: RingSpec[] = [
  { r:130, width:1, dur:60, dot:3 },
  { r:110, width:1, dur:45, dot:3 },
  { r: 90, width:1, dur:32, dot:2.5 },
  { r: 70, width:1, dur:24, dot:2.5 },
  { r: 50, width:1, dur:18, dot:2 },
];

const HaloOrbit: React.FC<{
  color?: string;
  dotColor?: string;
  className?: string;
}> = ({
  color='rgba(255,255,255,0.06)',
  dotColor='rgba(255,255,255,0.45)',
  className='',
}) => {
  const size = rings[0].r * 2; // 260
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`overflow-visible ${className}`}
    >
      {rings.map(({ r, width, dur, dot }, i) => {
        const animationStyle = {
          transformOrigin: '50% 50%',
          animation: `halo-spin-${i} ${dur}s linear infinite`,
          animationPlayState: 'running',
          willChange: 'transform'
        };
        
        return (
          <g key={i}>
            {/* upper half-ring */}
            <path
              d={`M ${size/2 - r},${size/2} a ${r} ${r} 0 0 1 ${r*2} 0`}
              fill="none"
              stroke={color}
              strokeWidth={width}
              style={animationStyle}
            />
            {/* satellite */}
            <circle
              cx={size/2 + r}
              cy={size/2}
              r={dot}
              fill={dotColor}
              style={animationStyle}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default HaloOrbit;