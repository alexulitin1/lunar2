import React, { useState, useEffect, useRef } from 'react';
import { Pause, Play, SkipForward } from 'lucide-react';
import BreathingCircles from './BreathingCircles';

interface BreathingTimerProps {
  duration: number;
  onComplete: () => void;
}

const BreathingTimer: React.FC<BreathingTimerProps> = ({ duration, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [phaseTime, setPhaseTime] = useState(5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isUnmounting = useRef(false);

  const durations = {
    inhale: 5,
    hold: 3,
    exhale: 7
  };

  useEffect(() => {
    audioRef.current = new Audio('/audio/ritual.mp3');
    audioRef.current.volume = 0.5;
    audioRef.current.loop = true;

    return () => {
      isUnmounting.current = true;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (countdown === 3 && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (!isUnmounting.current) {
            console.error('Error playing audio:', error);
          }
        });
      }
    }
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isActive) {
      setIsActive(true);
    }
  }, [countdown, isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval as NodeJS.Timeout);
            setIsActive(false);
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            // Automatically call onComplete when timer reaches 0
            onComplete();
            return 0;
          }
          return prevTime - 1;
        });

        setPhaseTime((prevTime) => {
          if (prevTime <= 1) {
            if (breathingPhase === 'inhale') {
              setBreathingPhase('hold');
              return durations.hold;
            } else if (breathingPhase === 'hold') {
              setBreathingPhase('exhale');
              return durations.exhale;
            } else {
              setBreathingPhase('inhale');
              return durations.inhale;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, breathingPhase, onComplete]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    setIsPaused(!isPaused);
    if (audioRef.current) {
      if (isPaused) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            if (!isUnmounting.current) {
              console.error('Error playing audio:', error);
            }
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleSkip = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onComplete();
  };

  if (countdown > 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-6xl font-bold text-space-gray mb-4">{countdown}</div>
        <p className="text-space-gray/70">Подготовьтесь к дыхательной практике</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative mb-8">
        <BreathingCircles phase={breathingPhase} durations={durations} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-space-gray mb-2">
              {formatTime(timeLeft)}
            </div>
            <p className="text-space-gray/70">
              {breathingPhase === 'inhale' ? 'Вдох' : 
               breathingPhase === 'hold' ? 'Задержка' : 
               'Выдох'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={handlePlayPause}
          className="text-space-gray/70 hover:text-space-gray transition-colors duration-200"
        >
          {isPaused ? <Play size={32} /> : <Pause size={32} />}
        </button>
        <button
          onClick={handleSkip}
          className="text-space-gray/70 hover:text-space-gray transition-colors duration-200"
        >
          <SkipForward size={32} />
        </button>
      </div>
    </div>
  );
};

export default BreathingTimer;