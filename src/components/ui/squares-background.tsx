'use client'

import React, { useEffect, useRef } from 'react'

interface SquaresBackgroundProps {
  className?: string
  squareSize?: number
  gap?: number
  speed?: number
  opacity?: number
  color?: string
}

export function SquaresBackground({
  className = '',
  squareSize = 40,
  gap = 2,
  speed = 1,
  opacity = 0.3,
  color = '#6366f1'
}: SquaresBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const squares: Array<{
      x: number
      y: number
      size: number
      rotation: number
      rotationSpeed: number
      opacity: number
    }> = []

    // Initialize squares grid
    const cols = Math.ceil(canvas.width / (squareSize + gap))
    const rows = Math.ceil(canvas.height / (squareSize + gap))

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        squares.push({
          x: i * (squareSize + gap),
          y: j * (squareSize + gap),
          size: squareSize,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * speed,
          opacity: Math.random() * opacity
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      squares.forEach((square) => {
        ctx.save()
        ctx.translate(square.x + square.size / 2, square.y + square.size / 2)
        ctx.rotate((square.rotation * Math.PI) / 180)
        ctx.globalAlpha = square.opacity
        ctx.fillStyle = color
        ctx.fillRect(-square.size / 2, -square.size / 2, square.size, square.size)
        ctx.restore()

        square.rotation += square.rotationSpeed
        square.opacity = Math.sin(Date.now() * 0.001 + square.x * 0.01) * 0.3 + 0.2
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [squareSize, gap, speed, opacity, color])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  )
}