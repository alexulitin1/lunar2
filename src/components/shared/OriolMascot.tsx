import React from 'react';
import HaloOrbit from './HaloOrbit';

interface OriolMascotProps {
  size?: 'small' | 'medium' | 'large';
}

const OriolMascot: React.FC<OriolMascotProps> = ({ 
  size = 'medium',
}) => {
  const sizes = {
    small: { container: 120, ring: 120 },
    medium: { container: 200, ring: 200 },
    large: { container: 280, ring: 280 },
  };

  const currentSize = sizes[size];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: `${currentSize.container}px`,
        height: `${currentSize.container}px`,
      }}
    >
      <HaloOrbit className="absolute" />
    </div>
  );
};

export default OriolMascot;