'use client'

import React, { useState, useEffect } from 'react'

interface TextTypeProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  cursorClassName?: string
  onComplete?: () => void
}

export function TextType({
  text,
  speed = 100,
  delay = 0,
  className = '',
  cursorClassName = '',
  onComplete
}: TextTypeProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      } else {
        onComplete?.()
      }
    }, currentIndex === 0 ? delay : speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, speed, delay, onComplete])

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)

    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <span className={className}>
      {displayText}
      <span 
        className={`inline-block ${cursorClassName} ${showCursor ? 'opacity-100' : 'opacity-0'}`}
        style={{ transition: 'opacity 0.1s' }}
      >
        |
      </span>
    </span>
  )
}