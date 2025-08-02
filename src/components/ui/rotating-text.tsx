'use client'

import { useState, useEffect } from 'react';

interface RotatingTextProps {
  staticText: string;
  rotatingWords: string[];
  className?: string;
  speed?: number;
}

export function RotatingText({ 
  staticText, 
  rotatingWords, 
  className = "", 
  speed = 2000 
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
        setIsVisible(true);
      }, 150);
    }, speed);

    return () => clearInterval(interval);
  }, [rotatingWords.length, speed]);

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className="text-gray-400">{staticText}</span>
      <span 
        className={`ml-2 text-monet-blue font-medium min-w-[200px] text-left transition-opacity duration-150 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {rotatingWords[currentIndex]}
      </span>
    </div>
  );
} 