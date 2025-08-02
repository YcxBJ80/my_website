'use client'

import React, { useState, useEffect } from 'react'

interface RotatingTextProps {
  words: string[]
  duration?: number
  className?: string
}

export function RotatingText({
  words,
  duration = 2000,
  className = ''
}: RotatingTextProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
        setIsVisible(true)
      }, 150)
    }, duration)

    return () => clearInterval(interval)
  }, [words.length, duration])

  return (
    <span 
      className={`inline-block transition-all duration-150 ${className} ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
      }`}
    >
      {words[currentWordIndex]}
    </span>
  )
}