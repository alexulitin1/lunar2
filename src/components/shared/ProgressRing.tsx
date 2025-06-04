import React, { useMemo } from 'react';

interface ProgressRingProps {
  totalSegments: number;
  completedSegments: number;
  size: number;
  strokeWidth: number;
  backgroundColor?: string;
  completedColor?: string;
  incompleteColor?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  totalSegments,
  completedSegments,
  size,
  strokeWidth,
  backgroundColor = '#f0f0f0',
  completedColor = '#6366f1',
  incompleteColor = '#d1d5db',
}) => {
  // Calculate dimensions
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  // Generate segments
  const segments = useMemo(() => {
    const segments = [];
    const anglePerSegment = (2 * Math.PI) / totalSegments;
    const gapAngle = Math.PI / 180; // 1 degree gap between segments
    
    for (let i = 0; i < totalSegments; i++) {
      const startAngle = i * anglePerSegment;
      const endAngle = (i + 1) * anglePerSegment - gapAngle;
      
      const startX = center + radius * Math.cos(startAngle - Math.PI / 2);
      const startY = center + radius * Math.sin(startAngle - Math.PI / 2);
      const endX = center + radius * Math.cos(endAngle - Math.PI / 2);
      const endY = center + radius * Math.sin(endAngle - Math.PI / 2);
      
      const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
      
      const d = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
      
      segments.push({
        d,
        isCompleted: i < completedSegments,
      });
    }
    
    return segments;
  }, [totalSegments, completedSegments, radius, center]);
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="progress-ring">
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
      />
      
      {/* Segments */}
      {segments.map((segment, index) => (
        <path
          key={index}
          d={segment.d}
          fill="none"
          stroke={segment.isCompleted ? completedColor : incompleteColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={`transition-all duration-500 ${segment.isCompleted ? 'opacity-100' : 'opacity-70'}`}
        />
      ))}
    </svg>
  );
};

export default ProgressRing;