'use client'

import { useEffect, useRef, useState } from 'react'

interface SquaresBackgroundProps {
  className?: string
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left'
  speed?: number
  borderColor?: string
  squareSize?: number
  hoverFillColor?: string
}

export function SquaresBackground({ 
  className = '',
  direction = 'diagonal',
  speed = 1,
  borderColor = '#999999',
  squareSize = 40,
  hoverFillColor = '#222222'
}: SquaresBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const offsetRef = useRef({ x: 0, y: 0 })
  const mouseRef = useRef({ x: -1, y: -1 })
  const [hoveredSquare, setHoveredSquare] = useState<{ row: number; col: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    const getMovementVector = () => {
      switch (direction) {
        case 'up': return { x: 0, y: -speed }
        case 'down': return { x: 0, y: speed }
        case 'left': return { x: -speed, y: 0 }
        case 'right': return { x: speed, y: 0 }
        case 'diagonal': return { x: speed * 0.7, y: speed * 0.7 }
        default: return { x: speed, y: 0 }
      }
    }

    const drawGrid = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = borderColor
      ctx.lineWidth = 1

      const cols = Math.ceil(canvas.width / squareSize) + 2
      const rows = Math.ceil(canvas.height / squareSize) + 2

      const offset = offsetRef.current

      // 绘制网格线
      ctx.beginPath()
      
      // 垂直线
      for (let i = 0; i < cols; i++) {
        const x = (i * squareSize + offset.x) % (canvas.width + squareSize) - squareSize
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
      }
      
      // 水平线
      for (let i = 0; i < rows; i++) {
        const y = (i * squareSize + offset.y) % (canvas.height + squareSize) - squareSize
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
      }
      
      ctx.stroke()

      // 绘制鼠标悬停的方块填充
      if (hoveredSquare) {
        const { row, col } = hoveredSquare
        const x = (col * squareSize + offset.x) % (canvas.width + squareSize) - squareSize
        const y = (row * squareSize + offset.y) % (canvas.height + squareSize) - squareSize
        
        if (x >= -squareSize && x < canvas.width && y >= -squareSize && y < canvas.height) {
          ctx.fillStyle = hoverFillColor
          ctx.fillRect(x, y, squareSize, squareSize)
        }
      }
    }

    const animate = () => {
      const movement = getMovementVector()
      offsetRef.current.x += movement.x
      offsetRef.current.y += movement.y

      // 保持偏移在合理范围内
      if (offsetRef.current.x > squareSize) offsetRef.current.x -= squareSize
      if (offsetRef.current.x < -squareSize) offsetRef.current.x += squareSize
      if (offsetRef.current.y > squareSize) offsetRef.current.y -= squareSize
      if (offsetRef.current.y < -squareSize) offsetRef.current.y += squareSize

      drawGrid()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      mouseRef.current = { x, y }
      
      // 计算鼠标悬停的方块
      const offset = offsetRef.current
      const col = Math.floor((x - offset.x + squareSize) / squareSize)
      const row = Math.floor((y - offset.y + squareSize) / squareSize)
      
      setHoveredSquare({ row, col })
    }

    const handleMouseLeave = () => {
      setHoveredSquare(null)
      mouseRef.current = { x: -1, y: -1 }
    }

    // 初始化
    resizeCanvas()
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('resize', resizeCanvas)
    
    // 开始动画
    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [direction, speed, borderColor, squareSize, hoverFillColor])

  return (
    <canvas 
      ref={canvasRef} 
      className={`w-full h-full border-none block pointer-events-auto ${className}`}
    />
  )
} 