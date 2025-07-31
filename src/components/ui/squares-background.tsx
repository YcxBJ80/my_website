'use client'

import { useEffect, useState } from 'react'

interface Square {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
  opacity: number
}

interface SquaresBackgroundProps {
  className?: string
  squareCount?: number
  colors?: string[]
}

export function SquaresBackground({ 
  className = '', 
  squareCount = 20,
  colors = ['#4F46E5', '#A855F7', '#EC4899', '#22C55E']
}: SquaresBackgroundProps) {
  const [squares, setSquares] = useState<Square[]>([])

  useEffect(() => {
    const generateSquares = () => {
      const newSquares: Square[] = []
      
      for (let i = 0; i < squareCount; i++) {
        newSquares.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 40 + 10,
          delay: Math.random() * 5,
          duration: Math.random() * 10 + 10,
          opacity: Math.random() * 0.1 + 0.05
        })
      }
      
      setSquares(newSquares)
    }

    generateSquares()
  }, [squareCount])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {squares.map((square, index) => (
        <div
          key={square.id}
          className="absolute animate-bounce rounded-lg"
          style={{
            left: `${square.x}%`,
            top: `${square.y}%`,
            width: `${square.size}px`,
            height: `${square.size}px`,
            backgroundColor: colors[index % colors.length],
            opacity: square.opacity,
            animationDelay: `${square.delay}s`,
            animationDuration: `${square.duration}s`,
            transform: 'rotate(45deg)',
            animationIterationCount: 'infinite'
          }}
        />
      ))}
    </div>
  )
} 