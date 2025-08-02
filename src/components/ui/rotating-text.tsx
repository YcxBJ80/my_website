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
}

export function RotatingText({
  texts,
  mainClassName = "px-3 sm:px-4 md:px-6 bg-gradient-to-r from-monet-blue/20 to-monet-purple/20 text-monet-blue overflow-hidden py-1 sm:py-2 md:py-3 justify-center rounded-xl border border-monet-blue/30",
  splitLevelClassName = "overflow-hidden pb-1 sm:pb-2 md:pb-3",
  elementLevelClassName = "text-lg sm:text-xl md:text-2xl font-semibold",
  rotationInterval = 2000,
  staggerDuration = 0.05,
  staggerFrom = 'first',
  splitBy = 'characters',
  onNext
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsVisible(true);
        onNext?.(currentIndex);
      }, 150);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts.length, rotationInterval, currentIndex, onNext]);

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
    <div className={`flex items-center justify-center min-w-[200px] ${mainClassName}`}>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentIndex}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-120%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 400
            }}
            className="flex items-center justify-center"
          >
            {splitTexts.map((line, lineIndex) => (
              <div key={lineIndex} className={`${splitLevelClassName} flex items-center justify-center`}>
                {line.map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '-120%' }}
                    transition={{
                      type: 'spring',
                      damping: 30,
                      stiffness: 400,
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