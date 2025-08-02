'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingTextProps {
  texts: string[];
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last' | 'center' | 'random' | number;
  splitBy?: 'characters' | 'words' | 'lines';
  onNext?: (index: number) => void;
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  loop?: boolean;
  auto?: boolean;
  animatePresenceMode?: 'sync' | 'wait';
  animatePresenceInitial?: boolean;
}

export function RotatingText({
  texts,
  mainClassName = "px-2 sm:px-2 md:px-3 bg-green-300 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg",
  splitLevelClassName = "overflow-hidden pb-0.5 sm:pb-1 md:pb-1",
  elementLevelClassName = "",
  rotationInterval = 2000,
  staggerDuration = 0.025,
  staggerFrom = 'last',
  splitBy = 'characters',
  onNext,
  initial = { y: '100%' },
  animate = { y: 0 },
  exit = { y: '-120%' },
  transition = { type: 'spring', damping: 30, stiffness: 400 },
  loop = true,
  auto = true,
  animatePresenceMode = 'wait',
  animatePresenceInitial = false
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!auto) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % texts.length;
          if (!loop && nextIndex === 0) {
            clearInterval(interval);
            return prevIndex;
          }
          return nextIndex;
        });
        setIsVisible(true);
        onNext?.(currentIndex);
      }, 150);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts.length, rotationInterval, currentIndex, onNext, loop, auto]);

  const splitText = (text: string) => {
    switch (splitBy) {
      case 'words':
        return text.split(' ').map(word => word.split(''));
      case 'lines':
        return text.split('\n').map(line => line.split(''));
      default:
        return [text.split('')];
    }
  };

  const currentText = texts[currentIndex];
  const splitTexts = splitText(currentText);

  return (
    <div className={`flex ${mainClassName}`}>
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        {isVisible && (
          <motion.div
            key={currentIndex}
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
            className="flex"
          >
            {splitTexts.map((line, lineIndex) => (
              <div key={lineIndex} className={`${splitLevelClassName}`}>
                {line.map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    transition={{
                      ...transition,
                      delay: staggerFrom === 'last' 
                        ? (line.length - charIndex - 1) * staggerDuration
                        : charIndex * staggerDuration
                    }}
                    className={elementLevelClassName}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 