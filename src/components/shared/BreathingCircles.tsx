import React from 'react';
import { motion } from 'framer-motion';

interface BreathingCirclesProps {
  phase: 'inhale' | 'hold' | 'exhale';
  durations: {
    inhale: number;
    hold: number;
    exhale: number;
  };
}

const BreathingCircles: React.FC<BreathingCirclesProps> = ({ phase, durations }) => {
  const circleVariants = {
    inhale: {
      scale: 1.2,
      opacity: 1,
      transition: { duration: durations.inhale, ease: 'easeInOut' }
    },
    hold: {
      scale: 1.2,
      opacity: 1,
      transition: { duration: durations.hold, ease: 'linear' }
    },
    exhale: {
      scale: 1,
      opacity: 0.3,
      transition: { duration: durations.exhale, ease: 'easeInOut' }
    }
  };

  const expandingCircleVariants = {
    initial: { 
      scale: 0.1,
      opacity: 0.3
    },
    animate: { 
      scale: 2,
      opacity: 0,
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  return (
    <div className="relative w-64 h-64">
      {/* Outer circle */}
      <motion.div
        className="absolute inset-0 rounded-full border border-space-star/10"
        animate={phase}
        variants={circleVariants}
      />

      {/* Middle circle */}
      <motion.div
        className="absolute inset-8 rounded-full border border-space-star/20"
        animate={phase}
        variants={circleVariants}
      />

      {/* Inner circle */}
      <motion.div
        className="absolute inset-16 rounded-full border border-space-star/30"
        animate={phase}
        variants={circleVariants}
      />

      {/* Expanding circle during hold phase */}
      {phase === 'hold' && (
        <motion.div
          className="absolute inset-16 rounded-full bg-space-star/5"
          initial="initial"
          animate="animate"
          variants={expandingCircleVariants}
        />
      )}
    </div>
  );
};

export default BreathingCircles;