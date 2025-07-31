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
  colors = ['#4F46E5', '#A855F7', '#EC4899', '#22C55E', '#F59E0B', '#EF4444']
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
          size: Math.random() * 60 + 20, // 增大尺寸范围
          delay: Math.random() * 5,
          duration: Math.random() * 8 + 6, // 稍快一点的动画
          opacity: Math.random() * 0.2 + 0.1 // 增加透明度范围
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
          className="absolute animate-pulse rounded-lg"
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
            animationIterationCount: 'infinite',
            filter: 'blur(1px)', // 添加轻微模糊效果
            transition: 'all 0.3s ease'
          }}
        />
      ))}
      
      {/* 添加一些额外的浮动动画样式 */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(45deg) scale(1);
          }
          25% {
            transform: translateY(-10px) rotate(50deg) scale(1.05);
          }
          50% {
            transform: translateY(-20px) rotate(45deg) scale(0.95);
          }
          75% {
            transform: translateY(-10px) rotate(40deg) scale(1.02);
          }
        }
        
        .animate-float {
          animation: float infinite ease-in-out;
        }
      `}</style>
    </div>
  )
} 