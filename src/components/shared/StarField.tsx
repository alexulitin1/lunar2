import React, { useEffect, useRef } from 'react';

const StarField: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${Math.random() * 2 + 1}px`;
      star.style.height = star.style.width;
      star.style.animationDelay = `${Math.random() * 3}s`;
      container.appendChild(star);

      const duration = 3000 + Math.random() * 2000;
      setTimeout(() => {
        star.remove();
      }, duration);
    };

    // Initial stars
    for (let i = 0; i < 150; i++) {
      createStar();
    }

    const interval = setInterval(() => {
      if (container.children.length < 200) {
        createStar();
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} className="star-field" />;
};

export default StarField;