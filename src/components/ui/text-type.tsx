'use client'

import { useState, useEffect } from 'react'

interface TextTypeProps {
  text: string
  speed?: number
  showCursor?: boolean
  className?: string
  onComplete?: () => void
}

export function TextType({ 
  text, 
  speed = 100, 
  showCursor = true, 
  className = '', 
  onComplete 
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursorBlink, setShowCursorBlink] = useState(true)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  useEffect(() => {
    if (currentIndex >= text.length && showCursor) {
      const interval = setInterval(() => {
        setShowCursorBlink(prev => !prev)
      }, 530)

      return () => clearInterval(interval)
    }
  }, [currentIndex, text.length, showCursor])

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span 
          className={`inline-block w-0.5 h-[1em] bg-current ml-1 ${
            currentIndex >= text.length 
              ? (showCursorBlink ? 'opacity-100' : 'opacity-0') 
              : 'opacity-100'
          } transition-opacity duration-75`}
        />
      )}
    </span>
  )
} 